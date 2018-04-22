const getRes = (res) => {
    if (res.data) return res.data;
    return {};
};

const getWeekday = (index) => {
    switch (index) {
        case 0: return '周一';
        case 1: return '周二';
        case 2: return '周三';
        case 3: return '周四';
        case 4: return '周五';
        case 5: return '周六';
        case 6: return '周日';
        default: return '';
    }
};

const quickSort = (arr, proto) => {
    if (arr.length <= 1) return arr;
    const pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
    const left = [];
    const right = [];
    arr.forEach((i) => {
        if (i < pivot || i[proto] < pivot[proto]) left.push(i);
        else right.push(i);
    });
    return quickSort(left, proto).concat([pivot], quickSort(right, proto));
};

export default { getRes, getWeekday, quickSort };
