http = require 'http'
url = require 'url'
amqptask = require './amqptask'

class App
    #listen port
    port = 8088

    server: (request, response) ->
        ip = @get_ip request
        url_parts = url.parse request.url, true
        url_parts.query.ip = ip

        @handler_route url_parts.pathname, url_parts.query, response

    run: () ->
        self = @
        http.createServer (request, response) ->
                self.server(request, response)
            .listen port

        console.log 'app start ...'

    get_ip: (request) ->
        return request.headers['x-forwarder-for'] or
            request.connection.remoteAddress or
            request.socket.remoteAddress or
            request.connection.socket.remoteAddress

    handler_route: (path, query, response)->
        @error() if Object.prototype.toString.call query != '[object Object]'
        #use gif image to handle request
        action = @get_action(path)
        @error() if !action

        #exec method
        method.call @, query, response

    get_action: (path) ->
        rpath = /^\/(\w+)\/(\w+)\.gif$/
        matches = rpath.exec path
        action = if matches then matches[1] + '_' + matches[2] else false
        action = if typeof @[action] is 'function' then action else false

    #card statistics
    stats_c: (query, response) ->
        query.type = 'card'
        @emit_message JSON.stringify(query), response

    #game statistics
    stats_g: (query, response) ->
        query.type = 'game'
        @emit_message JSON.stringify(query), response

    #invite card statistics
    stats_i: (query, response) ->
        query.type = 'invite'
        @emit_message JSON.stringify(query), response

    error: () ->
        throw 'request error, please check request url'

    emit_message: (message, response) ->
        self = @

        amqptask.send message, (result) ->
            self.end_write(response) if 0 is result.status

    end_write: (response) ->
        #1x1 gif
        buf = new Buffer(35)
        buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64")
        response.writeHead 200, {'Content-Type': 'image/gif'}
        response.end buf

app = new App()
app.run()

module.exports = App
