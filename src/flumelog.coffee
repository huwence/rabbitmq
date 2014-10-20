http = require 'http'
configenv = require '../config/environment'
base64_util = require './base64_util'
query_parse = require './query_parse'
date_parse = require './date_parse'

#log parameters
content_type = 'application/json; charset=UTF-8'

#handle data from client, include adding time, decode custom date, decode path
handleData = (data) ->
	#adding time label
	data.time = date_parse.getdate()

	#decode path
	if data.msp
		paths = query_parse(decodeURIComponent(data.msp))
		data[key] = val for key, val of paths if paths
		delete data.msp
	
	#decode custom
	if data.custom
		custom = query_parse(base64_util.decode(data.custom))
		data[key] = val for key, val of custom
		delete data.custom

module.exports = (data, callback) ->
	handleData(data)
	
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
