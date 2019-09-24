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
    // 接口调试
    '/api':{
      target:'http://localhost:8002',
      changeOrigin: true,
    },
  },
}