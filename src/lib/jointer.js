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

const getStore = () => {
    return new Promise(async (resolve) => {
        resolve();
        // const res = await request({
        //     url: '/'
        // });
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

const getCards = () => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutwall/getAllPost',
            method: 'GET',
            data: {
                currentPage: 0,
            },
        });
        resolve(res);
    });
};

const sendCard = (data) => {
    return new Promise(async (resolve) => {
        const res = await request({
            url: '/gdutWall/send',
            data,
        });
        resolve(res);
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
    getStore,
    getNews,
    getNotice,
    getCards,
    sendCard,
};
