const  moment = require('moment');

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return moment(now).valueOf();
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;
    return moment(beginTime).valueOf();
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    return  moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`).valueOf();
  }

  const year = now.getFullYear();
  return moment(`${year}-01-01 00:00:00`).valueOf();
}

function emailTpl(name,title){
  return `<div>
    <p>尊敬的${name}：</p>
    <p>您有一个代办事项需要处理：<b>${title}</b></p>
    <p><a href="http://todo.inhuawei.com">http://todo.inhuawei.com</a></p>
  </div>`;
}

function smsTpl(name,title){
  return `尊敬的${name}，您有一个代办事项需要处理：${title}，详情请登录http://todo.inhuawei.com。`
}

function espaceTpl(name,title){
  return `尊敬的${name}：\n您有一个代办事项需要处理：${title}。\n详情请登录http://todo.inhuawei.com。`
}

exports.getTimeDistance = getTimeDistance;
exports.emailTpl = emailTpl;
exports.smsTpl = smsTpl;
exports.espaceTpl= espaceTpl;