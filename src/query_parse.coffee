url = require 'url'

#return object from http querys
module.exports = (query) ->
    query = if '?' is query[0] then query else '?' + query
    url_parts = url.parse query, true
    url_parts.query
