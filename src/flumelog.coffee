http = require 'http'
configenv = require '../config/environment'
base64_util = require './base64_util'
query_parse = require './query_parse'
date_parse = require './date_parse'
#mongo = require './mongo'

# log parameters
content_type = 'application/json; charset=UTF-8'

http.globalAgent.maxSockets = 10000

reservedFields = {
    'time': '__t'
    'date': '__d'
}

# handle data from client, include adding time, decode custom date, decode path
handleData = (data) ->
    #adding time label
    data.__time = date_parse.getdate('Y-m-dTH:i:s')
    data.msts = parseInt(data.msts, 10) if data.msts
    data.msetd = parseInt(data.msetd, 10) if data.msetd

    # decode path
    if data.msp
        try
            pathurl = decodeURIComponent(data.msp)
        catch error
            pathurl = unescape(data.msp)

        if pathurl
            query = pathurl.substring(pathurl.indexOf('?'))
            paths = query_parse(query)
            data[key] = val for key, val of paths if paths
            #delete data.msp
 
    # decode custom
    #if data.custom
    #    custom = query_parse(base64_util.decode(data.custom))
    #    if custom
    #        if !reservedFields[key] then data[key] = val else data[reservedFields[key]] = val for key, val of custom

        #delete data.custom

module.exports = (data, callback) ->
    handleData(data)
 
    log_data = [{
        "headers" : data
        "body": "log-#{data.__time}"
    }]

    # insert mongo data
    #mongo.insert(data)

    # create post request
    post_request = http.request {
        host: configenv.flume.address,
        port: configenv.flume.port,
        method: 'POST',
        headers: {
            'Content-Type': content_type
        }
    }, (response) ->
        callback response if typeof callback is 'function'
 
    post_request.on('error', (response) ->
        post_request.abort()
    )

    # post log data
    post_request.write JSON.stringify(log_data)
    post_request.end()
