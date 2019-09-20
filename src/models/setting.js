// 引入所有的请求接口
import { getTodoSetting,updateTodoSetting} from '@/services/todo';
import Cookies from 'js-cookie';

export default {
  // 空间名称
  namespace: 'setting',

  // 状态值
  state: {
    setting:{},
  },

  // action和数据异步处理
  effects: {
    // 查
    *select(_, { call, put }) {
      const uid =Cookies.get("uid");
      const response = yield call(getTodoSetting,uid);
      yield put({
        type: 'querySetting',
        payload: response,
      });
      return response;
    },
    // 改
    *update({ data }, { call }) {
      const uid =Cookies.get("uid");
      const response=yield call(updateTodoSetting, uid, data);
      return response;
    },
  },

  // 更新全局state
  reducers: {
    querySetting(state, action) {
      return {
        ...state,
        setting: action.payload
      };
    },
  },
};
