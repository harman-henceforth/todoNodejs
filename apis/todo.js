var async = require('async');
var express = require('express');
var router = express.Router();
var dbqueries = require('./../utils/dbqueries');
var apiResponse = require('./../utils/apiResponse');



router.post('/task',(req,res)=>{
    async.waterfall([
        function (cb) {
            var sql = "insert into tasks set title=?";
            var params = [req.body.title];
            if(req.body.order) {
                sql+= ", `order`=?";
                params.push(req.body.order)
            }
            dbqueries.query(sql, params, "id", cb);
        },
        function (id, cb) {
            var sql = "select * from tasks where id=?";
            dbqueries.query(sql, [
                id
            ], "row", cb);
        }
    ], function (err, result) {
        var data = responseData(result);
    
        apiResponse.response(err, err ? result : data, res);
    });
});

router.get('/task',(req,res)=>{
    async.waterfall([
        function (cb) {
            var sql = {};
            sql.sql = "select * from tasks"
            sql.where = " ";
            var params = [];

            sql.total = " select count(*) as n from tasks"

            if (req.query.completed) {
                sql.where += " where tasks.completed=?";
                params.push(req.query.completed);
            }
            sql.order = " order by tasks.id asc";
            dbqueries.query(sql.sql + sql.where + sql.order, params, "result", cb);

        }
    ], function (err, result) {
        var data = [];
        result.map(function (x) {
            data.push(responseData(x));
        });
        console.log(data);
        
        apiResponse.response(err, data, res)
    })
});

router.get('/task/:id',(req,res)=>{
    async.waterfall([
        
        function (cb) {
            // var sql = {};
            var sql = "select * from tasks where id=?"
            dbqueries.query(sql, [req.params.id], "row", cb);
        }
    ], function (err, result) {
        var data = responseData(result);
        apiResponse.response(err, data, res)
    })
});



function responseData(result) {
    return {
        id:result.id,
        title: result.title,
            completed: result.completed ==0 ? false : true,
            order: result.order,
            url: process.env.URL + "api/task/" + result.id
    }
}
module.exports = router;


