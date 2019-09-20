import React, { Component } from 'react';
import { connect } from 'dva';
import {Input,message} from 'antd';

@connect()
class Demo extends Component {
  // 定义状态值
  state={
    editing:false,
  }

  edit=()=>{
    this.setState({
      editing:true,
    })
  }

  cancleEdit=()=>{
    this.setState({
      editing:false
    })
  }

  save=(e)=>{
    const { title } = this.props;
    const item  = e.target.value;
    if(item===""){
      message.info('任务描述不能为空',2);
      this.cancleEdit();
      return;
    }
    if (item.length>200) {
      message.info('任务描述过长，请不要超过200个字符',2);
      this.cancleEdit();
      return;
    }
    // 值不一样的时候再发送
    if(title!==item){
      this.sendChange(item);
    }
    this.cancleEdit();
  }

  // 发送标题变化
  sendChange=(value)=>{
    const { dispatch,id,params } = this.props;
    const data = {
      title:value,
    }
    dispatch({
      type:'todo/update',
      params,
      id,
      data,
    }).then(()=>{
      this.cancleEdit();
    })
  }

  // 渲染页面
  render() {
    const {editing} = this.state;
    const {title} = this.props;
    return editing?(
      <div>
        <Input
          autoFocus
          defaultValue={title}
          onPressEnter={this.save}
          onBlur={this.save}
        />
      </div>
    ):(
      <div onDoubleClick={this.edit}>
        {title}
      </div>
    )
  }
}

export default Demo;
