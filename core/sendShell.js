/* eslint-disable no-console */
const send = require('./send.js');

// 回调函数
const showResult = (res) => {
  console.log(res);
}

switch (process.argv[2]) {
  case "?" || "help":
    console.log('node sendShell sms <phone> <content>');
    console.log('node sendShell email <email> <subject> <content>');
    console.log('node sendShell espace <espace> <title> <content>');
    break
  case "sms":
    send.Sms(process.argv[3], process.argv[4], showResult);
    break
  case "email":
    send.Email(process.argv[3], process.argv[4],process.argv[5] || "",showResult);
    break
  case "espace":
    send.Espace(process.argv[3], process.argv[4],process.argv[5] || "", showResult);
    break
  default:
    console.log("请输入正确的参数");
    break;
}