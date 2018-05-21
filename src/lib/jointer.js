import tool from './tool';
import qiniu from './qiniu';

const request = (params) => {
    return new Promise((resolve, reject) => {
        wx.showLoading();
        wx.request({
            url: `https://wegdut.yoricklee.com/test${params.url}`,
            method: params.method || 'POST',
            header: params.header || { Authorization: wx.getStorageSync('token') || '' },
            data: { ...params.data },
            success: (res) => {
                switch (res.data.code) {
                    case 200: resolve(res.data); break;
                    case 201: resolve(res.data); break;
                    case 402: wx.showToast({ title: '402 - 未获取到token! 请重新登录~', icon: 'none' }); resolve(res.data); break;
                    case 403: wx.showToast({ title: '403 - 缺少参数！请反馈您的问题给我们，谢谢~', icon: 'none' }); resolve(res.data); break;
                    case 404: wx.showToast({ title: '404 - 部分数据未找到！请尝试重新登陆，谢谢~', icon: 'none' }); resolve(res.data); break;
                    case 500: wx.showToast({ title: '500 - 内部错误！请尝试重新登陆，谢谢~', icon: 'none' }); resolve(res.data); break;
                    case 505: wx.showToast({ title: '505 - cookie过期！请重新登录~', icon: 'none' }); resolve(res.data); break;
                    default: reject(); break;
                }
            },
            fail: reject,
            complete: wx.hideLoading,
        });
    });
};

const getProofUrl = () => {
    return new Promise(async (resolve) => {
        const { url, cookie, ua } = (await request({ url: '/jwgl/sendYzm', method: 'GET' })).data;
        wx.setStorageSync('cookie', cookie);
        wx.setStorageSync('ua', ua);
        resolve(url);
    });
};

const getToken = ($code) => {
    return new Promise(async (resolve) => {
        const { data } = await request({ url: '/wechatToken', method: 'GET', data: { code: $code } });
        wx.setStorageSync('token', data.token);
        wx.setStorageSync('uid', data.uid);
        resolve();
    });
};

const updateUserInfo = ($data) => {
    return new Promise(async (resolve, reject) => {
        const res = await request({
            url: '/updateInfo',
            data: $data,
        });
        switch (res.code) {
            case 200: resolve(); break;
            default: reject(); break;
        }
    });
};

const login = ($data) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/jwgl/login',
            header: { Authorization: wx.getStorageSync('token') || '' },
            data: Object.assign($data, { cookie: wx.getStorageSync('cookie'), ua: wx.getStorageSync('ua') }),
        });
        wx.setStorageSync('token', res.data.token);
        resolve(res.code);
    });
};

const getCalendar = () => {
    return new Promise(async (resolve) => {
        const calendar = await request({
            url: '/calendarNext',
            method: 'GET',
        });
        resolve(calendar);
    });
};

const getCourse = () => {
    return new Promise(async (resolve, reject) => {
        const res = await request({ url: '/jwgl/course' });
        switch (res.code) {
            case 200: wx.setStorageSync('course', res.data.rows);
                wx.setStorageSync('firstDay', res.data.firstDay);
                wx.setStorageSync('term', res.data.term);
                wx.setStorageSync('lessonCount', res.data.total);
                wx.setStorageSync('weekNum', res.data.weekNum);
                resolve(res.data.rows);
                break;
            default: reject(); break;
        }
    });
};

const getGrade = () => {
    return new Promise(async (resolve) => {
        const res = await request({ url: '/jwgl/score' });
        switch (res.code) {
            case 200: {
                const grade = {};
                Object.keys(res.data).forEach((term) => {
                    grade[term] = [];
                    res.data[term].forEach((item) => {
                        grade[term].push({
                            name: item.kcmc,
                            credit: Number(item.xf),
                            score: item.zcj,
                            gpa: Number(item.cjjd),
                            isElective: item.kcdlmc === '公共选修课',
                        });
                    });
                });
                resolve(grade);
                break;
            }
            default: break;
        }
    });
};

const getExam = ($isRefresh = false) => {
    const getColor = ($surplus) => {
        if ($surplus > 30) return '#28D9A5';
        else if ($surplus > 7) return '#FFD92B';
        else if ($surplus >= 0) return '#F56262';
        return '#888888';
    };
    return new Promise(async (resolve) => {
        if (wx.getStorageSync('exam') && !$isRefresh) {
            resolve(wx.getStorageSync('exam').map((item) => {
                const surplus = Math.ceil((item.stamp - Date.now()) / 86400000);
                return Object.assign(item, { surplus, color: getColor(surplus) });
            }));
        } else {
            const { data } = await request({ url: '/jwgl/exam', method: 'GET' });
            const list = data.rows.map((item) => {
                const stamp = new Date(item.date).getTime();
                const surplus = Math.ceil((stamp - Date.now()) / 86400000);
                return {
                    stamp,
                    surplus,
                    name: item.name,
                    time: `${item.date}  周${item.day}  ${item.time}`,
                    site: `${item.campus}  ${item.site}`,
                    color: getColor(surplus),
                };
            });
            wx.setStorageSync('exam', list);
            resolve(list.sort((a, b) => a.stamp - b.stamp));
        }
    });
};

const searchBook = (keyword) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutlibrary/list',
            method: 'GET',
            data: { keyword },
        });
        const list = res.data.find_ifa_FindFullPage_list1;
        const whiteKeys = ['no', 'rd', 'name', 'author'];
        list.forEach((item, i) => {
            list[i].no = item.CtrlNo;
            list[i].rd = item.CtrlRd;
            list[i].name = item.Title;
            list[i].author = item.Author;
            Object.keys(item).forEach((key) => {
                if (whiteKeys.indexOf(key) === -1) {
                    delete list[i][key];
                }
            });
        });
        resolve(list);
    });
};

const getBook = (data) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutlibrary/detail',
            method: 'GET',
            data,
        });
        const book = {};
        const setInfo = ($info) => {
            const str = tool.btoa($info);
            book.img = str.match(/<center[^>]*>[\s\S]*?<\/[^>]*center>/gi)[0].slice(18, -11);
            const arr = str.match(/<td[^>]*>[\s\S]*?<\/[^>]*td>/gi).map((item) => {
                return item.slice(4, -5);
            });
            arr.forEach((item, i) => {
                switch (item) {
                    case '价格': book.price = arr[i + 1]; break;
                    case '出版社': book.press = arr[i + 1]; break;
                    case 'ISBN': book.isbn = arr[i + 1]; break;
                    default: break;
                }
            });
        };
        const setIntro = ($intro) => {
            book.intro = $intro;
        };
        const setCatalog = ($catalog) => {
            book.catalog = tool.btoa($catalog).slice(14).replace(/&.*?;/g, '');
        };
        const setMap = ($site) => {
            book.map = $site.map((item) => {
                return {
                    lib: item.Room,
                    site: item.position || '未查询到位置信息',
                    status: item.Status,
                };
            });
        };
        setInfo(res.data.DetailInfo);
        setIntro(res.data.DetailIntro);
        setCatalog(res.data.DetailContents);
        setMap(res.data.DetailCollection);
        resolve(book);
    });
};

const getStore = () => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutlibrary/book',
        });
        resolve(res);
    });
};

const getNews = () => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutnews',
            method: 'GET',
        });
        resolve(res.data.news_ifw_Accs_GetList_list1.map((item) => {
            return {
                rd: item.NewsRd,
                type: item.Colu,
                name: item.Title,
                unit: item.Unit,
                time: item.RelDate,
            };
        }));
    });
};

const getNotice = ($rd) => {
    return new Promise(async (resolve) => {
        const res = await request({
            method: 'GET',
            url: '/gdutnews/detail',
            data: { NewsRd: $rd },
        });
        resolve(res.data);
    });
};

const getCards = ($time = 0, $isMy = false) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: `/gdutWall/get${$isMy ? 'My' : 'All'}Post`,
            method: 'GET',
            data: { time: $time },
        });
        const cards = res.data.map((item) => {
            /* eslint-disable no-underscore-dangle */
            return {
                id: item._id,
                avatar: item.isAnon ? 'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.vyTbWxZnOxIu3f6051380cd24c57ba5aba91693340ba.png' : item.user_id.avatarUrl,
                nickname: item.isAnon ? '匿名同学' : item.user_id.nickName,
                stamp: item.createdAt,
                time: tool.getLapseTime(item.createdAt * 1000),
                device: item.phone || '未知设备',
                text: item.content,
                img: item.imgUrl,
                likes: item.likes,
                isLike: item.isLiked,
                comments: item.comments.map((comment) => {
                    return {
                        avatar: comment.isAnon ? 'http://oox3shbsf.bkt.clouddn.com/tmp/wx45380ff8bc1c2e10.o6zAJsyFJyypE_zOyMM45R8FzfGA.vyTbWxZnOxIu3f6051380cd24c57ba5aba91693340ba.png' : comment.from_id.avatarUrl,
                        nickname: comment.isAnon ? '匿名同学' : comment.from_id.nickName,
                        text: comment.content,
                    };
                }),
                isComment: (() => {
                    let mark = false;
                    for (let i = 0; i < item.comments.length; i += 1) {
                        if (wx.getStorageSync('uid') === item.comments[i].from_id._id) {
                            mark = true;
                            break;
                        }
                    }
                    return mark;
                })(),
            };
        }) || [];
        resolve(cards);
    });
};

const sendCard = ($data) => {
    const uploadImg = (img) => {
        return new Promise((resolve, reject) => {
            if (img) {
                qiniu.upload(img, (res) => {
                    resolve(`http://${res.imageURL}`);
                }, (err) => {
                    console.log(err);
                    reject(err);
                }, {
                    uploadURL: 'https://up-z2.qbox.me',
                    domain: 'oox3shbsf.bkt.clouddn.com/',
                    uptokenURL: 'https://wegdut.yoricklee.com/uptoken',
                });
            } else {
                resolve('');
            }
        });
    };
    return new Promise(async (resolve, reject) => {
        const res = await request({
            url: '/gdutWall/send',
            data: Object.assign($data, {
                imgUrl: await uploadImg($data.imgUrl),
            }),
        });
        switch (res.code) {
            case 200: resolve(); break;
            default: reject(); break;
        }
    });
};

const deleteCard = ($id) => {
    return new Promise(async (resolve, reject) => {
        const res = await request({
            method: 'DELETE',
            url: `/gdutWall/deletePost?post_id=${$id}`,
        });
        switch (res.code) {
            case 200: resolve(); break;
            default: reject(); break;
        }
    });
};

const sendComment = (data) => {
    return new Promise(async (resolve, reject) => {
        const res = await request({
            url: '/gdutWall/comment',
            data,
        });
        switch (res.code) {
            case 200: resolve(); break;
            default: reject(); break;
        }
    });
};

const like = (data) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutWall/like',
            data,
        });
        switch (res.code) {
            case 200: resolve(res.code); break;
            case 201: resolve(res.code); break;
            case 500: resolve(res.code); break;
            default: break;
        }
    });
};

const sendSuggestion = (suggestion) => {
    return new Promise((resolve) => {
        request({
            url: '/suggestion',
            data: { suggestion },
        });
        resolve();
    });
};

export default {
    getProofUrl,
    getToken,
    updateUserInfo,
    login,
    getCalendar,
    getCourse,
    getGrade,
    getExam,
    searchBook,
    getBook,
    getStore,
    getNews,
    getNotice,
    getCards,
    sendCard,
    deleteCard,
    sendComment,
    like,
    sendSuggestion,
};
