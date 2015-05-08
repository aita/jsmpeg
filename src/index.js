var Player = require('./Player.js');

function clone(obj) {
  if(obj === null || typeof(obj) !== 'object') {
    return obj;
  }

  var temp = {};
  for(var key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      temp[key] = clone(obj[key]);
    }
  }
  return temp;
}

function openPlayer(el, options) {
  var player = new Player(options);
  el.appendChild(player.el);
  player.open();
}

var current = document.scripts[document.scripts.length-1];
if (current.previousElementSibling) {
  var el = current.previousElementSibling;
  openPlayer(el, clone(el.dataset));
}
