var app = require('../lib/app')
var assert = require('assert')

describe('app', function () {
    describe('#get_action()', function () {
        var aInstance = new app()

        it('should get `stats_c` action', function (){
            var action = aInstance.get_action('/stats/c.gif')

            assert.equal(action, 'stats_c')
        })

        it('should get `stats_g` action', function (){
            var action = aInstance.get_action('/stats/g.gif')

            assert.equal(action, 'stats_g')
        })

        it('should get `stats_i` action', function (){
            var action = aInstance.get_action('/stats/i.gif')

            assert.equal(action, 'stats_i')
        })

        it('should get any action', function (){
            var action = aInstance.get_action('/stats/abcdefg.gif')

            assert.equal(action, false)
        })

        it('should get any action', function (){
            var action = aInstance.get_action('/abcdefg/g.gif')

            assert.equal(action, false)
        })

    })
})
