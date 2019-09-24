// 引入react和PureComponent
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import router from 'umi/router';
import { Button, Input, Row, Col, Form, Icon,message } from 'antd';

import styles from './Login.less';

@connect(({ login, loading }) => ({
  loginInfo: login.info,
  submiting: loading.effects['login/login']
}))
@Form.create()
class Login extends PureComponent {
  // 定义状态值
  state = {

  }

  // 生命周期，完成dom加载
  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    this.sendCaptcha();
  };

  sendCaptcha = () => {
    const { form, dispatch } = this.props;
    form.validateFields(
      ['mobile'],
      {},
      (err, values) => {
        if (err) {
          this.mobileInput.focus();
          return;
        }
        dispatch({
          type: 'login/sendCaptcha',
          data: {
            'mobile': values.mobile
          }
        });
        this.runGetCaptchaCountDown();
        this.vcodeInput.focus();
      }
    );

  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    if (form) {
      form.validateFields((err, values) => {
        if (err) {
          if(err.mobile){
            this.mobileInput.focus();
            return;
          }
          if(err.vcode){
            this.vcodeInput.focus();
            return;
          }
          return;
        }
        dispatch({
          type: 'login/login',
          data: {
            'mobile': values.mobile,
            'vcode': values.vcode
          }
        }).then((res)=>{
          if(res){
            if(res.cc===2){
              message.error("验证码错误");
              return;
            }
            if(res.cc===3){
              message.error("验证码已过期，请重新获取");
              return;
            }
            if(res.cc===99){
              message.error(res);
              return;
            }
            Cookies.set("uid", res.uid);
            router.push("/");
          }
        })
      });
    }
  };

  runGetCaptchaCountDown = () => {
    let count = 59;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  // 渲染页面
  render() {
    const { form: { getFieldDecorator },submiting } = this.props;
    const { count } = this.state;
    return (
      <div className={styles.login}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.title}>Todo</span>
            </div>
            <div className={styles.desc}>可能是滨江区最好用的代办事项应用</div>
          </div>

          <div className={styles.loginBox}>
            <Form>
              <Form.Item>
                {getFieldDecorator("mobile", {
                  rules: [{
                    required: true,
                    message: "请输入手机号！",
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "手机号格式错误！",
                  }],
                  validateTrigger: 'onBlur',

                }
                )(<Input ref={(c) => { this.mobileInput = c; }} autoFocus onPressEnter={this.handleSubmit} placeholder="手机号" size="large" prefix={<Icon type="mobile" className={styles.prefixIcon} />} />)}
              </Form.Item>
              <Form.Item>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('vcode', {
                      rules: [{
                        required: true,
                        message: "请输入验证码！",
                      }]
                    })(<Input ref={(c) => { this.vcodeInput = c; }} onPressEnter={this.handleSubmit} placeholder='验证码' size="large" prefix={<Icon type="mail" className={styles.prefixIcon} />} />)}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={!!count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} 秒` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <Button size="large" loading={submiting} onClick={this.handleSubmit} className={styles.submit} type="primary">登录</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
