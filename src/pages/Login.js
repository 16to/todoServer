// 引入react和PureComponent
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Row, Col, Form, Icon } from 'antd';

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
          return;
        }
        dispatch({
          type: 'login/sendCaptcha',
          data: {
            'mobile': values.mobile
          }
        });
        this.runGetCaptchaCountDown();
      }
    );

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    if (form) {
      form.validateFields((err, values) => {
        dispatch({
          type: 'login/login',
          data: {
            'mobile': values.mobile,
            'vcode': values.vcode
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
    const { form: { getFieldDecorator } } = this.props;
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
            <Form onSubmit={this.handleSubmit}>
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
                )(<Input placeholder="手机号" size="large" prefix={<Icon type="mobile" className={styles.prefixIcon} />} />)}
              </Form.Item>
              <Form.Item>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('vcode', {
                      rules: [{
                        required: true,
                        message: "请输入验证码！",
                      }]
                    })(<Input placeholder='验证码' size="large" prefix={<Icon type="mail" className={styles.prefixIcon} />} />)}
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
                <Button size="large" htmlType="submit" className={styles.submit} type="primary">登录</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
