const WebSocketServer = require('rpc-websockets').Server;

// Start the bootstrap server
const port = process.argv[2] || 8080;
const server = new WebSocketServer({
  port: parseInt(port, 10),
  host: 'localhost'
});

// List of known peers
let knownPeers = [];

// Add peer utility
const addPeer = (peer) => {
  if (!knownPeers.includes(peer)) {
    knownPeers.push(peer);
    // Notify all connected peers about the new peer
    server.emit('newPeerJoined', peer);
  }
};

// Register RPC method to get known peers
server.register('getPeers', () => knownPeers);

// Register RPC method to add a peer
server.register('addPeer', (params) => {
  const peer = params[0];
  if (peer) {
    addPeer(peer);
    return `Peer ${peer} added successfully.`;
  } else {
    throw new Error('Invalid peer address.');
  }
});

// Handle new connections
server.on('connection', (socket) => {
  const peerAddress = `ws://${socket._socket.remoteAddress}:${socket._socket.remotePort}`;
  console.log(`New connection from ${peerAddress}`);
  addPeer(peerAddress);
});

console.log(`Bootstrap server is running on ws://localhost:${port}`);
