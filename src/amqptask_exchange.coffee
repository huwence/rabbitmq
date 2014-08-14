amqp = require 'amqplib'
configenv = require '../config/environment'

exports.emit = (message) ->
    amqp.connect configenv.amqp.address
        .then (conn) ->
            conn.createChannel().then (ch) ->
                ex = 'mugeda_logs'
                ok = ch.assertExchange ex, 'fanout', {durable: true}

                ok.then () ->
                    ch.publish ex, '', new Buffer(message)
                    ch.close()
