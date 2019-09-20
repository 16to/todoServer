/*
MySQL Data Transfer
Source Host: localhost
Source Database: todo
Target Host: localhost
Target Database: todo
Date: 2019/5/6 17:02:11
*/

-- ----------------------------
-- Table structure for list
-- ----------------------------
CREATE TABLE `list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` char(20) NOT NULL DEFAULT '16to',
  `title` char(200) NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-未完成1-完成',
  `sort` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-不紧急1-紧急',
  `important` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-不重要1-重要',
  `top` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-不置顶1-置顶',
  `addtime` bigint(20) DEFAULT '0',
  `updatetime` bigint(20) DEFAULT '0',
  `noticetype` char(20) DEFAULT '' COMMENT '1-短信2-邮件3-espace',
  `noticetime` char(20) DEFAULT '',
  `noticeagain` tinyint(4)) DEFAULT '0' COMMENT '0-只提醒一次1-每天2-工作日99-自定义',
  `noticeweek` char(20) DEFAULT '',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

CREATE TABLE `setting` (
  `uid` char(20) NOT NULL DEFAULT '16to',
  `filterby` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-无1-筛选紧急2-筛选高优3-筛选紧急高优4-普通99-筛选置顶',
  `orderby` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-无1-标签优先2-顺序优先',
  `timerange` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-无1-今天2-本周3-本月4-全年',
  `imageurl` varchar(255) DEFAULT '',
  `opacity` tinyint(4) NOT NULL DEFAULT '95',
  PRIMARY KEY (`uid`)
) DEFAULT CHARSET=utf8;

CREATE TABLE `jobing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lid` int(11) NOT NULL COMMENT 'list Id',
  `uid` char(20) NOT NULL DEFAULT '16to' COMMENT 'user Id',
  `title` char(200) NOT NULL DEFAULT '',
  `name` char(20) DEFAULT '',
  `email` char(50) DEFAULT '',
  `phone` char(20) DEFAULT '',
  `espace` char(20) DEFAULT '',
  `updatetime` bigint(20) DEFAULT '0',
  `noticetype` char(200) DEFAULT '' COMMENT '1-短信2-邮件3-espace',
  `noticetime` char(20) DEFAULT '',
  `noticeagain` tinyint(4) DEFAULT '0' COMMENT '0-只提醒一次1-每天2-工作日99-自定义',
  `noticeweek` char(200) DEFAULT '',
  `cronstring`  char(200) DEFAULT '' COMMENT 'cron表达式',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

CREATE TABLE `sendlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` char(20) NOT NULL DEFAULT '16to' COMMENT 'user Id',
  `noticetype` char(200) DEFAULT '' COMMENT '1-短信2-邮件3-espace',
  `addtime` bigint(20) DEFAULT '0',
  `email` char(50) DEFAULT '',
  `phone` char(20) DEFAULT '',
  `espace` char(20) DEFAULT '',
  `title` char(200) NOT NULL DEFAULT '',
  `result` char(200) DEFAULT '',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
