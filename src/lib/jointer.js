import tool from './tool';

const request = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://wegdut.yoricklee.com/test${params.url}`,
            method: params.method || 'POST',
            header: params.header || { Authorization: wx.getStorageSync('token') || '' },
            data: { ...params.data },
            success: res => resolve(res.data),
            fail: reject,
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

const getToken = ($data) => {
    return new Promise(async (resolve) => {
        const { data } = await request({ url: '/wechatToken', method: 'GET', data: $data });
        wx.setStorageSync('wechatToken', data);
        resolve(data);
    });
};

const login = ($data) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/jwgl/login',
            header: { Authorization: wx.getStorageSync('wechatToken') || '' },
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
    return new Promise(async (resolve) => {
        const res = await request({ url: '/jwgl/course' });
        resolve(res);
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
                            score: item.zcj,
                            gpa: Number(item.cjjd),
                            isElective: item.xdfsmc === '选修',
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

const getExam = () => {
    return new Promise(async (resolve) => {
        const { data } = await request({ url: '/jwgl/exam', method: 'GET' });
        const list = data.rows;
        list.forEach((item, i) => {
            list[i].stamp = new Date(item.date).getTime();
            list[i].time = `${item.date}  周${item.day}  ${item.time}`;
            list[i].site = `${item.campus}  ${item.site}`;
            list[i].surplus = Math.ceil((list[i].stamp - Date.now()) / 86400000);
            list[i].color = (() => {
                if (list[i].surplus > 30) return '#28D9A5';
                else if (list[i].surplus > 7) return '#FFD92B';
                else if (list[i].surplus >= 0) return '#F56262';
                return '#888888';
            })();
            delete list[i].date;
            delete list[i].day;
            delete list[i].campus;
        });
        resolve(tool.quickSort(list, 'stamp').reverse());
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
        setInfo(res.DetailInfo);
        setIntro(res.DetailIntro);
        setCatalog(res.DetailContents);
        setMap(res.DetailCollection);
        console.log(book.map);
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
            method: 'GET',
            url: '/gdutnews',
        });
        const list = res.news_ifw_Accs_GetList_list1;
        const whiteList = ['rd', 'type', 'name', 'unit', 'time'];
        list.forEach((item, i) => {
            list[i].rd = item.NewsRd;
            list[i].type = item.Colu;
            list[i].name = item.Title;
            list[i].unit = item.Unit;
            list[i].time = item.RelDate;
            Object.keys(item).forEach((key) => {
                if (whiteList.indexOf(key) === -1) delete list[i][key];
            });
        });
        resolve(list);
    });
};

const getNotice = (rd) => {
    return new Promise(async (resolve) => {
        const res = await request({
            method: 'GET',
            url: '/gdutnews/detail',
            data: { NewsRd: rd },
        });
        resolve(res);
    });
};

const getCards = (isMy = false) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: `/gdutwall/get${isMy ? 'My' : 'All'}Post`,
            method: 'GET',
            data: {
                currentPage: 0,
            },
        });
        const cards = res.data;
        cards.forEach((item, i) => {
            /* eslint-disable no-underscore-dangle */
            cards[i].id = item._id;
            cards[i].avatar = item.user_id.avatarUrl;
            cards[i].nickname = item.user_id.nickname;
            cards[i].time = '1分钟前';
            // cards[i].time = tool.getLapseTime(new Date(item.createdAt.replace('-', '/')));
            cards[i].device = item.phone || '未知设备';
            cards[i].text = item.content;
            cards[i].img = item.imgUrl;
            cards[i].likes = item.likes;
            item.comments.forEach((comment, n) => {
                cards[i].comments[n].avatar = comment.from_id.avatarUrl;
                cards[i].comments[n].nickname = comment.from_id.nickName;
                cards[i].comments[n].text = comment.content;
            });
        });
        resolve(cards);
    });
};

const sendCard = (data) => {
    return new Promise(async () => {
        const res = await request({
            url: '/gdutWall/send',
            data,
        });
        console.log(res);
        if (res.data.code === 200) {
            console.log(200);
        }
    });
};

const sendComment = (data) => {
    return new Promise(async () => {
        const res = await request({
            url: '/gdutWall/comment',
            data,
        });
        console.log(res);
        if (res.data.code === 200) {
            console.log(200);
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
            case 500: resolve(res.code); break;
            default: break;
        }
    });
};

export default {
    getProofUrl,
    getToken,
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
    sendComment,
    like,
};
