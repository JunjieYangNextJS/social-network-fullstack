const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: './config.env' });

const og =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND
    : process.env.FRONTEND_URL_LOCAL;

const io = new Server(8900, {
  pingTimeout: 60000,
  cors: {
    credentials: true,
    // origin: 'http://localhost:3000' || 'http://127.0.0.1:3000'
    origin: og
  }
});

// let users = [];

// const addUser = (userId, socketId) => {
//   if (users.some(user => user?.userId === userId)) return;
//   users.push({ userId, socketId });
// };

// const removeUser = socketId => {
//   users = users.filter(user => user?.socketId !== socketId);
// };

// const getUser = userId => {
//   return users.find(user => user?.userId === userId);
// };

io.on('connection', socket => {
  // take userId and socketId from user
  socket.on('setup', userData => {
    socket.join(userData._id);

    socket.emit('connected');
  });

  socket.on('join chat', room => {
    socket.join(room);
  });

  socket.on('sendMessage', ({ sender, receiverId, content, chatRoom }) => {
    // const receiver = newMessageReceived.receiverId;

    const id = uuidv4();

    socket.in(receiverId).emit('getMessage', {
      sender,
      content,
      chatRoom,
      createdAt: Date.now(),
      id,
      _id: id
    });
  });
});
// io.on('connection', socket => {
//   // when connect

//   // take userId and socketId from user
//   socket.on('addUser', userId => {
//     addUser(userId, socket?.id);
//     io.emit('getUsers', users);
//   });

//   // send and get message
//   socket.on('sendMessage', ({ sender, receiverId, content, chatRoom }) => {
//     const receiver = getUser(receiverId);

//     const id = uuidv4();

//     io.to(receiver?.socketId).emit('getMessage', {
//       sender,
//       content,
//       chatRoom,
//       createdAt: Date.now(),
//       id,
//       _id: id
//     });
//   });

//   // when disconnect
//   socket.on('disconnect', () => {
//     removeUser(socket?.id);
//     io.emit('getUsers', users);
//   });
// });
