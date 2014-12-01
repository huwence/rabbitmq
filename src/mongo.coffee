client = require('mongodb').MongoClient

exports.insert = (data, callback) ->
    client.connect('mongodb://10.171.237.164:27017/test', (error, db) ->
    #client.connect('mongodb://127.0.0.1:27017/test', (error, db) ->
        collection = db.collection('flume')

        collection.insert(data, (error, result) ->
            callback(result) if typeof callback is 'function'
        )
    )
