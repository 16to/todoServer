/* eslint-disable no-console */
const send = require('./send.js');

// 回调函数
const showResult=(res)=>{
  console.log(res);
}

// send.Sms("15158173747","你好，这是一个测试短信",showResult);
// send.Email("zhangjie230@huawei.com;liuqihui1@huawei.com","测试邮件","你好，这个是一个测试邮件",showResult);
// send.Espace("z00484460","测试Espace","你好，这个是一个测试Espace",showResult);
const tmp=`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>告警邮件</title>
  <style>
    body {
      width: 800px;
      font-family: "微软雅黑", Tahoma, Arial;
      padding: 0;
      margin: 0px auto;
      font-size: 14px;
    }

    a {
      color: #fff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <table width="800" cellspacing="0" cellpadding="0" align="center" border="0">
    <table cellspacing="0" border="0" width="800" height="48"
      style="background-color:#001529;font-size: 16px;padding-left: 10px;padding-right: 10px;padding-top: 10px;padding-bottom: 10px;">
      <tr>
        <td border="0" style="font-weight: bold;"><a href="http://luban.inhuawei.com" target="_blank" style="color: #23D5CF;font-size: 18px">LuBan</a></td>
        <td border="0" align="right" style="color:#ffffff">企业级一站式OPS解决方案平台</td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" border="0" width="798"
      style="background-color:#fff;color: #666;font-size: 14px;border-left:1px solid #dddddd;border-right:1px solid #dddddd;">
      <tr>
        <td height="20">
        </td>
      </tr>
      <tr>
        <td>
          <p style="text-indent: 1em;">尊敬的【名字变量】:</p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="text-indent: 3em;">您的服务发生告警，具体信息如下:</p>
        </td>
      </tr>
      <tr>
        <td height="10"></td>
      </tr>
      <tr>
        <td style="text-indent: 1em;">
          <table cellspacing="0" border="0" cellpadding="0">
            <tr>
              <td width="20"></td>
              <td>
              <table cellspacing="0" cellpadding="8"
                style="text-indent: 1em;color: #666;border-right:1px solid #dddddd;border-bottom:1px solid #dddddd;word-break: break-all;">
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警标题</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警标题变量】</td>
                </tr>
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警IP</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警IP变量】</td>
                </tr>
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警内容</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警内容变量】</td>
                </tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警发生时间</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警发生时间变量】</td>
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警责任人</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警责任人变量】</td>
                </tr>
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警级别</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警级别变量】</td>
                </tr>
                <tr>
                  <td width="128" style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">告警次数</td>
                  <td style="border-top:1px solid #dddddd;border-left:1px solid #dddddd">【告警次数变量】</td>
                </tr>
              </table>
              </td>
              <td width="20"></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td height="50">
          <p style="text-indent: 1em;"><a href="【详情的地址变量】" target="_blank" style="color: #23D5CF;text-decoration: underline">点击此处查看详情</a></p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="text-indent: 1em;font-size: 12px;color: #999;">
            本邮件由系统自动发放，请勿回复
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="text-indent: 1em;font-size: 12px;color: #999;">
              如果您不想再接收LuBan的邮件，或者需要设置其他人接收，点此 <a href="【告警配置的地址变量】" target="_blank" style="color: #23D5CF;text-decoration: underline">告警配置</a>
          </p>
        </td>
      </tr>
      <tr>
        <td height="20">
        </td>
      </tr>
    </table>
    <table cellspacing="0" border="0" width="800" height="80"
      style="background-color:#F3F3F3;padding-top: 16px;padding-bottom: 16px;">
      <tr>
        <td width="16"></td>
        <td border="0" width="150">
          <div><a href="http://luban.inhuawei.com" target="_blank" style="color: #666666;">鲁班官网</a></div>
          <div style="font-size: 12px;color: #999;line-height: 22px;">官方门户网站、产品入口</div>
        </td>
        <td border="0" width="150">
          <div><a href="im:pub_LuBan01" target="_blank" style="color: #666666;">鲁班官方群</a></div>
          <div style="font-size: 12px;color: #999;line-height: 22px;">在线服务支持、需求反馈</div>
        </td>
        <td border="0" width="150">
          <div><a href="http://3ms.huawei.com/hi/group/3855605" target="_blank" style="color: #666666;">鲁班官方社区</a></div>
          <div style="font-size: 12px;color: #999;line-height: 22px;">获取最新资讯、产品信息</div>
        </td>
        <td border="0" colspan="1" align="right" style="padding-right:8px;">
          <div style="font-size: 12px;color: #999;line-height: 22px;">Copyright @ LuBan 2019 All Rights Reserved</div>
        </td>
        <td width="16"></td>
      </tr>
    </table>
  </table>
</body>

</html>`;

send.Email("zhangjie230@huawei.com;wangxing50@huawei.com;","告警邮件",tmp,showResult);
