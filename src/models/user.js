import Cookies from 'js-cookie';
import {getSsoUser} from '@/services/todo';

export default {
  namespace: 'user',

  state: {
    // 获取用户信息
    ssoUser:{},
    
  },

  effects: {
    // 获取SSO
    *fetchUser(_, { call, put }) {
      const uid = Cookies.get("uid");
      if(uid === undefined || uid === "undefined" || uid === null || uid === 'uid'){
        window.location.href = "/login";
        return false;
      }
      const response =  yield call(getSsoUser,uid);
      yield put({
        type: 'saveSsoUser',
        payload: response,
      });
      return response;
    },
  },

  reducers: {
    saveSsoUser(state,action){
      return {
        ...state,
        ssoUser:action.payload
      }
    },
  },
};
