var base64_util = require('../lib/base64_util')
var assert = require('assert')


describe('base64_util', function () {
    it('should get message from chinese string', function () {
        var str = '木疙瘩'
        var encode_str = base64_util.encode(str)
        var decode_str = base64_util.decode(encode_str)

        assert.equal(decode_str, str)
    })

    it('should get message from english string', function () {
        var str = 'mugeda' 
        var encode_str = base64_util.encode(str)
        var decode_str = base64_util.decode(encode_str)

        assert.equal(decode_str, str)
    })

    it('should get message from long string', function () {
        var str = 'formTo=木疙瘩&formGreetings=木疙瘩哦文件老人家了我客家人口巍峨进入了就巍峨快乐人巍峨家里人就完了人类巍峨加入口巍峨进入了口巍峨进入了渴望而就巍峨&formFrom=牧歌的 份额我人巍峨'
        var encode_str = 'Zm9ybVRvPeacqOeWmeeYqSZmb3JtR3JlZXRpbmdzPeacqOeWmeeYqeWTpuaWh%2BS7tuiAgeS6uuWutuS6huaIkeWuouWutuS6uuWPo%2BW3jeWzqOi%2Fm%2BWFpeS6huWwseW3jeWzqOW%2Fq%2BS5kOS6uuW3jeWzqOWutumHjOS6uuWwseWujOS6huS6uuexu%2BW3jeWzqOWKoOWFpeWPo%2BW3jeWzqOi%2Fm%2BWFpeS6huWPo%2BW3jeWzqOi%2Fm%2BWFpeS6hua4tOacm%2BiAjOWwseW3jeWzqCZmb3JtRnJvbT3niafmrYznmoQg5Lu96aKd5oiR5Lq65beN5bOo' 
        var decode_str = base64_util.decode(encode_str, true)

        assert.equal(decode_str, str)
    })

})
