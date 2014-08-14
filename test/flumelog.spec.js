var flumelog = require('../lib/flumelog')
var http = require('http')
var assert = require('assert')

describe('flumelog', function () {
    var _request

    before(function () {
        _request = http.request
        http.request = function (param, callback) {
            process.nextTick(function () {
                callback({
                    on: function (type, cb) {
                        cb('data')
                    }
                })   
            })

            return {
                'write': function () {
                    //pass
                },
                'end': function () {
                    //pass
                }
            }
        }
    })

    it('should triggle callback function', function () {
        flumelog('{"mugeda_stats":"test"}', function (response) {
            assert.equal(response, 'data')
        })
    })

    after(function () {
        http.request = _request;
    })
})
