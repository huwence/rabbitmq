http = require 'http'
url = require 'url'
flumelog = require './flumelog'

class App
    #listen port
    @port = 8088

    server: (request, response) ->
        ip = @get_ip(request)
        url = request.url
        url_parts = url.parse url, true

        @handler_route(url_parts.pathname, url_parts.query)
        end_write response

    run: () ->
        http.createSever @server
            .listen @port

        console.log 'app start ...'

    get_ip: (request) ->
        return request.headers['x-forwarder-for'] or
            request.connection.remoteAddress or
            request.socket.remoteAddress or
            request.connection.socket.remoteAddress

    handler_route: (path, query)->
        @error() if Object.prototype.toString.call query is not '[object Object]'
        #use gif image to handle request
        action = @get_action(path)
        @error() if !action

        #exec method
        method.call @, query

    get_action: (path) ->
        rpath = /^\/(\w+)\/(\w+)\.gif$/
        matches = rpath.exec path
        action = if matches then matches[1] + '_' + matches[2] else false
        action = if typeof @[action] is 'function' then action else false

    #card statistics
    stats_c: (query) ->
        query.type = 'card'
        flumelog query

    #game statistics
    stats_g: (query) ->
        query.type = 'game'
        flumelog query

    #invite card statistics
    stats_i: (query) ->
        query.type = 'invite'
        flumelog query

    error: () ->
        throw 'request error, please check request url'

    end_write: (response) ->
        #1x1 gif
        buf = new Buffer(35)
        buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64")
        response.writeHead 200, {'Content-Type': 'image/gif'}
        response.end buf

module.exports = App
