var ScrollWatcher = function() {
  this.interval = 500;
  this.watching = false;
  this.players = [];

  this.intervalID = null;
};

ScrollWatcher.prototype.add = function(player) {
  if (this.players.length < 1) {
    this.watching = true;
    this.intervalID = setInterval(this.watch.bind(this), this.interval);
  }
  this.players.push(player);
};

ScrollWatcher.prototype.remove = function(player) {
  this.players.remove(player);
  if (this.players.length < 1) {
    this.watching = false;
    cancelInterval(this.intervalID);
    this.intervalID = null;
  }
};

ScrollWatcher.prototype.watch = function() {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
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
  }
};

module.exports = new ScrollWatcher();
