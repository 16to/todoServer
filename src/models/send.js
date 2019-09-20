// 引入所有的请求接口
import { sendTestApi } from '@/services/todo';

export default {
  // 空间名称
  namespace: 'send',

  // 状态值
  state: {
    info:{},
  },

  // action和数据异步处理
  effects: {
    // 发送验证一下
    *sendTest({data}, { call, put }) {
      const response = yield call(sendTestApi,data);
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
