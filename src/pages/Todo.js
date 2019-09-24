// 引入react和PureComponent
import React, { Component } from 'react';
import { List, Button, Checkbox, Input, message, Avatar, Badge, Tag, Modal, Menu, Dropdown, Icon, Drawer } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import { connect } from 'dva';
import styles from './Todo.less';
import { filterbyToString, ordbyToString, timerangeToString } from '@/utils/utils';
import SysSetting from './SysSetting';
import EditItem from './EditItem';
import NoticeModal from './NoticeModal';

moment.locale('zh_CN');
const { confirm } = Modal;

@connect(({ todo, user, setting, loading }) => ({
  list: todo.list,
  setting: setting.setting,
  ssoUser: user.ssoUser,
  loading: loading.effects['todo/select']
}))
class Todo extends Component {

  state = {
    addValue: "",
    noticeValue: "",
    settingVisible: false,
    noticeVisible: false,
    doneVisible: true,
  }

  // 搜索条件
  params = {}

  componentWillMount() {
    // 判断是否登录
    if (Cookies.get("uid") === "" || Cookies.get("uid") === undefined || Cookies.get("uid") === null) {
      window.location.href = "/login";
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取用户信息
    dispatch({
      type: 'user/fetchUser',
    }).then(() => {
      const uid = Cookies.get("uid");
      if (uid === undefined) {
        window.location.href = "/login";
        return;
      }
      this.params.uid = uid;
      // 是否显示隐藏
      this.setState({
        doneVisible: localStorage.getItem("doneVisible") !== 'false'
      })
      // 获取todo setting
      this.selectSetting();
    });
  }

  // 显示设置
  showDrawer = () => {
    this.setState({
      settingVisible: true,
    });
  };

  // 关闭设置
  onClose = () => {
    this.setState({
      settingVisible: false,
    });
  };

  selectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todo/select',
      params: this.params,
    });
  }

  selectSetting = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/select',
    }).then((setting) => {
      this.params.filterby = undefined;
      this.params.orderby = undefined;
      this.params.timerange = undefined
      // 获取todo列表
      if (setting.filterby) {
        this.params.filterby = setting.filterby
      }
      if (setting.orderby) {
        this.params.orderby = setting.orderby
      }
      if (setting.timerange) {
        this.params.timerange = setting.timerange
      }
      this.selectList();
    })
  }

  // 受控组件
  addValueChange = (e) => {
    this.setState({
      addValue: e.target.value
    });
  }

  addItem = (e) => {
    const item = e.target.value;
    if (item === "") {
      message.info('任务描述不能为空', 2);
      return;
    }
    if (item.length > 200) {
      message.info('任务描述过长，请不要超过200个字符', 2);
      return;
    }
    const { dispatch } = this.props;
    const data = {
      title: item,
      uid: Cookies.get("uid")
    }
    dispatch({
      type: 'todo/insert',
      params: this.params,
      data
    });
    this.setState({
      addValue: ""
    });
  }

  delItemConfirm = (id) => {
    const { dispatch } = this.props;
    const { params } = this;
    confirm({
      title: '该事项还未完成，确认删除吗？',
      okText: "确认",
      cancelText: "取消",
      destroyOnClose: true,
      onOk() {
        dispatch({
          type: 'todo/delete',
          params,
          id,
        });
      },
      onCancel() {

      }
    })

  }

  delItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todo/delete',
      params: this.params,
      id,
    });
  }

  changeItem = (id, status) => {
    const { dispatch } = this.props;
    const data = {
      status
    }
    dispatch({
      type: 'todo/update',
      params: this.params,
      id,
      data
    });
  }

  handleSort = (id) => {
    const { dispatch } = this.props;
    const data = {
      sort: 1,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleImportant = (id) => {
    const { dispatch } = this.props;
    const data = {
      important: 1,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleAll = (id) => {
    const { dispatch } = this.props;
    const data = {
      important: 1,
      sort: 1,
      top: 1
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleUnset = (id) => {
    const { dispatch } = this.props;
    const data = {
      sort: 0,
      important: 0,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleUnSort = (id) => {
    const { dispatch } = this.props;
    const data = {
      sort: 0,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleUnTop = (id) => {
    const { dispatch } = this.props;
    const data = {
      top: 0,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleUnImportant = (id) => {
    const { dispatch } = this.props;
    const data = {
      important: 0,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  // 置顶
  handleTop = (id) => {
    const { dispatch, list } = this.props;
    // 查看未完成置顶的数量
    const topCount = list.filter((item) => item.top === 1 && item.status === 0 && item.id !== id);
    if (topCount.length >= 3) {
      message.info('置顶任务超过3个了，请优先完成', 2);
    }
    const data = {
      top: 1,
    }
    dispatch({
      type: 'todo/tag',
      params: this.params,
      id,
      data
    });
  }

  handleSendNotice = (id, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'todo/notice',
      params: this.params,
      id,
      data
    });
  }

  // 设置提醒
  showNotice = (item) => {
    this.setState({
      noticeValue: item,
      noticeVisible: true,
    })
  }

  // 取消设置提醒
  handleCancelNotice = () => {
    this.setState({
      noticeVisible: false,
    })
  }

  // 隐藏已完成
  hideDone = () => {
    localStorage.setItem("doneVisible", false);
    this.setState({
      doneVisible: false
    })
  }

  // 显示已完成
  showDone = () => {
    localStorage.setItem("doneVisible", true);
    this.setState({
      doneVisible: true
    })
  }

  render() {
    const { loading, list, ssoUser, setting } = this.props;
    const { addValue, settingVisible, noticeVisible, noticeValue, doneVisible } = this.state;
    const doingData = [];
    const doneData = [];
    list.forEach(item => {
      if (item.status === 0) {
        doingData.push(item);
      }
      if (item.status === 1) {
        doneData.push(item);
      }
    });
    doingData.sort((a, b) => b.top - a.top)
    const AddMore = ({ id }) => {
      const itemMenu = (
        <Menu>
          <Menu.Item key="top">
            <a onClick={() => this.handleTop(id)}>
              <Tag color="#f81d22">置顶</Tag>
            </a>
          </Menu.Item>
          <Menu.Item key="sort">
            <a onClick={() => this.handleSort(id)}>
              <Tag color="volcano">紧急</Tag>
            </a>
          </Menu.Item>
          <Menu.Item key="important">
            <a onClick={() => this.handleImportant(id)}>
              <Tag color="blue">高优</Tag>
            </a>
          </Menu.Item>
        </Menu>
      );
      return (
        <Dropdown overlay={itemMenu} placement="topLeft" className={styles.tagBtn}>
          <Button shape="circle" icon="tag" title="标签，[单击]快速置顶" size="small" onClick={() => { this.handleTop(id) }} />
        </Dropdown>
      )
    };
    const DoingList = (
      <List
        loading={loading}
        dataSource={doingData}
        renderItem={item => (
          <List.Item>
            <Checkbox checked={false} onChange={() => this.changeItem(item.id, 1)} />
            <Tag color="#f81d22" visible={item.top} closable onClose={() => this.handleUnTop(item.id)}>置顶</Tag>
            <Tag color="volcano" visible={item.sort} closable onClose={() => this.handleUnSort(item.id)}>紧急</Tag>
            <Tag color="blue" visible={item.important} closable onClose={() => this.handleUnImportant(item.id)}>高优</Tag>
            <span className={styles.title}>
              <EditItem title={item.title} id={item.id} params={this.params} />
            </span>
            <span className={styles.time}>{moment(item.addtime).fromNow()}</span>
            <Button className={styles.del} onClick={() => this.delItemConfirm(item.id)} shape="circle" icon="delete" title="删除" size="small" />
            <AddMore id={item.id} />
            <Button className={item.noticetype ? styles.noticed : styles.notice} onClick={() => this.showNotice(item)} shape="circle" icon="bell" title="提醒" size="small" />
          </List.Item>
        )}
      />
    );
    const DoneList = (
      <List
        dataSource={doneData}
        renderItem={item => (
          <List.Item>
            <Checkbox checked onChange={() => this.changeItem(item.id, 0)} />
            <Tag className={styles.doneTag} visible={item.top} onClose={() => this.handleUnTop(item.id)}>置顶</Tag>
            <Tag className={styles.doneTag} visible={item.sort} onClose={() => this.handleUnSort(item.id)}>紧急</Tag>
            <Tag className={styles.doneTag} visible={item.important} onClose={() => this.handleUnImportant(item.id)}>高优</Tag>
            <span className={styles.doneTitle}>
              <EditItem title={item.title} id={item.id} params={this.params} />
            </span>
            <span className={styles.doneTime}>{moment(item.updatetime).format("YYYY-MM-DD HH:mm:ss")}</span>
            <Button className={styles.del} onClick={() => this.delItem(item.id)} type="danger" shape="circle" icon="delete" title="删除" size="small" />
          </List.Item>
        )}
      />
    );
    const bgStyle = setting.imageurl ? ({
      backgroundImage: `url(${setting.imageurl})`
    }) : null;

    const opacityStyle = setting.opacity ? ({
      backgroundColor: `rgba(255,255,255,${setting.opacity / 100})`
    }) : null;

    const Eye = doneVisible ? (
      <Icon type="eye" title="隐藏完成" className={styles.eye} onClick={this.hideDone} />
    ) : (
      <Icon type="eye-invisible" title="显示完成" className={styles.eye} onClick={this.showDone} />
      );
    return (
      <div className={styles.main} style={bgStyle}>
        <div className={styles.content} style={opacityStyle}>
          <div className={styles.header}>
            <div className={styles.userinfo}>
              {
                ssoUser && ssoUser.avatar ? (
                  <Avatar
                    src={ssoUser.avatar}
                  />) : (
                    <Avatar
                      icon="user"
                    />
                  )
              }
              <span className={styles.name}>{ssoUser && ssoUser.name ? ssoUser.name : "匿名"}</span>
              <span>待办事项</span>
              <span className={styles.setting}>
                {setting.filterby ? (
                  <Tag color="cyan">{filterbyToString(setting.filterby)}</Tag>
                ) : null}
                {setting.orderby ? (
                  <Tag color="cyan">{ordbyToString(setting.orderby)}</Tag>
                ) : null}
                {setting.timerange ? (
                  <Tag color="cyan">{timerangeToString(setting.timerange)}</Tag>
                ) : null}
                <Icon type="setting" title="设置" onClick={this.showDrawer} />
              </span>
            </div>
            <div className={styles.add}>
              <Input placeholder="添加一个任务，回车添加" value={addValue} id="kw" onChange={this.addValueChange} onPressEnter={this.addItem} autoComplete="off" autoFocus allowClear />
            </div>
          </div>
          <h2>未完成
            <span className={styles.count}><Badge count={doingData.length} showZero /></span>
          </h2>
          {doingData.length ? DoingList : null}
          <h2>已完成
            {doneData.length ? Eye : null}
            <span className={styles.count}><Badge count={doneData.length} style={{ backgroundColor: '#999' }} showZero /></span>
          </h2>
          {doneData.length && doneVisible ? DoneList : null}
        </div>
        <Drawer
          title="设置"
          width={380}
          placement="right"
          onClose={this.onClose}
          visible={settingVisible}
          destroyOnClose
        >
          <SysSetting selectSetting={this.selectSetting} />
        </Drawer>
        <NoticeModal
          noticeVisible={noticeVisible}
          handleCancelNotice={this.handleCancelNotice}
          handleSendNotice={this.handleSendNotice}
          noticeValue={noticeValue}
          key={Math.random()}
          ssoUser={ssoUser}
        />
      </div>
    );
  }
}

export default Todo;