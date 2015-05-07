var ScrollWatcher = function() {
  this.interval = 500;
  this.players = [];

  this.intervalID = null;
};

ScrollWatcher.prototype.add = function(player) {
  this.players.push(player);
  this.testBoundingRect(player);

  if (!this.intervalID) {
    this.intervalID = setInterval(this.watch.bind(this), this.interval);
  }
};

ScrollWatcher.prototype.remove = function(player) {
  this.players.remove(player);

  if (this.players.length < 1) {
    cancelInterval(this.intervalID);
    this.intervalID = null;
  }
};

ScrollWatcher.prototype.testBoundingRect = function(player) {
  var rect = player.el.getBoundingClientRect();
  if (0 <= rect.top && rect.bottom <= window.innerHeight) {
    if (!player.__shown) {
      player.emit('show');
      player.__shown = true;
    }
  } else {
    if (player.__shown) {
      player.emit('unshow');
      player.__shown = false;
    }
  }
};

ScrollWatcher.prototype.watch = function() {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    this.testBoundingRect(player);
  }
};

module.exports = new ScrollWatcher();
