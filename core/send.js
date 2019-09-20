/* eslint-disable no-console */
/**
 * @author 16to
 * @短信，邮件，espace发送类
 * 
 */
const sha1 = require('js-sha1');
const rp = require('request-promise');
const config = require("./sendConfig");

// 短信发送
const Sms = (phone, content, callback) => {
  const timestamp = (Date.parse(new Date()) / 1000).toString();
  const hashContent = `appKey=${config.appKey}&createBy=370069&destAddr=${phone}&method=sendSMS&needReport=0&smContent=${content}&smType=0&timestamp=${timestamp}${config.appSecret}`;
  const sign = sha1(hashContent).toUpperCase();
  const body = {
    "destAddr": phone,
    "needReport": "0",
    "smType": "0",
    "createBy": "370069",
    "method": "sendSMS",
    "smContent": content,
    "timestamp": timestamp,
    "appKey": config.appKey,
    "sign": sign,
  };
  return rp({
    uri: config.url,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    const json = JSON.parse(response);
    json.type = "sms";
    if (callback) {
      callback(json);
    }
    return json;
  })
  .catch((error) => error);
}

// 邮件发送,多个地址使用分号分隔
const Email = (address, subject, content, callback) => {
  const timestamp = (Date.parse(new Date()) / 1000).toString();
  // 删除发送模板
  const newContent=`<!DOCTYPE html>${content}</html>`;
  const hashContent = `address=${address}&appKey=${config.appKey}&content=${newContent}&method=sendEmail&subject=${subject}&timestamp=${timestamp}${config.appSecret}`;
  const sign = sha1(hashContent).toUpperCase();
  const body = {
    "address": address,
    "method": "sendEmail",
    "subject": subject,
    "content":newContent,
    "timestamp": timestamp,
    "appKey": config.appKey,
    "sign": sign,
  };
  return rp({
    uri: config.url,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    const json = JSON.parse(response);
    json.type = "email";
    if (callback) {
      callback(json);
    }
    return json;
  })
  .catch((error) => error);
}

// espace发送
const Espace = (account, title, content, callback) => {
  const timestamp = (Date.parse(new Date()) / 1000).toString();
  const hashContent = `appKey=${config.appKey}&content=${content}&method=sendEspace&targetAccount=${account}&timestamp=${timestamp}&title=${title}${config.appSecret}`;
  const sign = sha1(hashContent).toUpperCase();
  const body = {
    "targetAccount": account,
    "method": "sendEspace",
    "content":content,
    "title":title,
    "timestamp": timestamp,
    "appKey": config.appKey,
    "sign": sign,
  };
  return rp({
    uri: config.url,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    const json = JSON.parse(response);
    json.type = "espace";
    if (callback) {
      callback(json);
    }
    return json;
  })
  .catch((error) => error);
}

exports.Sms = Sms;
exports.Email = Email;
exports.Espace = Espace;