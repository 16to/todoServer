import { stringify } from 'qs';
import request from '@/utils/request';

// 获取todo数据
export async function getTodo(params) {
  return request(`/api/todo?${stringify(params)}`);
}

// 新增todo数据
export async function addTodo(data) {
  const { ...restParams } = data;
  return request(`/api/todo`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

// 更新todo数据
export async function updateTodo(id,data) {
  const { ...restParams } = data;
  return request(`/api/todo/${id}`, {
    method: 'PUT',
    body: {
      ...restParams
    },
  });
}

// 更新todo tag
export async function addTagTodo(id,data) {
  const { ...restParams } = data;
  return request(`/api/todo/${id}`, {
    method: 'PUT',
    body: {
      ...restParams
    },
  });
}

// 更新todo notice
export async function addNoticeTodo(id,data) {
  const { ...restParams } = data;
  return request(`/api/todo/${id}`, {
    method: 'PUT',
    body: {
      ...restParams
    },
  });
}

// 删除获取todo id数据
export async function delTodo(id) {
  return request(`/api/todo/${id}`, {
    method: 'DELETE',
  });
}

// 获取配置信息
export async function getTodoSetting(uid){
  return request(`/api/setting?uid=${uid}`);
}

// 修改配置信息
export async function updateTodoSetting(uid,data){
  const { ...restParams } = data;
  return request(`/api/setting/${uid}`, {
    method: 'PUT',
    body: {
      ...restParams
    },
  });
}

// 发送验证一下
export async function sendTestApi(data){
  const { ...restParams } = data;
  return request(`/api/sendtest`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

// 发送验证码
export async function sendCaptchaApi(data){
  const { ...restParams } = data;
  return request(`/api/sendCaptcha`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

export async function sendLoginApi(data){
  const { ...restParams } = data;
  return request(`/api/login`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}
