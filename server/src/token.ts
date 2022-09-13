import { RequestHandler } from 'express';
import { getNewToken } from './utils/money-brilliant-puppet';

const tokenHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.query;
  console.log(req.query);
  if (!username || !password) {
    return res.status(400).send({
      message: 'Missing username or password',
    });
  }
  try {
    console.log('Getting Token via Puppeteer...');
    const token = await getNewToken(
      { username, password },
      {
        showBrowser: req.query.showBrowser,
      }
    );
    return res.status(200).send({
      message: 'Successfully retrieved auth token',
      token,
    });
  } catch (e) {
    return res.status(500).send({ message: 'Something went wrong.' });
  }
};

export default tokenHandler;
