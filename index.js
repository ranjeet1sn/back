const express = require('express')
const app = express()
 var cors = require('cors')
var bodyParser = require('body-parser')
app.use(cors({origin:"http://localhost:4200"}));
const rtsIndex = require('./router.js');
app.use(bodyParser.json());
var path = require('path'); 
app.use('/api', rtsIndex);
app.use(express.static(path.join(__dirname,'/public')))
app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname+"/public/index.html"))
})
const port=process.env.PORT||4000
app.listen(port, () => 
console.log("Server started at port : ",port));