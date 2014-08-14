http = require 'http'
configenv = require '../config/environment'

#log parameters
content_type = 'application/json; charset=utf-8'

module.exports = (data, callback) ->
    return false if typeof data != 'string'

    timestamp = +new Date()

    #log data
    log_data = {
        "headers" : data
        "body": "log-#{timestamp}"
    }

    #create post request
    post_request = http.request {
        host: configenv.flume.address,
        port: configenv.flume.port,
        headers: {
            'Content-Type': content_type
        }
    }, (response) ->
        callback response if typeof callback is 'function'

    #post log data
    post_request.write JSON.stringify(log_data)
    post_request.end()
