import WebSocket, { WebSocketServer } from 'ws';

import { formatTimeToHHMM } from '../utils/formatTime.js';

//* websocket connection 
const initWebSocketServer = (server) => {
const wss = new WebSocketServer({ server });
const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      
      clients.add(ws);
      const messageData = JSON.parse(message)
      const data = {
       message: messageData.message,
       username: messageData.userName,
        timeStamp: formatTimeToHHMM(Date.now()),
      }
//* distribute message to all broadcatert 
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });

    });
    //* closing the connection 
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  };
  
  export default initWebSocketServer;