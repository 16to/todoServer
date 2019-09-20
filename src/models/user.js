import {ssoToken,ssoUser} from '@/utils/SSO';
import Cookies from 'js-cookie';

export default {
  namespace: 'user',

  state: {
    // 获取ssoToken
    ssoToken:{},
    // 获取用户信息
    ssoUser:{},
    
  },

  effects: {
    // 获取SSO token
    *fetchSso(_, { call, put }) {
      let uid = Cookies.get("uid");
      if(uid === undefined || uid === "undefined"){
        const response = yield call(ssoToken);
        if(response === "" || response === undefined){
          return;
        }
        yield put({
          type: 'saveSsoToken',
          payload: response,
        });
        uid = response.user.id;
        Cookies.set("uid",uid,{expires:30});
      }
      const userInfo =  yield call(ssoUser,uid);
      yield put({
        type: 'saveSsoUser',
        payload: userInfo.addresslists?userInfo.addresslists[0]:"",
      });
    },
  },

  reducers: {
    // ssoToken
    saveSsoToken(state,action){
      return {
        ...state,
        ssoToken:action.payload
      }
    },
    saveSsoUser(state,action){
      return {
        ...state,
        ssoUser:action.payload
      }
    },
  },
};
