amqp = require 'amqplib'
configenv = require '../config/environment'

exports.send = (message, callback) ->
    return false if typeof callback != 'function'
    amqp.connect configenv.amqp.address
        .then (conn) ->
            conn.createChannel().then (ch) ->
                q = 'mugeda_task'
                ok = ch.assertQueue q, {durable: true}

                ok.then () ->
                    try
                        ch.sendToQueue q, new Buffer(message), {deliveryMode: true}
                        callback {status: 0, error: 'OK'}
                    catch error
                        callback {status: 1, error: error}

                    ch.close()
