// 引入react和PureComponent
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { Modal,Button,Form,Select,Checkbox,TimePicker,Input,message } from 'antd';
import moment from 'moment';
import { userToArr } from '@/utils/utils';

const { Option } = Select;

@connect(({ send,user }) => ({
  info:send.info,
  ssoUser:user.ssoUser,
}))
@Form.create()
class NoticeModal extends PureComponent {

  // 定义状态值
  state={
    weekShow:false,
    sendTestBtn:true,
  }

  // 生命周期，完成dom加载
  componentDidMount() {
    const { noticeValue } = this.props;
    this.handleAgainChange(noticeValue.noticeagain);
  }

  handleAgainChange=(value)=>{
    const {form,noticeValue} = this.props;
    const noticeweekDefault=["1","2","3","4","5","6","0"];
    if(value===99){
      this.setState({
        weekShow:true
      },()=>{
        form.setFieldsValue({
          noticeweek:noticeValue.noticeweek?noticeValue.noticeweek.split(","):noticeweekDefault
        })
      })
    }
    else{
      this.setState({
        weekShow:false
      })
    }
  }

  sendTest=()=>{
    const {form} = this.props;
    if(form.getFieldValue("noticetype").length===0){
      message.info("请至少选择一种提醒方式");
      return;
    }
    const data={
      noticetype:form.getFieldValue("noticetype"),
      email:form.getFieldValue("email"),
      phone:form.getFieldValue("phone"),
      espace:form.getFieldValue("espace"),
      name:form.getFieldValue("name"),
      title:form.getFieldValue("title"),
    };
    const {dispatch}=this.props;
    this.setState({
      sendTestBtn:false
    });
    dispatch({
      type:'send/sendTest',
      data,
    }).then((res)=>{
      this.handleSendResult(res);
      // 发送成功后3秒后再使能按钮，防止无限点击发送
      setTimeout(
        ()=>this.setState({
          sendTestBtn:true
        }),3000
      );
    })
  }

  handleSendResult=(res)=>{
    if(res){
      res.forEach(item => {
        if(item.type==="sms"){
          if(item.status==="success"){
            message.success("短信验证消息发送成功，请查看");
          }
          else{
            message.error("短信验证消息发送失败，请检查预留的手机号，稍后再试");
          }
        }
        else if(item.type==="email"){
          if(item.status==="success"){
            message.success("邮件验证消息发送成功，请查看");
          }
          else{
            message.error("邮件验证消息发送失败，请检查预留的邮件地址，稍后再试");
          }
        }
        else if(item.type==="espace"){
          if(item.status==="success"){
            message.success("eSpace验证消息发送成功，请查看");
          }
          else{
            message.error("eSpace验证消息发送失败，请检查预留的eSpace地址，稍后再试");
          }
        }
        else{
          // eslint-disable-next-line no-lonely-if
          if(item.status==="success"){
            message.success("验证消息发送成功，请查看");
          }
          else{
            message.error("验证消息发送失败，稍后再试");
          }
        }
      });
    }
  }

  handleSave=()=>{
    const {form,handleCancelNotice,handleSendNotice,noticeValue} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      handleSendNotice(noticeValue.id,values);
      handleCancelNotice();
    });
  }

  // 渲染页面
  render() {
    const { noticeVisible,handleCancelNotice,form,ssoUser,noticeValue }=this.props;
    const { weekShow,sendTestBtn }=this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const hiddenLayout={
      display:"none"
    };
    return (
      <Modal
        title="提醒设置"
        width={560}
        visible={noticeVisible}
        maskClosable={false}
        onCancel={handleCancelNotice}
        destroyOnClose
        footer={[
          <Button key="test" onClick={this.sendTest} disabled={sendTestBtn===false}>验证一下</Button>,
          <Button key="submit" type="primary" onClick={this.handleSave}>
            保存
          </Button>,
        ]}
      >
        <Form layout="horizontal">
          <Form.Item label="uid" style={hiddenLayout}>
            {getFieldDecorator('uid', {
              initialValue: Cookies.get("uid"),
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="lid" style={hiddenLayout}>
            {getFieldDecorator('lid', {
              initialValue: noticeValue.id,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="title" style={hiddenLayout}>
            {getFieldDecorator('title', {
              initialValue: noticeValue.title,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="name" style={hiddenLayout}>
            {getFieldDecorator('name', {
              initialValue: userToArr(ssoUser.title),
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="手机" style={hiddenLayout}>
            {getFieldDecorator('phone', {
              initialValue: ssoUser.mobile?ssoUser.mobile.split("-")[1]:"",
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="邮件" style={hiddenLayout}>
            {getFieldDecorator('email', {
              initialValue: ssoUser.mail,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="espace" style={hiddenLayout}>
            {getFieldDecorator('espace', {
              initialValue: ssoUser.sAMAccountName,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="提醒方式" {...formItemLayout}>
            {getFieldDecorator('noticetype', {
              initialValue: noticeValue.noticetype?noticeValue.noticetype.split(","):[],
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                {/* <Checkbox value="1" disabled={ssoUser.mobile===""}><span title={ssoUser.mobile}>短信</span></Checkbox>
                <Checkbox value="2" disabled={ssoUser.mail===""}><span title={ssoUser.mail}>邮件</span></Checkbox>
                <Checkbox value="3" disabled={ssoUser.sAMAccountName===""}><span title={ssoUser.sAMAccountName}>eSpace</span></Checkbox> */}
                <Checkbox value="4" disabled={ssoUser.mobile===""}><span title={ssoUser.mobile}>Web</span></Checkbox>
                <Checkbox value="5" disabled={ssoUser.app===""}><span title={ssoUser.mail}>App</span></Checkbox>
                <Checkbox value="6" disabled={ssoUser.wx===""}><span title={ssoUser.mail}>微信</span></Checkbox>
                <Checkbox value="1" disabled={ssoUser.mobile===""}><span title={ssoUser.mobile}>短信</span></Checkbox>
                <Checkbox value="2" disabled={ssoUser.mail===""}><span title={ssoUser.mail}>邮件</span></Checkbox>
              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item label="设置时间" {...formItemLayout}>
            {getFieldDecorator('noticetime', {
              initialValue: noticeValue.noticetime?moment(noticeValue.noticetime,'HH:mm'):moment('10:00','HH:mm'),
              rules: [{ required: true, message: '请选择一个时间' }],
            })(
              <TimePicker format='HH:mm' placeholder="选择时间" />
            )}
          </Form.Item>
          <Form.Item label="设置周期" {...formItemLayout}>
            {getFieldDecorator('noticeagain', {
              initialValue:noticeValue.noticeagain?noticeValue.noticeagain:0,
              rules: [{ required: true, message: '请选择一个重复方式' }],
            })(
              <Select onChange={this.handleAgainChange}>
                <Option value={0}>只提醒一次</Option>
                <Option value={1}>每天</Option>
                <Option value={2}>工作日(每周一至周五)</Option>
                <Option value={99}>自定义</Option>
              </Select>
            )}
          </Form.Item>
          {
            weekShow?(
              <Form.Item label="自定义周期" {...formItemLayout}>
                {getFieldDecorator('noticeweek', {
                  initialValue:noticeValue.noticeweek?noticeValue.noticeweek.split(","):[],
                  rules: [{ required: true, message: '请选择自定义周期' }],
                })(
                  <Select mode="multiple">
                    <Option value="1">周一</Option>
                    <Option value="2">周二</Option>
                    <Option value="3">周三</Option>
                    <Option value="4">周四</Option>
                    <Option value="5">周五</Option>
                    <Option value="6">周六</Option>
                    <Option value="0">周日</Option>
                  </Select>
                )}
              </Form.Item>
            ):null
          }
        </Form>
      </Modal>
    );
  }
}

export default NoticeModal;
