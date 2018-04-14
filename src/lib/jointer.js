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
export default { getProofUrl, getToken, login, getCalendar, getCourse, getGrade };
