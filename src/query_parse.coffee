url = require 'url'

#return object from http querys
module.exports = (query) ->
    try
        query = if '?' is query[0] then query else '?' + query
        url_parts = url.parse query, true
        query = url_parts.query
    catch error
        query = {}

    return query
