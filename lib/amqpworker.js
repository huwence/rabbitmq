(function() {
  var amqp, base64_util, configenv, flumelog;

  amqp = require('amqplib');

  flumelog = require('./flumelog');

  configenv = require('../config/environment');

  base64_util = require('./base64_util');

  amqp.connect(configenv.amqp.address).then(function(conn) {
    process.once('SIGINT', function() {
      return conn.close();
    });
    return conn.createChannel().then(function(ch) {
      var doWork, ok, q;
      doWork = function(message) {
        var body, json_body, secs;
        body = message.content.toString();
        secs = body.split('.').length - 1;
        json_body = JSON.parse(body);
        flumelog(JSON.parse(body));
        return setTimeout(function() {
          return ch.ack(message);
        }, secs * 1000);
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
