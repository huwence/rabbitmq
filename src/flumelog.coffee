http = require 'http'
configenv = require '../config/environment'

#log parameters
content_type = 'application/json; charset=UTF-8'

module.exports = (data, callback) ->
    timestamp = +new Date()

    #log data
    log_data = [{
        "headers" : data
        "body": "log-#{timestamp}"
    }]

    #create post request
    post_request = http.request {
        host: configenv.flume.address,
        port: configenv.flume.port,
        method: 'POST',
        headers: {
            'Content-Type': content_type
        }
    }, (response) ->
        response.on('data', (result) ->
            callback result if typeof callback is 'function'
        )

    #post log data
    post_request.write JSON.stringify(log_data)
    post_request.end()
