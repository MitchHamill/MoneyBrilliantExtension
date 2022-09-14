import express from 'express';
import cors from 'cors';
import _ from 'lodash';

import tokenHandler from './token';
import axios from 'axios';
import bodyParser from 'body-parser';

const moneyBrilliantApi = axios.create({
  baseURL: 'https://api.moneybrilliant.com.au/api/v1/',
});

const app = express();
app.use(
  cors({
    origin: ['http://localhost:8100'],
  })
);
app.use(bodyParser.json({ strict: false }));
app.options('*', cors());

app.get('/token', tokenHandler);

app.post('/money-brilliant-proxy', async (req, res) => {
  const path = req.body?.path;
  try {
    if (!path) {
      return res.status(400).send({ message: 'Path is required' });
    }
    const apiRes = await moneyBrilliantApi(path, _.omit(req.body, ['path']));
    return res.status(apiRes.status).send(apiRes.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).send(err.response.data);
    }
    return res.status(500).send({ message: 'Something went wrong' });
  }
});

app.listen(3005, () => {
  console.log('Listening at http://localhost:3005');
});
