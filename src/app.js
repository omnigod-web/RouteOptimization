import express from "express";
import dotenv from "dotenv";
import routeRouter from "./routes/route.js";
// import rateLimit from "express-rate-limit";
import { rateLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use('/api' , routeRouter);

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`server is listening you at ${PORT}.. go Ahead`);
})