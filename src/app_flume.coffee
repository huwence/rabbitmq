http = require 'http'
url = require 'url'
flumelog = require './flumelog'
cookieUtil = require './cookie_parse'

class App
    #listen port
    port = 8088

    server: (request, response) ->
        ip = @get_ip(request)
        agent = @get_agent(request)
        url_parts = url.parse request.url, true
        url_parts.query.ip = ip or ''
        url_parts.query.agent = agent or ''

        #@handle_cookie url_parts.query, request
        @handler_route url_parts.pathname, url_parts.query, response

    run: () ->
        self = @
        http.createServer (request, response) ->
            self.server(request, response)
        .listen port

        console.log 'app start ...'

    get_ip: (request) ->
        return request.headers['x-forwarded-for'] or
            request.connection.remoteAddress or
            request.socket.remoteAddress

    get_agent: (request) ->
        request.headers['user-agent']

    get_cookie: (request) ->
        request.headers.cookie

    handle_cookie: (query, request) ->
        # First find uid in query url, if not found in query, then get it in cookies, 
        # if also not found in cookie , we need to generate a new uid for current request
        @msuid = query.msuid

        if !@msuid
            cookies = cookieUtil.getCookie(@get_cookie(request))
            @msuid = cookies['msuid']
            @msuid = cookieUtil.genUID() if !@msuid

        query.msuid = @msuid

    handler_route: (path, query, response)->
        return @error(response) if Object.prototype.toString.call(query) != '[object Object]'
        # use gif image to handle request
        action = @get_action(path)
        return @error(response) if !action

        # exec method
        @[action].call @, query, response

    get_action: (path) ->
        rpath = /^\/(\w+)\/(\w+)\.gif$/
        matches = rpath.exec path
        action = if matches then matches[1] + '_' + matches[2] else false
        if typeof @[action] is 'function' then action else false

    #card statistics
    stats_c: (query, response) ->
        #category
        query.mscty = 'card'
        @emit_message query, response

    #game statistics
    stats_g: (query, response) ->
        query.mscty = 'game'
        @emit_message query, response

    #invite card statistics
    stats_i: (query, response) ->
        query.mscty = 'invite'
        @emit_message query, response

    error: (response) ->
        #return 404 not found error
        response.writeHead 404, {'Content-Type': 'text/plain'}
        response.write "404 Not Found^~^\n"
        response.end()

    emit_message: (message, response) ->
        self = @

        flumelog message, () ->
            self.end_write(response)

    end_write: (response) ->
        #1x1 gif
        buf = new Buffer(35)
        buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64")
        response.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': buf.length,
            'Cache-Control': 'private, no-cache, no-cache=Set-Cookie',
            'Pragma': 'no-cache'
        })
        response.end buf

app = new App()
app.run()

module.exports = App
