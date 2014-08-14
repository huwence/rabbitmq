(function() {
  var App, amqptask, app, http, url;

  http = require('http');

  url = require('url');

  amqptask = require('./amqptask_exchange');

  App = (function() {
    function App() {}

    App.port = 8088;

    App.prototype.server = function(request, response) {
      var ip, url_parts;
      ip = this.get_ip(request);
      url = request.url;
      url_parts = url.parse(url, true);
      url_parts.query.ip = ip;
      this.handler_route(url_parts.pathname, url_parts.query);
      return end_write(response);
    };

    App.prototype.run = function() {
      http.createServer(this.server).listen(this.port);
      return console.log('app start ...');
    };

    App.prototype.get_ip = function(request) {
      return request.headers['x-forwarder-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    };

    App.prototype.handler_route = function(path, query) {
      var action;
      if (Object.prototype.toString.call(query === !'[object Object]')) {
        this.error();
      }
      action = this.get_action(path);
      if (!action) {
        this.error();
      }
      return method.call(this, query);
    };

    App.prototype.get_action = function(path) {
      var action, matches, rpath;
      rpath = /^\/(\w+)\/(\w+)\.gif$/;
      matches = rpath.exec(path);
      action = matches ? matches[1] + '_' + matches[2] : false;
      return action = typeof this[action] === 'function' ? action : false;
    };

    App.prototype.stats_c = function(query) {
      query.type = 'card';
      return amqptask.emit(JSON.stringify(query));
    };

    App.prototype.stats_g = function(query) {
      query.type = 'game';
      return amqptask.emit(JSON.stringify(query));
    };

    App.prototype.stats_i = function(query) {
      query.type = 'invite';
      return amqptask.emit(JSON.stringify(query));
    };

    App.prototype.error = function() {
      throw 'request error, please check request url';
    };

    App.prototype.end_write = function(response) {
      var buf;
      buf = new Buffer(35);
      buf.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
      response.writeHead(200, {
        'Content-Type': 'image/gif'
      });
      return response.end(buf);
    };

    return App;

  })();

  app = new App();

  app.run();

  module.exports = App;

}).call(this);
