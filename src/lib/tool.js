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

const getCalendar = ($firstday, $length) => {
    const firstDayStamp = new Date($firstday).getTime();
    const oneDayStamp = 86400000;
    const Calendar = [];
    for (let i = 0; i < $length; i += 1) {
        const week = [];
        for (let m = 0; m < 7; m += 1) {
            const date = new Date(firstDayStamp + (((7 * i) + m) * oneDayStamp));
            week.push(date.toISOString().slice(5, 10));
        }
        Calendar.push(week);
    }
    return Calendar;
};

const getLapseTime = ($stamp, $now = Date.now()) => {
    const oneMonth = 2592000;
    const oneDay = 86400;
    const oneHour = 3600;
    const oneMinute = 60;
    const before = Math.floor(($now - $stamp) / 1000);
    const date = new Date($stamp).toISOString().slice(0, 10);
    if ($stamp > $now) return date;
    if (before < oneMinute) return `${before}秒前`;
    else if (before < oneHour) return `${Math.floor(before / oneMinute)}分钟前`;
    else if (before < oneDay) return `${Math.floor(before / oneHour)}小时前`;
    else if (before < oneMonth) return `${Math.floor(before / oneDay)}天前`;
    return date;
};

export default { getRes, getWeekday, getCalendar, getLapseTime, quickSort };
