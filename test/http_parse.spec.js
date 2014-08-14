var query_parse = require('../lib/query_parse')
var assert = require('assert')

describe('query_parse', function () {

    it('should return query object from query string', function () {
        var query = 'fromTo=木疙瘩&content=这是是什么&to=纽约'
        var query_object = query_parse(query)

        assert.deepEqual(query_object, {
            'fromTo': '木疙瘩',
            'content': '这是是什么',
            'to': '纽约'
        })
    })

    it('should return query object from query string', function () {
        var query = '?fromTo=木疙瘩&content=这是是什么&to=纽约'
        var query_object = query_parse(query)

        assert.deepEqual(query_object, {
            'fromTo': '木疙瘩',
            'content': '这是是什么',
            'to': '纽约'
        })
    })

    it('should return query object from query string', function () {
        var query = '?http://mugeda.com/fromTo=木疙瘩&content=这是是什么&to=纽约'
        var query_object = query_parse(query)

        assert.deepEqual(query_object, {
            'http://mugeda.com/fromTo': '木疙瘩',
            'content': '这是是什么',
            'to': '纽约'
        })
    })

    it('should return empty object from empty string', function () {
        var query = ''
        var query_object = query_parse(query)

        assert.deepEqual(query_object, {})
    })

})
