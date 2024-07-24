import dotenv from  'dotenv';
import { app } from "./app.js";
import { connectDB } from "./src/db/index.js";
import WebSocket,{WebSocketServer } from 'ws';
import http from 'http'
import initWebSocketServer from './src/websockets/webSocket.server.js';
dotenv.config({
    path: './.env.local',
})
const PORT = process.env.PORT || 8000


connectDB()
.then(() => {
  
  // app.listen(port, () => {
  //     console.log(`Server is Running on ${port}`);
  // })
  app.get('/', (req, res) => {
    res.send('Hello, Express and WebSocket on the same port!');
  });
  
  // Create an HTTP server and pass the Express app to it
  const server = http.createServer(app);
  
  // Create a WebSocket server and attach it to the HTTP server

  initWebSocketServer(server)
  
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
    
})
.catch((err) => {
    console.log("MongoDB connection Failed",err);
})


