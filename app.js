const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('./SQL');

var OK = {
    Result: 'OK'
};

var Fail = {
    Result: 'Fail'
};

app.use(bodyParser.json());
app.post('/Login', function (req, res) {
    var body = req.body;
    var ID = body['ID'];
    var password = body['password'];
    var result = sql.GetUser(ID, password);
    console.log(";"+ID+";");
    console.log(";"+password+";");
    console.log(ID.length, password.length);
    var end = {
        ID: null,
        name: null,
        birth: null,
        gender: 'e'
    };
    if (result == null) {
        res.json(end);
        console.log('로그인 오류 발생');
    } else {
        end.ID = result.ID;
        end.name = result.name;
        end.birth = result.birth.substring(0, 10);
        end.gender = result.gender;
        res.json(end);
        console.log('사용자 접속: '+end.ID);
    }
    
});

//사용자 정보
app.get('/User', function(req, res){
    var userID=req.query.userID;
    var result=sql.GetUser(userID);
    res.json(result);
});

app.get('/Login', function (req, res) {
    var html = `<html>
    <form action='/Login' method='POST'>
    ID<input type='text' name='ID'/>
    PW<input type='text' name='password' />
    <input type='submit' value='제출'/>
    </form>
    </html>`;
    res.end(html);
});

app.post('/SignUp', function (req, res) {
    var body = req.body;
    var ID = body['ID'];
    var name = body['name'];
    var birth = body['birth'];
    var gender = body['gender'];
    var password = body['password'];
    console.log(ID);
    console.log(name);
    console.log(birth);
    console.log(gender);
    console.log(password);

    var result = sql.CreateUser(ID, name, birth, gender, password);
    if (result) {
        res.json(OK);
        console.log('새 사용자 생성: '+ID);
        console.log('이름: '+name);
    } else {
        res.json(Fail);
        console.log('회원가입 오류 발생');
    }
        
});

app.post('/CreateDeal', function (req, res) {
    var body = req.body;
    var userID = body['userID'];
    var startTmn = body['startTmn'];
    var startNm = body['startNm'];
    var startContact = body['startContact'];
    var endTmn = body['endTmn'];
    var endNm = body['endNm'];
    var endContact = body['endContact'];
    var divTime = body['divTime'];
    var sideX = body['sideX'];
    var sideY = body['sideY'];
    var sideZ = body['sideZ'];
    var weight = body['weight'];
    var message = body['message'];
    var price = body['price'];
    var method = body['method'];
    var paydate=body['paydate'];
    console.log(userID);
    console.log(startTmn);
    console.log(startNm);
    console.log(startContact);
    console.log(endTmn);
    console.log(endNm);
    console.log(endContact);
    console.log(divTime);
    console.log(sideX);
    console.log(sideY);
    console.log(sideZ);
    console.log(weight);
    console.log(message);
    console.log(method);
    console.log(price);
    console.log(paydate);


    var result = sql.CreateDeal(userID, startTmn, startNm, startContact, endTmn, endNm, endContact, divTime, sideX, sideY, sideZ, weight, message, price, method, paydate);
    if (result){
        res.json(OK);
        console.log('거래 발생: '+userID);
        console.log('출발: '+startTmn);
        console.log('도착: '+endTmn);
        console.log('금액: '+price);
    } else {
        res.json(Fail);
        console.log('거래 오류 발생');
        console.log('사용자: '+userID);
    }

});

// 3개월 내 거래내역 개요
app.get('/RecentDeal', function(req, res){
    var userID=req.query.userID;
    var result=sql.GetDealStatus(userID);
    console.log('거래내역 조회: '+userID);
    res.json(result);
});

//거래내역 전체
app.get('/DealList', function(req, res){
    var userID=req.query.userID;
    var result=sql.GetDealList(userID);
    console.log('거래내역 조회: '+userID);
    res.json(result);
});

//사용자의 이름과 비밀번호 변경
app.post("/UpdateUser", function(req, res){
    var body=req.body;
    var userID=body['userID'];
    var name=body['name'];
    var password=body['newPassword'];

    var result=sql.UpdateUser(userID, name, password);
    if(result){
        res.json(OK);
    } else {
        res.json(Fail);
    }
});

app.listen(3000, function () {
    console.log('서버 IP: ' + getServerIp());
    console.log('BusLinker 창업지원단 서버 실행');
});

var os = require('os');

function getServerIp() {
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function (details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }

    return result;
}