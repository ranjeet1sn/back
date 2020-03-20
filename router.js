var mysql = require('mysql');
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
app.use( bodyParser.json({limit: '50mb'}) );
const stripe = require('stripe')('sk_test_o7851E847CPTTCX8RpeCvmsL00zx9qYNQG')
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const router = express.Router();
app.use(bodyParser.json())
var con = mysql.createConnection({
  host: "remotemysql.com",
  user: "hxmNkMPKis",
  password: "GKq2L7qWQ7",
  database:'hxmNkMPKis'
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
router.post('/record', function (req, res) {
    console.log(req.body)
    var sql = `INSERT INTO room (location,price,description,no,image) VALUES ('${req.body.location}','${req.body.price}','${req.body.description}','${req.body.no}','${req.body.image}')`;  
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result)
      console.log("1 record inserted");
    });
})
router.post('/help', function (req, res) {
  console.log(req.body)
  var sql = `INSERT INTO helpform (name,email,subject,no,description) VALUES ('${req.body.name}','${req.body.email}','${req.body.subject}','${req.body.no}','${req.body.description}')`;  
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    console.log("1 record inserted");
  });
})
router.get('/getroom',(req,res)=>{
    con.query(`SELECT * FROM room`, function (err, result) {
        if (err) throw err;
        res.send(result);
      });
})
router.get('/asc',(req,res)=>{
  con.query(`SELECT * FROM room`, function (err, result) {
      if (err) throw err;
      res.send(result);
    });
})
router.get('/getbylocation/:location',(req,res)=>{
  var req=req.params.location
  var sql=`SELECT * FROM room WHERE location='${req}'`
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result)
      res.send(result);
    });
})
router.post('/insert', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err,   hash) {
    var sql = `INSERT INTO register (name,email,password,role) VALUES ('${req.body.name}','${req.body.email}','${hash}','${req.body.role}')`;  
})
});
router.post('/newrecord', function (req, res) {
 var status='pending'
  var sql = `INSERT INTO detail (name,email,mobile,id,idtype,month,date,status) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.mobile}','${req.body.id}','${req.body.idtype}', '${req.body.month}', '${req.body.date}','${status}')`;  
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    console.log("1 record inserted");
  });
});
router.get('/getrecord',(req,res)=>{
  con.query(`SELECT * FROM detail`, function (err, result) {
      if (err) throw err;
      res.send(result);
    });
})
// router.put('/newrecord', function (req, res) {
//   var sql = `UPDATE room SET 
//    con.query(sql, function (err, result) {
//      if (err) throw err;
//      res.send(result)
//      console.log("1 record inserted");
//    });
//  });
router.delete('/:id',(req,res)=>{
    console.log(req.params.id)
    var sql = `DELETE FROM room WHERE id = ${req.params.id}`;
    con.query(sql, function (err, result) {
        console.log(err)
        res.send(result)
      if (err) throw err;
  })
})
router.put('/:id',(req,res)=>{
  console.log("sss")
  var sql = `UPDATE room SET 
  location='${req.body.location}',
  price='${req.body.price}',
  description='${req.body.description}',
  no='${req.body.no}',
  image='${req.body.image}'
  WHERE id = ${req.params.id}`;
  con.query(sql, function (err, result) {
      console.log(err)
    if (err) throw err;
    res.send(result)
    console.log(result.affectedRows + " record(s) updated");
  });
})

router.post('/payemnt', (req, res) => {
  console.log('ssss')
  var charge = stripe.charges.create({
      amount: req.body.amount,
      currency: 'INR',
      source: req.body.token
  }, (err, charge) => {
      if (err) {
          throw err;
      }
      res.json({
          success: true,
          message: "payment done"
      })
  })
})

  router.post('/authenticate' , (req, res, next) => {
    var email=req.body.email;
    con.query('SELECT * FROM register WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
        if(results.length >0){        
            bcrypt.compare(req.body.password, results[0].password, function (err, result) {
            if(result){
              var token=  jwt.sign({name:results[0].name,email:email,role:results[0].role},"Secret")
                res.json({
                    status:true,
                    message:'successfully authenticated',
                    token:token,
                })
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
        })
         
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exits"
          });
        }
      }
    });
})
module.exports = router;
 
