const mysql = require('sync-mysql');
const connection = new mysql({
    host: 'localhost',
    user: 'root',
    password: 'Fucker0916!',
    database: 'Inha'
});

exports.GetUser = function (ID, password) {
    var query = `select * from Members where ID='${ID}' and password='${password}'`;
    var result = connection.query(query);
    if (result)
        return result[0];
    else
        return null;
}

exports.CreateUser = function (ID, name, birth, gender, password) {
    var query = `insert into Members values('${ID}', '${name}', '${birth}', '${gender}', '${password}')`;
    var result = connection.query(query);
    console.log(result);
    if (result)
        return result;
    else return null;
}

exports.CreateDeal = function (userID, startTmn, startNm, startContact, endTmn, endNm, endContact, divTime, sideX, sideY, sideZ, weight, message, price, method, paydate) {
    var query = `insert into Deal(userID, startTmn, startNm, startContact, endTmn, endNm, endContact, divTime, sideX, sideY, sideZ, weight, message, price, method, paydate, status) values(
        '${userID}', '${startTmn}', '${startNm}', '${startContact}', '${endTmn}', '${endNm}', '${endContact}', '${divTime}', ${sideX}, ${sideY}, ${sideZ}, ${weight}, '${message}', ${price}, ${method}, '${paydate}', 0
    )`
    var result = connection.query(query);
    if (result)
        return result;
    else return null;
}

//3 개원 내의 거래내역 개요
exports.GetDealStatus = function (userID) {
    var dateOG = new Date();  //현재 날짜
    var year = dateOG.getUTCFullYear();
    var month = dateOG.getMonth() + 1;
    var day = dateOG.getDate();
    month -= 3;
    if (month < 0) {    //해가 다를 경우
        month += 12;
        year--;
    }
    var date = year + '-' + month + '-' + day;    //3개월 전의 날짜
    
    var queryAll=`select count(*) as count from Deal where userID='${userID}' and paydate>'${date}'`;
    var all=connection.query(queryAll)[0].count;
    var queryReady=`select count(*) as count from Deal where userID='${userID}' and paydate>'${date}' and status=0`;
    var ready=connection.query(queryReady)[0].count;
    var queryIng=`select count(*) as count from Deal where userID='${userID}' and paydate>'${date}' and status=1`;
    var ing=connection.query(queryIng)[0].count;
    var queryComplete=`select count(*) as count from Deal where userID='${userID}' and paydate>'${date}' and status=2`;
    var complete=connection.query(queryComplete)[0].count;
    var result= {
        All:all,
        Ready:ready,
        Progress: ing,
        Complete: complete
    }

    return result;
}

exports.GetDealList=function(userID){
    var query=`select * from Deal where userID='${userID}' order by paydate desc`;
    var result=connection.query(query);
    return result;
}