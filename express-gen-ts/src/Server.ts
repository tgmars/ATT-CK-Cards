import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { STATES } from 'mongoose';
import { url } from '../../access';
import socket from 'socket.io';
import { MessageModel, GameModel, PlayerModel } from '@entities';
import http from 'http';
import { logger as consolelog } from './shared/Logger';
import Command from './model/commands';
import { GameBoard } from './model/gameBoard';
import { IState } from './State';
// import {onChat} from './SocketHandler';

export let mitre = require('./resources/attack-techniques-20190811.json');

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

export let state: IState = {games : []};

io.on('connection', (sock) => {
  consolelog.info('Socket Connection Established with ID :' + sock.id);
    // Actions on a chat message received.
  sock.on('chat', async (chat) => {
    // await onChat(io, sock, chat);
        // Check if the message is a command prior to actioning.
    // We don't care if commands are saved to the database,  we want their outcomes interacting with ithe db.
    if (chat.message.charAt(0) === '/') {
      const command = new Command(chat.message, chat.player);
      const result = await command.execute();

      if ((result.message.substring(0, 12) === 'Game created') || result.message.substring(0, 11) === 'Name change') {
        io.emit('chat', result);
      } else {
        sock.emit('chat', result);
      }
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

  sock.on('gameplay', async (index) => {
    // We receive a request with an attack turn
    // states.games
    if ( index.idupdate ) {
      sock.join(index.gameID);
      consolelog.info('joined game room: ' + index.gameID);
    }

    if (index.attackerindex != undefined) {
      // Get the index to the game held in state that we care about
      const gameIndex = state.games.findIndex((game) => game.gameID == index.gameID);

      if (state.games[gameIndex].isDefenderTurn()) {
        consolelog.info('not attackers turn');
      } else {
        // consolelog.info('server state preplay: ' + JSON.stringify(state.games[gameIndex]));
        state.games[gameIndex].attackerPlay(index.attackerindex);
        // consolelog.info('server state postplay: ' + JSON.stringify(state.games[gameIndex]));
        try {
          await GameModel.findByIdAndUpdate(index.gameID, state.games[gameIndex].toCompliantObject() );
          await PlayerModel.findByIdAndUpdate(state.games[gameIndex].player._id,
            state.games[gameIndex].player.toCompliantObject());
          await PlayerModel.findByIdAndUpdate(state.games[gameIndex].opponent._id,
            state.games[gameIndex].opponent.toCompliantObject());
          consolelog.info('Updated game and both player models');  
          } catch (err) {
          consolelog.error('Error while finding and updating game collection with latest turn.');
        }
        io.to(index.gameID).emit('gameplay', state.games[gameIndex]);
        consolelog.info('emitted a gameplay event back over the socket - broadcast to room');
        // modifys the relevant player and the gameboard
        //now we need to push that to the database and to the player.
        // update the players hand in the database
        // emit the players hand
        // emite the gamestate and the players id?

      }

    }
    // We receive a request with a defenders turn
    if (index.defenderindex != undefined) {
      // consolelog.info(JSON.stringify(index))
      const gameIndex = state.games.findIndex((game) => game.gameID == index.gameID);

      if (state.games[gameIndex].isAttackerTurn()) {
        consolelog.info('not defenders turn');
      } else {
        // consolelog.info('server state preplay: ' + JSON.stringify(state.games[gameIndex]));
        state.games[gameIndex].defenderPlay(index.defenderindex);
        // consolelog.info('server state preplay: ' + JSON.stringify(state.games[gameIndex]));

        try {
          await GameModel.findByIdAndUpdate(index.gameID, state.games[gameIndex].toCompliantObject() );
          await PlayerModel.findByIdAndUpdate(state.games[gameIndex].player._id,
            state.games[gameIndex].player.toCompliantObject());
          await PlayerModel.findByIdAndUpdate(state.games[gameIndex].opponent._id,
            state.games[gameIndex].opponent.toCompliantObject());
          consolelog.info('Updated game and both player models');
          } catch (err) {
          consolelog.error('Error while finding and updating game collection with latest turn.');
        }

        io.to(index.gameID).emit('gameplay', state.games[gameIndex]);
        consolelog.info('emitted a gameplay event back over the socket - emit to room mode');
        // modifys the relevant player and the gameboard
        //now we need to push that to the database and to the player.    }
        }
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
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default httpsrv;
