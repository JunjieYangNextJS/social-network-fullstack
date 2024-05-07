const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const socket = require('socket.io');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const socketPort = process.env.SOCKET_PORT || 8900;

// const io = new Server(socketPort, {
//   pingTimeout: 60000,
//   cors: {
//     credentials: true,
//     // origin: 'http://localhost:3000' || 'http://127.0.0.1:3000'
//     origin: og
//   }
// });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);

  const io = socket(server, {
    pingTimeout: 60000,
    cors: {
      // credentials: true,
      // origin: 'http://localhost:3000' || 'http://127.0.0.1:3000'
      origin: 'https://www.priders.net',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', soc => {
    // take userId and socId from user
    soc.on('setup', userData => {
      soc.join(userData._id);

      soc.emit('connected');
    });

    soc.on('join chat', room => {
      soc.join(room);
    });

    soc.on('sendMessage', ({ sender, receiverId, content, chatRoom }) => {
      // const receiver = newMessageReceived.receiverId;

      const id = uuidv4();

      soc.in(receiverId).emit('getMessage', {
        sender,
        content,
        chatRoom,
        createdAt: Date.now(),
        id,
        _id: id
      });
    });
  });
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
