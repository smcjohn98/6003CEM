import express, { Express, Request, Response, NextFunction } from 'express';
import { EmployeeRouter } from './router/employee-router';
import Employee from './model/employee';

const port = 5000;
const app = express();
const employeeRouter = new EmployeeRouter;
Employee.sync()

app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  response.type('application/json');

  next();
});

app.use(express.json());
app.use('/employee', employeeRouter.router)

app.use((request: Request, response: Response) => {
  const responseMsg = { message: 'API not found' };
  response.status(404)
  response.send(responseMsg);
})

app.listen(port, () => {
  console.log(`server is running on http://localhost:5000`)
}
);