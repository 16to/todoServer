#!/bin/bash
DBNAME="todo"
DBPW=$1
mysql -uroot -p$DBPW -e "create database ${DBNAME} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci"
mysql -uroot -p$DBPW  ${DBNAME} -e "source ${DBNAME}"