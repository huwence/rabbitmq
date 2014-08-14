amqp = require 'amqplib'
configenv = require '../config/environment'

exports.send = (message) ->
    amqp.connect configenv.amqp.address
        .then (conn) ->
            conn.createChannel().then (ch) ->
                q = 'mugeda_task'
                ok = ch.assertQueue q, {durable: true}

                ok.then () ->
                    ch.sendToQueue q, new Buffer(message), {deliveryMode: true}
                    ch.close()
