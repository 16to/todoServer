// 引入react和PureComponent
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Alert,List,Divider,Upload,Button,Icon,message, Select,Slider } from 'antd';
import {ssoLogout} from '@/utils/SSO';

import styles from './Todo.less';

const {Option}=Select;

@connect(({ setting,user }) => ({
  setting:setting.setting,
  ssoUser:user.ssoUser,
}))
class Login extends PureComponent {
  // 定义状态值
  state={
    loading: false,
    opacity:95,
  }

  // 生命周期，完成dom加载
  componentDidMount() {
    const { setting } = this.props;
    this.setState({
      opacity:setting.opacity
    })
  }



  beforeUpload=(file)=>{
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif');
    if (!isJPG) {
      message.error('只能上传jpg/png/gif的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传文件大小不能超过2MB');
    }
    return isJPG && isLt2M;
  }

  uploadOnChange=(info)=>{
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      this.setState({ loading: false });
      this.changeSetting("imageurl",`http://idfs.inhuawei.com/dfs/download/${info.file.response.data.space}/${info.file.response.data.filename}`);
    } 
    else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  renderLayoutSettingItem = item => {
    const action = React.cloneElement(item.action, {
      disabled: item.disabled,
    });
    return (
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? '0.5' : '' }}>{item.title}</span>
      </List.Item>
    );
  };

  // 退出登录
  exit=()=>{
    ssoLogout();
  }

  // 设置页面
  changeSetting=(type,value)=>{
    const data={
      [type]:value
    }
    this.sendSetting(data);
  }

  // 发送显示设置
  sendSetting=(data)=>{
    const { dispatch,selectSetting } = this.props;
    dispatch({
      type:'setting/update',
      data,
    }).then(()=>{
      selectSetting();
    })
  }

  // 设为默认值
  setDefault=()=>{
    const defaultData={
      "opacity":95,
      "filterby":0,
      "orderby":0,
      "timerange":0,
      "imageurl":"",
    };
    this.sendSetting(defaultData);
    this.setState({
      opacity:defaultData.opacity
    })
  }

  changeOpacity=(value)=>{
    this.setState({
      opacity:value
    })
  }

  // 渲染页面
  render() {
    const {loading,opacity} =  this.state;
    const {setting,ssoUser} = this.props;
    const uploadProps = {
      name: 'attachment',
      action: '/upload',
      listType: 'picture',
      showUploadList:false,
      headers: {
        authorization: 'authorization-text',
      },
      data:{ "type": 1, "uploader": ssoUser.id, "space":`todo_${ssoUser.id}`, "torrentStatus": 0, "override": true },
      beforeUpload:this.beforeUpload,
      onChange:this.uploadOnChange
    };
    return (
      <div className={styles.setting}>
        <h3 className={styles.title}>显示设置</h3>
        <List
          renderItem={this.renderLayoutSettingItem}
          dataSource={[
            {
              title: "数据筛选",
              action: (
                <Select
                  size="small"
                  value={setting.filterby || 0}
                  onChange={value => this.changeSetting('filterby', value)}
                  style={{ width: 100 }}
                >
                  <Option value={0}>无</Option>
                  <Option value={99}>置顶</Option>
                  <Option value={1}>紧急</Option>
                  <Option value={2}>高优</Option>
                  <Option value={3}>有标签</Option>
                  <Option value={4}>无标签</Option>
                </Select>
              ),
            },
            {
              title: "条件排序",
              action: (
                <Select 
                  size="small"
                  value={setting.orderby || 0}
                  onChange={value => this.changeSetting('orderby', value)}
                  style={{ width: 100 }}
                >
                  <Option value={0}>无</Option>
                  <Option value={1}>标签优先</Option>
                  <Option value={2}>顺序优先</Option>
                </Select>
              ),
            },
            {
              title: "时间范围",
              action: (
                <Select 
                  size="small"
                  value={setting.timerange || 0}
                  onChange={value => this.changeSetting('timerange', value)}
                  style={{ width: 100 }}
                >
                  <Option value={0}>无</Option>
                  <Option value={1}>今日</Option>
                  <Option value={2}>本周</Option>
                  <Option value={3}>本月</Option>
                  <Option value={4}>今年</Option>
                </Select>
              ),
            },
          ]}
        />
        <Divider />
        <h3 className={styles.title}>风格设置</h3>
        <List
          renderItem={this.renderLayoutSettingItem}
          dataSource={[
            {
              title: "背景图片",
              action: (
                <Upload {...uploadProps}>
                  <Button size="small">
                    <Icon type={loading ? 'loading' : 'upload'} />上传
                  </Button>
                </Upload>
              ),
            },
            {
              title: "透明度",
              action: (
                <Slider 
                  value={opacity}
                  onChange={(value)=>this.changeOpacity(value)}
                  min={50}
                  onAfterChange={value => this.changeSetting('opacity', value)}
                />
              ),
            },
          ]}
        />
        <Divider />
        <Alert message="双击标题，可修改事项内容" type="info" showIcon className={styles.alertTip} />
        <Button block icon="diff" onClick={()=>this.setDefault()} className={styles.defaultBtn} id="defaultSet">
          恢复默认设置
        </Button>
        <Button block icon="logout" onClick={()=>this.exit()} type="danger" className={styles.exitBtn} id="logout">
          退出登录
        </Button>
      </div>
    );
  }
}

export default Login;
