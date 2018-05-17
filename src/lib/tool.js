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

const parseCourse = ($rows, week) => {
    const course = [];
    const getColor = () => {
        const colors = ['#F7D94C', '#DC9FB4', '#E16B8C', '#F4A7B9', '#DB4D6D',
            '#D05A6E', '#BF6766', '#EB6766', '#EB7A77', '#F17C67', '#B9887D',
            '#E83015', '#FB966E', '#F05E1C', '#FC9F4D', '#FFBA84', '#FFB11B',
            '#BEC23F', '#90B44B', '#5DAC81', '#A8D8B9', '#00AA90', '#66BAB7',
            '#A5DEE4', '#58B2DC', '#7DB9DE', '#9B90C2', '#B28FCE', '#986DB2',
            '#E03C8A', '#DDD23B'];
        const random = Math.floor(Math.random() * colors.length);
        return colors[random];
    };
    for (let i = 0; i < 7; i += 1) { course.push([]); }
    $rows.forEach((item) => {
        if (item.startWeek <= week && week <= item.endWeek) {
            course[item.day - 1].push(item);
        }
    });
    course.forEach(($day, index) => {
        const day = [...$day.sort((a, b) => a.startSection - b.startSection)];
        const getBlank = (flex) => {
            return { name: '', site: '', teacher: '', color: 'rgba(0, 0, 0, 0)', flex: flex || 12 };
        };
        if ($day.length === 0) day.push(getBlank());
        $day.forEach(($item, index1) => {
            const item = $item;
            item.color = getColor();
            item.flex = (item.endSection - item.startSection) + 1;
            item.site = `@${item.site}`;
            const pre = $day[index1 - 1];
            const next = $day[index1 + 1];
            if (next && next.name) {
                if (next.startSection - item.endSection > 1) {
                    day.splice(index1 + 1, 0,
                        getBlank(next.startSection - item.endSection - 1));
                }
            }
            if (!pre && item.startSection > 1) {
                day.unshift(getBlank(item.startSection - 1));
            }
            if (!next && item.endSection < 12) {
                day.push(getBlank(12 - item.endSection));
            }
        });
        course[index] = day;
    });
    return course;
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
    const calendar = [];
    for (let i = 0; i < $length; i += 1) {
        const week = [];
        for (let m = 0; m < 7; m += 1) {
            const date = new Date(firstDayStamp + (((7 * i) + m) * oneDayStamp));
            week.push(date.toISOString().slice(5, 10));
        }
        calendar.push(week);
    }
    return calendar;
};

const getLapseTime = ($stamp, $now = Date.now()) => {
    const oneMonth = 2592000;
    const oneDay = 86400;
    const oneHour = 3600;
    const oneMinute = 60;
    const before = Math.floor(($now - $stamp) / 1000);
    const date = new Date($stamp).toISOString().slice(0, 10);
    if (before < 0) return date;
    else if (before < oneMinute) return `${before}秒前`;
    else if (before < oneHour) return `${Math.floor(before / oneMinute)}分钟前`;
    else if (before < oneDay) return `${Math.floor(before / oneHour)}小时前`;
    else if (before < oneMonth) return `${Math.floor(before / oneDay)}天前`;
    return date;
};

const btoa = (input) => {
    /* eslint-disable */
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = toUtf8(output);
            return output;
            function toUtf8(utftext) {
                var string = ""
                var i = 0
                var c = 0, c1 = 0, c2 = 0, c3 = 0
                while ( i < utftext.length ) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i+1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i+1);
                        c3 = utftext.charCodeAt(i+2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return string;
            }
};

export default { getWeekday, parseCourse, getCalendar, getLapseTime, quickSort, btoa };
