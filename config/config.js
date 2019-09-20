export default {
  routes: [{
    path: '/',
    component: './Todo',
  },
  {
    path: '/login',
    component: './Login',
  }
  ],
  plugins: [
    ['umi-plugin-react', {
        antd:true,
        dva:true
    }],
  ],
  proxy: {
    // 登录接口调试
    '/ssoproxy/tokeninfo':{
      target:'http://cloudiam.huawei.com:8080',
      changeOrigin: true,
    },
    // 获取用户信息
    '/rest/hw_userinfo':{
      target: "http://10.93.240.41",
      changeOrigin: true,
    },
    // 上传文件
    '/upload':{
      target:"http://idfs.inhuawei.com/dfs/upload/sync",
      pathRewrite:{'^/upload':''},
      changeOrigin: true
    },
  },
}