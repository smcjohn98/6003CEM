import express, { Express, Request, Response, NextFunction } from 'express';
import UserRouter from './router/user-router';
import PetRouter from './router/pet-router';
import WatchlistRouter from './router/watchlist-router';
import ChatRouter from './router/chat-router';
import SignupCodeRouter from './router/signup-code-router';
import ImageRouter from './router/image-router';
import { dataInit } from './helper/database';


import cors from 'cors'

const port = 5000;
const app = express();
const userRouter = new UserRouter;
const petRouter = new PetRouter;
const watchlistRouter = new WatchlistRouter;
const signupCodeRouter = new SignupCodeRouter;
const imageRouter = new ImageRouter;
const chatRouter = new ChatRouter;

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
app.use('/api/chat', chatRouter.router)
app.use('/images', imageRouter.router)

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.use((request: Request, response: Response) => {
  const responseMsg = { message: 'API not found' };
  response.status(404)
  response.send(responseMsg);
})

app.listen(port, () => {
  console.log(`server is running on http://localhost:5000`)
});

export default app;