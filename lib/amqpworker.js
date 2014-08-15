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
      var doWork, ok, q;
      doWork = function(message) {
        var body, json_body, json_custom, key, secs, val;
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
        secs = body.split('.').length - 1;
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
