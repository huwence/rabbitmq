var date_parse = require('../lib/date_parse')
var assert = require('assert')

describe('date_parse', function () {

    it('should return complete zero', function () {
		var num = 8
		var znum = date_parse.addZero(num, 2)

        assert.equal('08', znum)
    })

    it('should return complete zero', function () {
		var num = 8
		var znum = date_parse.addZero(num, 5)

        assert.equal('00008', znum)
    })

    it('should return format date' , function () {
		var date = date_parse.getdate('Y-m-d', new Date('2014-09-25'))

		assert.equal('2014-09-25', date)
    })

    it('should return format date', function () {
		var t = '2014-09-12 10:09:35'
		var date = date_parse.getdate('Y-m-d H:i:s', new Date(t))

		assert.equal(t, date)
    })

	it('should return format date', function () {
		var t = '2014-09-12 10:09:35'
		var date1 = date_parse.getdate('Y/m/d', new Date(t))
		var date2 = date_parse.getdate('Y_m/d', new Date(t))
		var date3 = date_parse.getdate('Y_m/d:H:i-s----', new Date(t))
		var date4 = date_parse.getdate('H:i:s/Y/m/d', new Date(t))

		assert.equal('2014/09/12', date1)
		assert.equal('2014_09/12', date2)
		assert.equal('2014_09/12:10:09-35----', date3)
		assert.equal('10:09:35/2014/09/12', date4)
    })

})
