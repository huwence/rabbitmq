getCookie = (cookies) ->
    list = {}

    if cookies
        cookies = cookies.split ';'
        cookies.forEach((cookie) ->
            parts = cookie.split('=')
            list[parts.shift().trim()] = unescape(parts.join('='))
        )

    return list

genUID = () ->
    str = 'abcdefghigklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNXYZ-'
    time = Number(+new Date()).toString(36)
    ids = ''

    for i in [0..16]
        ids += str[Math.floor(Math.random() * str.length)]

    return ids + time

exports.getCookie = getCookie
exports.genUID = genUID
