// 引入所有的请求接口
import { getTodo, delTodo,updateTodo,addTodo,addTagTodo,addNoticeTodo} from '@/services/todo';

export default {
  // 空间名称
  namespace: 'todo',

  // 状态值
  state: {
    list:[],
  },

  // action和数据异步处理
  effects: {
    // 查
    *select({params}, { call, put }) {
      const response = yield call(getTodo,params);
      if(Array.isArray(response) === true){
        yield put({
          type: 'queryList',
          payload: response,
        });
      }
    },
    // 增
    *insert({ params,data }, { call, put }) {
      const response = yield call(addTodo, data);
      if(Array.isArray(response) === true){
        // 重新获取数据
        yield put({
          type: 'select',
          params,
        });
      }
    },
    // 删
    *delete({ params,id }, { call, put }) {
      const response = yield call(delTodo, id);
      if(Array.isArray(response) === true){
        // 重新获取数据
        yield put({
          type: 'select',
          params,
        });
      }
    },
    // 改
    *update({ params,id,data }, { call, put }) {
      const response=yield call(updateTodo, id, data);
      if(Array.isArray(response) === true){
        // 获取修改后的数据
        yield put({
          type: 'select',
          params,
        });
      }
    },
    // 标签处理
    *tag({ params,id,data }, { call, put }) {
      const response=yield call(addTagTodo, id, data);
      if(Array.isArray(response) === true){
        // 获取修改后的数据
        yield put({
          type: 'select',
          params,
        });
      }
    },
    // 提醒修改
    *notice({ params,id,data }, { call, put }) {
      const response=yield call(addNoticeTodo, id, data);
      if(Array.isArray(response) === true){
        // 获取修改后的数据
        yield put({
          type: 'select',
          params,
        });
      }
    },
  },

  // 更新全局state
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
  },
};
