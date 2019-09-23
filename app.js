/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const path = require('path');
const bodyparser = require('body-parser');
const multer = require("multer");
const moment = require('moment');
const Cron = require('cron').CronJob;
const db = require('./core/db.js');
const utils = require('./core/utils.js');
const send = require('./core/send.js');

// node server port
const PORT = 8002;
const app = express();
app.use(bodyparser.json());

const httpServer = http.createServer(app);
// error code,0-代表正确,1-参数错误
const errCode={
  "cc":1,
}
// job list
let jobList = [];

function sendCronInfo(jobData) {
  if (jobData.noticetype.indexOf("1") > -1) {
    send.Sms(jobData.mobile, utils.smsTpl(jobData.name, jobData.title));
  }
  if (jobData.noticetype.indexOf("2") > -1) {
    send.Email(jobData.email, "【重要】您有一个代办事项需要处理", utils.emailTpl(jobData.name, jobData.title));
  }
  if (jobData.noticetype.indexOf("3") > -1) {
    send.Espace(jobData.espace, "【重要】您有一个代办事项需要处理", utils.espaceTpl(jobData.name, jobData.title));
  }
}

function addJob(jobData) {
  const tmp = new Cron(jobData.cronstring, () => sendCronInfo(jobData), null, false, 'Asia/Shanghai');
  jobList[jobData.lid] = tmp;
  jobList[jobData.lid].start();
}

function delJob(con) {
  if (jobList[con.lid]) {
    jobList[con.lid].stop();
  }
  jobList = jobList.filter((item) => item.lid === con.lid);
}

function updateJob(jobData, con) {
  if (jobList[con.lid]) {
    jobList[con.lid].stop();
  }
  const tmp = new Cron(jobData.cronstring, () => sendCronInfo(jobData), null, false, 'Asia/Shanghai');
  jobList[jobData.lid] = tmp;
  jobList[jobData.lid].start();
}

function insertJobing(jobData) {
  db.Insert("jobing", jobData, () => {
    addJob(jobData);
  });
}

function deleteJobing(con) {
  db.Delete("jobing", con, () => {
    delJob(con);
  });
}

function updateJobing(jobData, con) {
  db.Update("jobing", jobData, con, () => {
    updateJob(jobData, con);
  })
}

function insertDefaultSetting(uid, res) {
  const insertCon = {};
  insertCon.filterby = 0;
  insertCon.orderby = 0;
  insertCon.timerange = 0;
  insertCon.imageurl = "";
  insertCon.uid = uid;
  db.Insert("setting", insertCon, () => {
    res.send(insertCon);
  });
}

// 开始的时候，需要初始化任务列表
function initJobing() {
  const con = [];
  con['1'] = 1;
  db.Select("jobing", con, (err, res) => {
    if (res) {
      res.forEach(item => {
        addJob(item);
      });
    }
  })
}
initJobing();


// 验证码
app.post('/api/captcha', (req, res) => {
  const insertCon = [];
  insertCon.vcode = Math.round(Math.random()*(8999))+1000;
  insertCon.mobile = req.body.mobile;
  insertCon.addtime = new Date().getTime();
  db.Insert("vcode", insertCon);
  res.send({"cc":0});
});

// 登录
app.post('/api/login', (req, res) => {
  const con = [];
  con.mobile = req.body.mobile;
  con.vcode = req.body.vcode;
  db.Select("vcode", con, (err, response) => {
    // 如果没有vcode，就插入一条数据
    if (response[0] === undefined) {
      // 验证码错误
      errCode.cc = 2;
      res.send(errCode);
    }
    else if(response[0].addtime>30*60*1000){
      // 验证码超时
      errCode.cc = 3;
      res.send(errCode);
    }
    else {
      // 插入用户数据中
      const timestamp = new Date().getTime();
      const insertCon = {};
      insertCon.mobile = req.body.mobile;
      insertCon.name = req.body.mobile;
      insertCon.addtime = timestamp;
      insertCon.lasttime = timestamp;
      db.Insert('user',insertCon,(dberr,dbresponse)=>{
        if(dberr){
          res.send(response);
        }
        else{
          // 数据库错误
          errCode.cc = 99;
          res.send(dbresponse);
        }
      })
    }
  });
});


// 获取用户信息
app.get('/api/user/:uid',(req,res)=>{
  if(req.params.uid){
    res.send(errCode);
    return;
  }
  const con = [];
  con['1'] = 1;
  con.uid = req.params.uid;
  db.Select("user", con, (err, response) => {
    res.send(response[0]);
  });
})

// 上传文件
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');    // 保存的路径
  },
  filename: (req, file, cb) => {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    const suffix = file.mimetype.split('/')[1];// 获取文件格式
    cb(null, `${file.fieldname}-${Date.now()}.${suffix}`);
  }
});

app.post('/api/upload', multer({ storage }).single('file'), (req, res) => {
  console.log(req.file, '------', req.body, '-------', req.file.path);
  res.end('ok');
});

app.get('/api/todo', (req, res) => {
  let sql = `select * from list where 1=1 and uid='${req.query.uid}'`;
  const filterby = parseInt(req.query.filterby, 10);
  const orderby = parseInt(req.query.orderby, 10);
  const timerange = parseInt(req.query.timerange, 10);
  if (filterby) {
    if (filterby === 1) {
      sql += ` and sort=1`;
    }
    if (filterby === 2) {
      sql += ` and important=1`;
    }
    if (filterby === 3) {
      sql += ` and (important=1 or sort=1)`;
    }
    if (filterby === 4) {
      sql += ` and important!=1 and sort!=1`;
    }
    if (filterby === 99) {
      sql += ` and top=1`;
    }
  }
  if (timerange) {
    if (timerange === 1) {
      sql += ` and addtime>${utils.getTimeDistance("today")}`;
    }
    if (timerange === 2) {
      sql += ` and addtime>${utils.getTimeDistance("week")}`;
    }
    if (timerange === 3) {
      sql += ` and addtime>${utils.getTimeDistance("month")}`;
    }
    if (timerange === 4) {
      sql += ` and addtime>${utils.getTimeDistance("year")}`;
    }
  }
  if (orderby) {
    if (orderby === 1) {
      sql += ` order by sort desc,important desc,addtime desc`;
    }
    if (orderby === 2) {
      sql += ` order by addtime`;
    }
  }
  else {
    sql += ` order by addtime desc`;
  }
  db.Query(sql, (err, response) => {
    res.send(response);
  });

});

app.post('/api/todo', (req, res) => {
  const insertCon = [];
  insertCon.title = req.body.title;
  insertCon.uid = req.body.uid;
  insertCon.status = 0;// 0-未完成 1-完成
  insertCon.addtime = new Date().getTime();
  db.Insert("list", insertCon);
  res.send([]);
});

app.delete('/api/todo/:id', (req, res) => {
  const delCon = [];
  delCon.id = parseInt(req.params.id, 10);
  db.Delete("list", delCon);
  res.send([]);
});

app.put('/api/todo/:id', (req, res) => {
  const datas = [];
  const updateCon = [];
  if (req.body.status !== undefined) {
    datas.status = parseInt(req.body.status, 10);
    datas.addtime = new Date().getTime();
    if (datas.status === 1) {
      req.body.noticetype = [];
      req.body.lid = parseInt(req.params.id, 10);
    }
  }
  if (req.body.sort !== undefined) {
    datas.sort = parseInt(req.body.sort, 10);
  }
  if (req.body.important !== undefined) {
    datas.important = parseInt(req.body.important, 10);
  }
  if (req.body.top !== undefined) {
    datas.top = parseInt(req.body.top, 10);
  }
  if (req.body.title !== undefined) {
    datas.title = req.body.title;
  }
  if (req.body.noticetype !== undefined) {
    datas.noticetype = req.body.noticetype.join(",");
  }
  if (req.body.noticeagain !== undefined) {
    datas.noticeagain = parseInt(req.body.noticeagain, 10);
  }
  if (req.body.noticetime !== undefined) {
    datas.noticetime = moment(req.body.noticetime).format("HH:mm");
  }
  if (req.body.noticeweek !== undefined) {
    datas.noticeweek = req.body.noticeweek.join(",");
  }
  // 设置了发送
  if (req.body.noticetype !== undefined) {
    const con = [];
    con['1'] = 1;
    con.lid = req.body.lid;
    if (req.body.noticetype.length === 0) {
      // 如果noticetype设置为[]，就删除job数据
      deleteJobing(con);
    }
    else {
      const jobData = [];
      jobData.lid = req.body.lid;
      jobData.uid = req.body.uid;
      jobData.title = req.body.title;
      jobData.name = req.body.name;
      jobData.email = req.body.email;
      jobData.mobile = req.body.mobile;
      jobData.espace = req.body.espace;
      jobData.noticetype = req.body.noticetype.join(",");
      jobData.noticetime = moment(req.body.noticetime).format("HH:mm");
      jobData.noticeagain = req.body.noticeagain;
      jobData.updatetime = new Date().getTime();
      if (req.body.noticeweek !== undefined) {
        jobData.noticeweek = req.body.noticeweek.join(",");
      }
      // 设置cron表达式
      let cronString = moment(jobData.noticetime, "HH:mm").format("s m H");
      if (jobData.noticeagain === 1) {
        cronString += " * * *";// 每天
      }
      else if (jobData.noticeagain === 2) {
        cronString += " * * 1,2,3,4,5";// 周一至周五，1=SUN
      }
      else if (jobData.noticeagain === 99) {
        cronString += ` * * ${jobData.noticeweek}`;// 任意周
      }
      else {
        const month = parseInt(moment(jobData.noticetime, "HH:mm").format("M"), 10) - 1;
        const day = parseInt(moment(jobData.noticetime, "HH:mm").format("D"), 10);
        cronString += ` ${day} ${month} *`;// 就一次需要具体时间
      }
      jobData.cronstring = cronString;

      db.Select("jobing", con, (err, response) => {
        if (response[0] === undefined) {
          // 如果没有任务，就插入一条job数据
          insertJobing(jobData);
        }
        else {
          updateJobing(jobData, con);
        }
      });
    }

  }
  datas.updatetime = new Date().getTime();
  updateCon.id = parseInt(req.params.id, 10);
  db.Update("list", datas, updateCon);
  // fix bug,没有同步jobing的title
  if (req.body.title !== undefined) {
    db.Update('jobing', { title: req.body.title }, { lid: parseInt(req.params.id, 10) });
  }
  res.send([]);
});

app.get('/api/setting/:uid', (req, res) => {
  const con = [];
  con['1'] = 1;
  con.uid = req.params.uid || '16to';
  db.Select("setting", con, (err, response) => {
    // 如果没有配置，就插入一条数据
    if (response[0] === undefined) {
      insertDefaultSetting(req.params.uid, res);
    }
    else {
      res.send(response[0]);
    }
  });
});

app.put('/api/setting/:uid', (req, res) => {
  const datas = [];
  const updateCon = [];
  if (req.body.filterby !== undefined) {
    datas.filterby = parseInt(req.body.filterby, 10);
  }
  if (req.body.orderby !== undefined) {
    datas.orderby = parseInt(req.body.orderby, 10);
  }
  if (req.body.timerange !== undefined) {
    datas.timerange = parseInt(req.body.timerange, 10);
  }
  if (req.body.imageurl !== undefined) {
    datas.imageurl = req.body.imageurl;
  }
  if (req.body.opacity !== undefined) {
    datas.opacity = parseInt(req.body.opacity, 10);
  }
  updateCon.uid = req.params.uid;
  db.Update("setting", datas, updateCon);
  res.send([]);
});

app.post('/api/sendtest', (req, res) => {
  // 设置了发送
  const sendList = [];
  if (req.body.noticetype !== undefined) {
    // 短信
    if (req.body.noticetype.indexOf("1") > -1) {
      sendList.push(send.Sms(req.body.mobile, utils.smsTpl(req.body.name, req.body.title)));
    }
    // 邮件
    if (req.body.noticetype.indexOf("2") > -1) {
      sendList.push(send.Email(req.body.email, "【重要】您有一个代办事项需要处理", utils.emailTpl(req.body.name, req.body.title)));
    }
    // eSpace
    if (req.body.noticetype.indexOf("3") > -1) {
      sendList.push(send.Espace(req.body.espace, "【重要】您有一个代办事项需要处理", utils.espaceTpl(req.body.name, req.body.title)));
    }
  }
  Promise.all(sendList).then(values => {
    res.send(values);
  })

});

// set dist
app.use(express.static(path.join(__dirname, './dist')));

// bind port
httpServer.listen(PORT, () => {
  console.log(`http start port:${PORT}`);
});