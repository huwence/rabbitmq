(function() {
  var amqp, configenv;

  amqp = require('amqplib');

  configenv = require('../config/environment');

  exports.send = function(message) {
    return amqp.connect(configenv.amqp.address).then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ok, q;
        q = 'mugeda_task';
        ok = ch.assertQueue(q, {
          durable: true
        });
        return ok.then(function() {
          ch.sendToQueue(q, new Buffer(message), {
            deliveryMode: true
          });
          return ch.close();
        });
      });
    });
  };

}).call(this);
