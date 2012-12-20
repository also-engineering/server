var Config,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Config = (function(_super) {

  __extends(Config, _super);

  function Config() {
    Config.__super__.constructor.apply(this, arguments);
  }

  Config.prototype.url = "config";

  Config.prototype.save = null;

  Config.prototype.getDefault = function(key) {
    return this.get("defaults")[key];
  };

  return Config;

})(Backbone.Model);
