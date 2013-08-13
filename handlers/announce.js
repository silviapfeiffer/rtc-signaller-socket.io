/* jshint node: true */
'use strict';

/**
  ### announce handler
**/
module.exports = function(io, socket, data) {
  var payload = data.slice(data.indexOf('|') + 1);

  try {
    payload = JSON.parse(payload);
  }
  catch (e) {
    // invalid payload, prevent broadcast
    return true;
  }

  // attach the peer id to the socket
  socket.peerId = payload.id;
};