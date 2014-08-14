exports.decode = (message, is_uri_encode) ->
    message = if is_uri_encode then decodeURIComponent message else message
    message = new Buffer(message, 'base64').toString 'utf8'


exports.encode = (message) ->
    new Buffer(message).toString 'base64'
