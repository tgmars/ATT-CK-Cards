import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { url } from '../../access';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', BaseRouter);
app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Connect to mongoose using details from access.ts
mongoose.connect(url, {useNewUrlParser: true });

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

app.get('*', cors(corsOptions), (req: Request, res: Response) => {
    // res.send({name: 'Tom'});
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;
