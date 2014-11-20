(function() {
  var App, app, cookieUtil, flumelog, http, url;

  http = require('http');

  url = require('url');

  flumelog = require('./flumelog');

  cookieUtil = require('./cookie_parse');

  App = (function() {
    var port;

    function App() {}

    port = 8088;

    App.prototype.server = function(request, response) {
      var agent, ip, url_parts;
      ip = this.get_ip(request);
      agent = this.get_agent(request);
      url_parts = url.parse(request.url, true);
      url_parts.query.ip = ip || '';
      url_parts.query.agent = agent || '';
      return this.handler_route(url_parts.pathname, url_parts.query, response);
    };

    App.prototype.run = function() {
      var self;
      self = this;
      http.createServer(function(request, response) {
        return self.server(request, response);
      }).listen(port);
      return console.log('app start ...');
    };

    App.prototype.get_ip = function(request) {
      return request.headers['x-forwarder-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    };

    App.prototype.get_agent = function(request) {
      return request.headers['user-agent'];
    };

    App.prototype.get_cookie = function(request) {
      return request.headers.cookie;
    };

    App.prototype.handle_cookie = function(query, request) {
      var cookies;
      this.msuid = query.msuid;
      if (!this.msuid) {
        cookies = cookieUtil.getCookie(this.get_cookie(request));
        this.msuid = cookies['msuid'];
        if (!this.msuid) {
          this.msuid = cookieUtil.genUID();
        }
      }
      return query.msuid = this.msuid;
    };

    App.prototype.handler_route = function(path, query, response) {
      var action;
      if (Object.prototype.toString.call(query) !== '[object Object]') {
        return this.error(response);
      }
      action = this.get_action(path);
      if (!action) {
        return this.error(response);
      }
      return this[action].call(this, query, response);
    };

    App.prototype.get_action = function(path) {
      var action, matches, rpath;
      rpath = /^\/(\w+)\/(\w+)\.gif$/;
      matches = rpath.exec(path);
      action = matches ? matches[1] + '_' + matches[2] : false;
      if (typeof this[action] === 'function') {
        return action;
      } else {
        return false;
      }
    };

    App.prototype.stats_c = function(query, response) {
      query.mscty = 'card';
      return this.emit_message(query, response);
    };

    App.prototype.stats_g = function(query, response) {
      query.mscty = 'game';
      return this.emit_message(query, response);
    };

    App.prototype.stats_i = function(query, response) {
      query.mscty = 'invite';
      return this.emit_message(query, response);
    };

    App.prototype.error = function(response) {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.write("404 Not Found^~^\n");
      return response.end();
    };

    App.prototype.emit_message = function(message, response) {
      var self;
      self = this;
      return flumelog(message, function() {
        return self.end_write(response);
      });
    };

    App.prototype.end_write = function(response) {
      var buf;
      buf = new Buffer(35);
      buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
      response.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': buf.length,
        'Cache-Control': 'private, no-cache, no-cache=Set-Cookie',
        'Pragma': 'no-cache'
      });
      return response.end(buf);
    };

    return App;

  })();

  app = new App();

  app.run();

  module.exports = App;

}).call(this);
