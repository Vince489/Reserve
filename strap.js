const WebSocket = require('rpc-websockets').Client;

// List of bootstrap servers to connect to
const bootstrapServers = [
  'ws://localhost:8080',
  'ws://localhost:8081',
  'ws://localhost:8082'
];

// Connect to each bootstrap server
bootstrapServers.forEach((serverUrl) => {
  const ws = new WebSocket(serverUrl);

  ws.on('open', async function() {
    console.log(`Connected to ${serverUrl}`);

    try {
      // Request the list of known peers
      const peers = await ws.call('getPeers');
      console.log(`Known peers from ${serverUrl}:`, peers);

      // Add this peer to the bootstrap server
      const response = await ws.call('addPeer', [`ws://${ws.socket._socket.localAddress}:${ws.socket._socket.localPort}`]);
      console.log(`Response from ${serverUrl} when adding peer:`, response);

    } catch (error) {
      console.error(`Error communicating with ${serverUrl}:`, error);
    }

    // Listen for new peer events
    ws.on('newPeerJoined', function(peer) {
      console.log(`New peer joined on ${serverUrl}:`, peer);
    });
  });

  ws.on('close', function() {
    console.log(`Connection to ${serverUrl} closed`);
  });

  ws.on('error', function(error) {
    console.error(`Error with ${serverUrl}:`, error);
  });
});
