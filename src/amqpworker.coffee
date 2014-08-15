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

                if json_body.custom
                    json_custom = query_parse(base64_util.decode(json_body.custom, true))
                    json_body[key] = val for key, val of json_custom

                #emit to flume log
                flumelog json_body

                #acknowledge message
                secs = body.split('.').length - 1
                setTimeout () ->
                    ch.ack(message)
                , secs * 1000

            q = 'mugeda_task'
            ok = ch.assertQueue q, {durable: true}
            ok = ok.then () ->
                ch.prefetch 1
            ok = ok.then () ->
                #set message acknowledgment is false to make sure no message is lost
                ch.consume q, doWork, {noAck: false}
