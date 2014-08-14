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
      var doWork, ex, ok;
      doWork = function(message) {
        var body;
        body = message.content.toString();
        flumelog(JSON.parse(body));
        return setTimeout(function() {
          return ch.ack(message);
        }, 1000);
      };
      ex = 'mugeda_logs';
      ok = ch.assertExchange(ex, 'fanout', {
        durable: true
      });
      ok = ok.then(function() {
        return ch.assertQueue('', {
          exclusive: true
        });
      });
      ok = ok.then(function(qok) {
        return ch.bindQueue(qok.queue, ex, '').then(function() {
          return qok.queue;
        });
      });
      return ok = ok.then(function(queue) {
        return ch.consume(queue, doWork, {
          noAck: true
        });
      });
    });
  });

}).call(this);
