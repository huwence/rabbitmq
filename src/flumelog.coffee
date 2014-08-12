http = require 'http'

#log parameters
host = '172.16.0.12'
port = '8087'
content_type = 'application/json; charset=utf-8'

module.exports = (data) ->
    timestamp = +new Date()

    #log data
    log_data = [
        "headers" : data
        "body": "log-#{timestamp}"
    ]

    #create post request
    post_request = http.request {
        host: host,
        port: port,
        headers: {
            'Content-Type': content_type
        }
    }, (response) ->
        response.on('data', (result)->
            #TODO
        )

    #post log data
    post_request.write(JSON.stringify(log_data))
    post_request.end()
