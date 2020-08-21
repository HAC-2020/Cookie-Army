const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/solve', async (req, res) => {
  console.log('query', req.query.exp);
  const exp = encodeURIComponent(req.query.exp);
  // console.log(exp);
  const url = `http://api.wolframalpha.com/v2/query?appid=R4QG7H-63263XEEQU&input=solve+${exp}&podstate=Step-by-step%20solution`;

  const wolfRes = await axios.post(url);

  res.send(wolfRes.data);
});

module.exports = router;
