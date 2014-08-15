(function() {
  var amqp, base64_util, configenv, flumelog, query_parse;

  amqp = require('amqplib');

  flumelog = require('./flumelog');

  configenv = require('../config/environment');

  base64_util = require('./base64_util');

  query_parse = require('./query_parse');

  amqp.connect(configenv.amqp.address).then(function(conn) {
    process.once('SIGINT', function() {
      return conn.close();
    });
    return conn.createChannel().then(function(ch) {
      var doWork, ex, ok;
      doWork = function(message) {
        var body, json_body, json_custom, key, val;
        body = message.content.toString();
        json_body = JSON.parse(body);
        json_custom = query_parse(base64_util.decode(json_body.custom, true));
        if (json_body.custom) {
          for (key in json_body) {
            val = json_body[key];
            json_body[key] = val;
          }
        }
        flumelog(json_body);
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
