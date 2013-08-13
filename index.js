/* jshint node: true */
'use strict';

var debug = require('debug')('rtc-signaller-socket.io');
var handlers = {
  announce: require('./handlers/announce')
}

/**
  # rtc-signaller-socket.io

  This is a simple server side helper for working with socket.io
**/
module.exports = function(io) {

  return function(socket) {

    function handleMessage(data) {
      var handler;
      var preventBroadcast = false;

      // if we have string data then preprocess
      if (typeof data == 'string' || (data instanceof String)) {
        if (data.charAt(0) === '/') {
          handler = handlers[data.slice(1, data.indexOf('|', 1))];
        }
      }

      // if we have a handler, the invoke
      if (typeof handler == 'function') {
        preventBroadcast = handler(io, socket, data);
      }

      // if the message has not been handled, then 
      // otherwise, just broadcast
      if (! preventBroadcast) {
        socket.broadcast.send(data);
      }
    }

    function handleDisconnect() {
      if (socket.peerId) {
        io.sockets.send('/leave:' + socket.peerId);
      }
    }

    socket.on('message', handleMessage);
    socket.on('disconnect', handleDisconnect);
  };
}; 