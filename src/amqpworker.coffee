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
                secs = body.split('.').length - 1
                flumelog body

                #acknowledge message
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
