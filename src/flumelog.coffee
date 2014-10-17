http = require 'http'
configenv = require '../config/environment'
base64_util = require './base64_util'
query_parse = require './query_parse'

#log parameters
content_type = 'application/json; charset=UTF-8'

module.exports = (data, callback) ->

	if data.custom
		custom = query_parse(base64_util.decode(data.custom))
		data[key] = val for key, val of data
		delete data.custom

    date = new Date()
	data.time = date.getFullYear() + 

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
		callback response if typeof callback is 'function'

    #post log data
    post_request.write JSON.stringify(log_data)
    post_request.end()
