(function() {
  var amqp, configenv, flumelog;

  amqp = require('amqplib');

  flumelog = require('./flumelog');

  configenv = require('../config/environment');

  amqp.connect(configenv.amqp.address).then(function(conn) {
    process.once('SIGINT', function() {
      return conn.close();
    });
    return conn.createChannel().then(function(ch) {
      var doWork, ok, q;
      doWork = function(message) {
        var body;
        body = message.content.toString();
        flumelog(body);
        return setTimeout(function() {
          return ch.ack(message);
        }, 1000);
      };
      q = 'mugeda_task';
      ok = ch.assertQueue(q, {
        durable: true
      });
      ok = ok.then(function() {
        return ch.prefetch(1);
      });
      return ok = ok.then(function() {
        return ch.consume(q, doWork, {
          noAck: false
        });
      });
    });
  });

}).call(this);
