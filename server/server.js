const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Librus = require("librus-api");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const client = new Librus();

client.authorize("8419311u", "&i2+!p$W&Ej3Z2$").then(function () {


    client.homework.listSubjects().then((data) => {console.log(data)});
    client.info.getGrades().then((data) => {console.log(data[14].semester[0].grades)});
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
