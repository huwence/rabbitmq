amqp = require 'amqplib'
flumelog = require './flumelog'
configenv = require '../config/environment'

amqp.connect configenv.amqp.address
    .then (conn) ->
        process.once 'SIGINT', () ->
            conn.close()

        conn.createChannel().then (ch) ->
            doWork  = (message) ->
                body = message.content.toString()
                flumelog JSON.parse(body)

                setTimeout () ->
                    ch.ack(message)
                , 1000

            ex = 'mugeda_logs'
            ok = ch.assertExchange ex, 'fanout', {durable: true}
            ok = ok.then () ->
                ch.assertQueue '', {exclusive: true}

            ok = ok.then (qok) ->
                ch.bindQueue qok.queue, ex, ''
                  .then () ->
                      qok.queue

            ok = ok.then (queue) ->
                ch.consume queue, doWork, {noAck: true}
