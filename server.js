import express from 'express';
import { APP_PORT } from "./config";
import mongoose from 'mongoose';

//middleware
import {errorHandler} from "./middlewares";

//routes
import { router } from "./routes";

const app = express();

app.use(express.json());

app.use('/api', router);

mongoose.connect('mongodb://127.0.0.1:27017/test',{ useNewUrlParser: true , useFindAndModify : true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected successfully!');
});







app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log(`Currently listening on Port ${APP_PORT} `);

})