// inhuawei登录
import request from '@/utils/request';
import Cookies from 'js-cookie';

const SSO_LOGIN_URL='http://cloudiam.huawei.com:8080/ssoproxy/login?redirect=http://cloudiam.huawei.com:8080/ssoproxy/authticket?service=';
const SSO_LOGOUT_URL='http://cloudiam.huawei.com:8080/ssoproxy/logout?redirect=';
const SSO_TOKEN_URL='/ssoproxy/tokeninfo?ticket=';
const USER_INFO_URL='/rest/hw_userinfo/detail?info=';

// SSO登录
export function ssoLogin() {
  window.location.href = `${SSO_LOGIN_URL+window.location.protocol}//${window.location.host}`;
}

// SSO登出
export function ssoLogout() {
  Cookies.remove("sso_ticket");
  window.location.href = `${SSO_LOGOUT_URL+window.location.protocol}//${window.location.host}`;
}

// SSO判断信息
export async function ssoToken() {
  const ticket = Cookies.get("sso_ticket");
  if(ticket === undefined){
    return;
  }
  // eslint-disable-next-line consistent-return
  return request(SSO_TOKEN_URL+ticket,{
    method: "GET",
  });
}

// 获取用户信息
export async function ssoUser(ssoUserId){
  return request(USER_INFO_URL+ssoUserId,{
    method: "GET",
  });
}

