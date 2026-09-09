import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Serve static assets from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('StreetByte Client connected via WebSocket');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Broadcast to all connected clients except sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      console.error('WS Error:', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🍢 StreetByte Server running at http://localhost:${port}`);
  console.log(`🔥 WebSocket server active for real-time order sync`);
});
