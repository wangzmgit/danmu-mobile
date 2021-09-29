//时间转日期
export function toDate(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return year + "-" + month + "-" + day;
}

//utc时间转北京时间
export function utcToBeijing(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return year + "-" + month + "-" + day + "  " + hours + ":" + minutes;
}

//相对时间
export function toRelativeTime(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var new_datetime = year + "-" + month + "-" + day + "  " + hours + ":" + minutes + ":" + seconds;
    // 处理成为时间戳
    var timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;

    var current = Date.parse(new Date());
    var elapsed = current - timestamp * 1000;
    if (elapsed < msPerMinute) {
        return "刚刚";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + "分钟前";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + "小时前";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + "天前";
    }
    return year + "-" + month + "-" + day;
}