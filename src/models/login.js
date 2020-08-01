// 引入所有的请求接口
import { sendCaptchaApi,sendLoginApi } from '../services/todo';

export default {
  // 空间名称
  namespace: 'login',

  // 状态值
  state: {
    info:{},
  },

  // action和数据异步处理
  effects: {
    // 发送验证码
    *sendCaptcha({data}, { call }) {
      const response = yield call(sendCaptchaApi,data);
      return response;
    },
    // 登录
    *login({data}, { call,put }) {
      const response = yield call(sendLoginApi,data);
      yield put({
        type: 'queryInfo',
        payload: response,
      });
      return response;
    },
  },

  // 更新全局state
  reducers: {
    queryInfo(state, action) {
      return {
        ...state,
        info: action.payload
      };
    },
  },
};
