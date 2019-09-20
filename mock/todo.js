import Mock from 'mockjs';
import moment from 'moment';

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

let todoList=[];
const setting={
  "opacity":95,
  "filterby":0,
  "orderby":0,
  "timerange":0,
  "imageurl":"",
};

function sortImportant(a, b)
{
  if(b.sort === a.sort){
    return b.important-a.important
  }
  return  b.sort - a.sort;
}
function sortId(a, b)
{
  return  a.addtime - b.addtime;
}

function getTodo(req,res){
  let tmpList=[...todoList];
  const filterby = parseInt(req.query.filterby,10);
  const orderby = parseInt(req.query.orderby,10);
  const timerange = parseInt(req.query.timerange,10);
  if(filterby){
    if(filterby===1){
      tmpList=tmpList.filter(item => item.sort === 1);
    }
    if(filterby===2){
      tmpList=tmpList.filter(item => item.important === 1);
    }
    if(filterby===3){
      tmpList=tmpList.filter(item => item.important === 1 || item.sort === 1 || item.top === 1);
    }
    if(filterby===4){
      tmpList=tmpList.filter(item => item.important !== 1 && item.sort !== 1  && item.top !== 1);
    }
    if(filterby===99){
      tmpList=tmpList.filter(item => item.top === 1);
    }
  }
  if(orderby){
    if(orderby===1){
      tmpList=tmpList.sort(sortImportant);
    }
    if(orderby===2){
      tmpList=tmpList.sort(sortId);
    }
  }
  if(timerange){
    if(timerange===1){
      tmpList=tmpList.filter(item => item.addtime > getTimeDistance("today"));
    }
    if(timerange===2){
      tmpList=tmpList.filter(item => item.addtime > getTimeDistance("week"));
    }
    if(timerange===3){
      tmpList=tmpList.filter(item => item.addtime > getTimeDistance("month"));
    }
    if(timerange===4){
      tmpList=tmpList.filter(item => item.addtime > getTimeDistance("year"));
    }
  }
  return res.json(tmpList);
}

function deleteTodo(req,res){
  todoList=todoList.filter(item => item.id !== req.params.id);
  return res.json(todoList);
}

function addTodo(req,res){
  const item={
    id:Mock.Random.id(),
    uid:req.body.uid || '',
    title: req.body.title || '',
    status: 0,// 0-未完成 1-完成
    important:0,
    sort:0,
    top:0,
    addtime: new Date().getTime(),
    noticetype:"",
    noticetime:"",
    noticeagain:"",
    noticeweek:"",
  }
  todoList.unshift(item);
  return res.json(todoList);
}

function updateTodo(req,res){
  todoList.forEach((item,k)=>{
    if(item.id === req.params.id){
      if(req.body.status!==undefined)
        todoList[k].status=parseInt(req.body.status,10);
      if(req.body.sort!==undefined)
        todoList[k].sort=parseInt(req.body.sort,10);
      if(req.body.important!==undefined)
        todoList[k].important=parseInt(req.body.important,10);
      if(req.body.top!==undefined)
        todoList[k].top=parseInt(req.body.top,10);
      if(req.body.title!==undefined)
        todoList[k].title=req.body.title;
      if(req.body.noticetime!==undefined)
        todoList[k].noticetime=moment(req.body.noticetime).valueOf();
      if(req.body.noticetype!==undefined)
        todoList[k].noticetype=req.body.noticetype.join(",");
      if(req.body.noticeagain!==undefined)
        todoList[k].noticeagain=req.body.noticeagain;
      if(req.body.noticeweek!==undefined)
        todoList[k].noticeweek=req.body.noticeweek.join(",");
    }
  });
  return res.json(todoList);
}

function getTodoSetting(req,res){
  return res.json(setting);
}

function updateTodoSetting(req,res){
  if(req.body.filterby!==undefined){
    setting.filterby = parseInt(req.body.filterby,10);
  }
  if(req.body.orderby!==undefined){
    setting.orderby = parseInt(req.body.orderby,10);
  }
  if(req.body.timerange!==undefined){
    setting.timerange = parseInt(req.body.timerange,10);
  }
  if(req.body.imageurl!==undefined){
    setting.imageurl = req.body.imageurl;
  }
  if(req.body.opacity!==undefined){
    setting.opacity = parseInt(req.body.opacity,10);
  }
  return res.json(setting);
}

export default {
  // 获取todo list
  'GET /api/todo':(req,res)=>getTodo(req,res),
  // 删除todo id
  'DELETE /api/todo/:id':(req,res)=>deleteTodo(req,res),
  // 更新todo id,tag,notice
  'PUT /api/todo/:id':(req,res)=>updateTodo(req,res),
  // 添加todo
  'POST /api/todo':(req,res)=>addTodo(req,res),
  // 获取todo setting
  'GET /api/setting':(req,res)=>getTodoSetting(req,res),
  // 更新todo setting
  'PUT /api/setting/:uid':(req,res)=>updateTodoSetting(req,res),
};
