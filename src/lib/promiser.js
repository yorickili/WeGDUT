const apis = ['login', 'getUserInfo', 'request', 'showModal', 'navigateTo', 'showActionSheet', 'chooseImage'];

const promify = {
    getGlobalData() {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if (global.data) {
                    resolve();
                    clearInterval(timer);
                }
            }, 100);
        });
    },
};

apis.forEach((api) => {
    promify[api] = (params) => {
        const promise = new Promise((resolve, reject) => {
            wx[api](Object.assign(params || {}, {
                success: res => resolve(res),
                fail: reject,
            }));
        });
        return promise;
    };
});

export default promify;
