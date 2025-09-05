const express = require('express');
//import express
const path = require('path');

const methodOverride= require("method-override");
// ghi đè phương thức
const bodyParser= require('body-parser')
// lấy nội dung của req.body
const flash= require('express-flash')
//thông báo khi làm gì đó
const cookieParser= require('cookie-parser')
const session= require('express-session');
//2 thư viện áp dụng cho flash



require('dotenv').config();
const database = require('./config/database');
//nhúng mongoose
database.connect();

const app = express();
//goi hàm express tạo app


//tạo express flash
app.use(cookieParser('keyboard cat'));
app.use(session({cookie: {maxAge: 60000}}));
app.use(flash());
app.use(methodOverride('_method'));
// method override
app.use(bodyParser.urlencoded({extended: false}));
//body parser

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// trình soạn thảo văn bản TinyMCE

const port = process.env.PORT;
const route = require("./routes/client/index.route");
const routeAdmin= require('./routes/admin/index.route');
const systemConfig = require('./config/system');
//cổng
//đọc pug ở đâu
app.set('views', `${__dirname}/views`);
//set cho engine đang dùng là pug
app.set('view engine', 'pug');


// trên server k hiểu file public
// có 1 biến _dirname
app.use(express.static(`${__dirname}/public`))
// có thể load được những file public
route(app);
routeAdmin(app);
//app local variabble
app.locals.PATH_ADMIN= systemConfig.prefixAdmin;
// router => trả về gì ( phản hồi)
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
})
//app là cấp cao nhất