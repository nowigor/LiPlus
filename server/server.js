const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const Librus = require("librus-api");

const app = express();
app.use(cors());
const client = new Librus();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 3030;

let login = null;
let password = null;
app.post('/user', (req, res) =>
{
  const {UserLogin, UserPassword} = req.body;
  login = UserLogin;
  password = UserPassword;
  console.log(login, password);
  authorize(res);
});

const authorize = (res) =>
{
  client.authorize(login, password).then(function () {
      client.homework.listSubjects().then((data) => {
        return res.status(201).json({status: "success", data: data});
      });
        // client.info.getGrades().then((data) => {console.log(data[14].semester[0].grades)});
  });
}


app.get('/', (req,res)=>{
  return res.status(200).json({content: "content"});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
