import express, { Express, Request, Response, NextFunction } from 'express';
import UserRouter from './router/user-router';
import PetRouter from './router/pet-router';
import WatchlistRouter from './router/watchlist-router';
import SignupCodeRouter from './router/signup-code-router';
import ImageRouter from './router/image-router';
import { dataInit } from './helper/database';
import { config } from './config';
const Twitter = require('twitter');

import cors from 'cors'

const port = 5000;
const app = express();
const userRouter = new UserRouter;
const petRouter = new PetRouter;
const watchlistRouter = new WatchlistRouter;
const signupCodeRouter = new SignupCodeRouter;
const imageRouter = new ImageRouter;

dataInit();
/*app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  response.type('application/json');

  next();
});*/

app.use(cors())
app.use(express.json());
app.use('/api/user', userRouter.router)
app.use('/api/pet', petRouter.router)
app.use('/api/watchlist', watchlistRouter.router)
app.use('/api/signup-code', signupCodeRouter.router)
app.use('/images', imageRouter.router)

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


//app.use('/images', express.static('images'))
/*app.get('/images/:imageName', (req, res) => {
  // do a bunch of if statements to make sure the user is 
  // authorized to view this image, then

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`images/${imageName}`)
  readStream.pipe(res)
})

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {

})
app.post('/api/images', upload.single('image'), (req, res) => {
  const file = req.file;
  console.log(file);

  res.json({ message: 'File uploaded successfully' });
});
*/

const client = new Twitter({
  consumer_key: config.twitterApiKey,
  consumer_secret: config.twitterApiSecret,
  access_token_key: config.twitterAccessToken,
  access_token_secret: config.twitterAccessTokenSecret
});

// Define a route that fetches the latest tweets from a user
app.post('/tweet', async (req, res) => {
  try {
    const tweet = req.body.tweet;
    const result = await client.post('statuses/update', { status: "Hello World" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.use((request: Request, response: Response) => {
  const responseMsg = { message: 'API not found' };
  response.status(404)
  response.send(responseMsg);
})

app.listen(port, () => {
  console.log(`server is running on http://localhost:5000`)
}
);