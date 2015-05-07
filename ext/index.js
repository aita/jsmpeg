var Player = require('./Player.js');

function openPlayer(el, options) {
  var player = new Player(options);
  el.appendChild(player.el);
  player.open();
}

var current = document.scripts[document.scripts.length-1];
if (current.previousElementSibling) {
  var el = current.previousElementSibling;
  openPlayer(el, {
    src: el.dataset.src,
    mp4: el.dataset.mp4,
    endcard: el.dataset.endcard,
    width: el.dataset.width,
    height: el.dataset.height
  });
}
