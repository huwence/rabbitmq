(function() {
  var amqp, configenv;

  amqp = require('amqplib');

  configenv = require('../config/environment');

  exports.emit = function(message) {
    return amqp.connect(configenv.amqp.address).then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ex, ok;
        ex = 'mugeda_logs';
        ok = ch.assertExchange(ex, 'fanout', {
          durable: true
        });
        return ok.then(function() {
          ch.publish(ex, '', new Buffer(message));
          return ch.close();
        });
      });
    });
  };

}).call(this);
