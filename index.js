require("dotenv").config();
const express = require('express');
const app = express();
var cors = require('cors');
var apis = require('./apis/todo');
var dbconnection = require('./utils/dbconnection');
const bodyParser= require('body-parser');


app.use( bodyParser.json() );  
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(express.json());
app.use('/api',apis);

app.listen(process.env.PORT,()=>{
    console.log("server started on port no. : ",process.env.PORT);
});
