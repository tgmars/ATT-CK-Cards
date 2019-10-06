// Put on hold, was causing big performance issues.. I think. Code readability in Server.ts will take a hit
// until it gets solved.



// import socket from 'socket.io';
// import Command from './model/commands';
// import { MessageModel } from '@entities';

// export async function onChat(io: socket.Server, sock: socket.Socket, chat: any) {
//      // Check if the message is a command prior to actioning.
//     // We don't care if commands are saved to the database,  we want their outcomes interacting with ithe db.
//     if (chat.message.charAt(0) === '/') {
//         const command = new Command(chat.message, chat.player);
//         const result = await command.execute();

//         if ((result.message.substring(0, 12) === 'Game created') || result.message.substring(0, 11) === 'Name change') {
//           io.emit('chat', result);
//         } else {
//           sock.emit('chat', result);
//         }
//     } else {
//         // If it's not a command, we want it shown to everyone and saved.
//         // Save the message into the database
//         const response = await new MessageModel(chat).save();
//         // GIven the response, use its ID to query the DB for the entry and
//         // populate it with the appropriate name and send it back to connected clients.
//         const messages = await MessageModel.findById(response._id).populate('player', 'name');
//         io.emit('chat', messages);
//     }
// }
