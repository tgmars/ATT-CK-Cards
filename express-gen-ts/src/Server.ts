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
import socket from 'socket.io';
import { MessageModel } from '@entities';
import http from 'http';
import { logger as consolelog } from './shared/Logger';
import Command from './model/commands';

// Init express
const app = express();
const httpsrv = http.createServer(app);

// Add middleware/settings/routes to express.

const whitelist = ['http://localhost:8080', 'http://0.0.0.0:8080', '0.0.0.0:8080'];
const corsOptions = {
  credentials: true, // This is important.
  origin: 'http://0.0.0.0:8080',
};

// Apply cors to express
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', BaseRouter);

// Connect to mongoose using details from access.ts
mongoose.connect(url, {useNewUrlParser: true });

const io =  socket(httpsrv);

io.on('connection', (sock) => {
  consolelog.info('Socket Connection Established with ID :' + sock.id);
    // Actions on a chat message received.
  sock.on('chat', async (chat) => {

    // Check if the message is a command prior to actioning.
    // We don't care if commands are saved to the database,  we want their outcomes interacting with ithe db.
    if (chat.message.charAt(0) === '/') {
      const command = new Command(chat.message, chat.player);
      const result = await command.execute();
      consolelog.info(JSON.stringify(result));
      sock.emit('chat', result);
    } else {
      // If it's not a command, we want it shown to everyone and saved. 
      // Save the message into the database
      const response = await new MessageModel(chat).save();
      // GIven the response, use its ID to query the DB for the entry and
      // populate it with the appropriate name and send it back to connected clients.
      const messages = await MessageModel.findById(response._id).populate('player', 'name');
      io.emit('chat', messages);
    }

  });
});

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

app.get('*', (req: Request, res: Response) => {
    // res.send({name: 'Tom'});
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default httpsrv;
