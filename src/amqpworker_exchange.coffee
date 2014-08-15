amqp = require 'amqplib'
flumelog = require './flumelog'
configenv = require '../config/environment'
base64_util = require './base64_util'
query_parse = require './query_parse'

amqp.connect configenv.amqp.address
    .then (conn) ->
        process.once 'SIGINT', () ->
            conn.close()

        conn.createChannel().then (ch) ->
            doWork  = (message) ->
                body = message.content.toString()
                json_body = JSON.parse body
                json_custom = query_parse(base64_util.decode(json_body.custom, true))
                json_body[key] = val for key, val of json_body if json_body.custom

                flumelog json_body

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
