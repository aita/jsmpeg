var jsmpeg = require('../jsmpeg/jsmpeg.js');

var Player = module.exports = function(options) {
  this.el = document.createElement('div');
  this.options = options || {};
  if (typeof this.options.autoplay === 'undefined') {
    this.options.autoplay = 'scroll';
  }
  if (typeof this.options.preload === 'undefined') {
    this.preload = 1;
  }
  this.videoInfo = null;

  // 子要素のDOM
  this.player = null;
  this.video = null;
  this.endcard = null;
  this.ctrl = null;
  this.replayButton = null;
};

Player.prototype.open = function() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = (function() {
    if (request.readyState == request.DONE && request.status == 200) {
      this.videoInfo = JSON.parse(request.response);
      this.render();
    }
  }).bind(this);

  request.open('GET', this.options.src);
  request.send();
};

Player.prototype.getVideoURL = function() {
  return this.videoInfo.url.map((function(url){
    if (/^(https?:)?\/\//.test(url)) {
        return url;
    } else {
      var baseURL = this.options.src.split('/').slice(0, -1).join('/');
      return baseURL !== '' ? baseURL + '/' + url : url;
    }
  }).bind(this));
};

Player.prototype.render = function() {
  this.el.style.position = 'relative';
  this.el.style.margin = 0;

  // 子要素の初期化
  this.addPlayer();
  if (this.options.mp4) {
    this.addVideo();  // FullScreen用のvideoタグ
  }
  // 要素のサイズの設定
  this.el.style.width = this.getWidth() + 'px';
  this.el.style.height = this.getHeight() + 'px';

  // イベントの初期化
  this.initEvents();

  // 未表示なら表示する
  if (this.el.style.display === 'none') {
    this.el.style.display = '';
  }
};

Player.prototype.addPlayer = function() {
  // jsmpegの初期化
  this.player = new jsmpeg(this.getVideoURL(), {
    repeat: false,
    autoplay: this.options.autoplay,
    preload: this.options.preload,
    preloadTimeout: this.options.preloadTimeout
  });
  this.player.canvas.style.zIndex = 10;
  this.player.canvas.style.position = 'relative';
  this.player.canvas.width = this.getWidth();
  this.player.canvas.height = this.getHeight();
  this.el.appendChild(this.player.el);
};

Player.prototype.addVideo = function() {
  this.video = document.createElement('video');
  this.video.src = this.options.mp4;
  this.video.preload = 'none';
  // スタイルの設定
  this.video.style.zIndex = 1;
  this.video.style.opacity = 0;
  // jsmpegのcanvasと重ねて表示する
  this.video.style.position = 'fixed';
  this.video.width = this.getWidth();
  this.video.height = this.getHeight();
  this.video.style.top = 0;
  this.video.style.left = 0;
  this.el.appendChild(this.video);
};

Player.prototype.initEvents = function() {
  // jsmpegのイベントの初期化
  this.player.el.addEventListener('click', this.onClick.bind(this));
  this.player.on('ended', this.showEndcard.bind(this));
  this.player.on('preloadTimeout', this.onTimeout.bind(this));

  // フルスクリーン用の動画が設定されている場合は、クリック時にフルスクリーン再生にする。
  if (this.options.mp4) {
    // videoタグのイベントの初期化
    // 再生開始時
    this.video.addEventListener('play', (function() {
      this.player.pause();
    }).bind(this));
    // 再生停止時
    this.video.addEventListener('pause', (function() {
      this.player.play();
    }).bind(this));
    // 再生終了時
    this.video.addEventListener('ended', (function() {
      this.cancelFullScreen();
      this.showEndcard();
    }).bind(this));

    // Fullscreenから戻った時のコールバックを設定
    var prefix = ['webkit', 'moz', 'ms', ''];
    for (var i = 0; i < prefix.length; i++) {
      var ev = prefix[i] + 'fullscreenchange';
      document.addEventListener(ev, this.onFullScreenChange.bind(this), false);
    }
  }
};

Player.prototype.onTimeout = function() {
  this.showEndcard();
};

Player.prototype.onClick = function(ev) {
  if (this.player.playing) {
      this.fullscreen();
  } else {
    this.player.play();
  }
  return ev.preventDefault();
};

Player.prototype.requestFullScreen = function() {
  if (this.video.requestFullScreen) {
    this.video.requestFullScreen();
  } else if (this.video.webkitRequestFullScreen) {
    this.video.webkitRequestFullScreen();
  } else if (this.video.webkitEnterFullscreen) {
    this.video.webkitEnterFullscreen();
  }
};

Player.prototype.cancelFullScreen = function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

Player.prototype.fullscreen = function() {
  if (this.options.mp4) {
    // jsmpegでの再生を停止
    this.player.pause();
    // videoタグの表示
    this.player.el.style.display = "none";
    this.video.style.opacity = "1.0";
    // videoタグの再生開始
    this.requestFullScreen();
    this.video.play();
    return true;
  }
  return false;
};

Player.prototype.onFullScreenChange = function() {
  var fullscreenElementAPI = [
    'webkitFullscreenElement',
    'mozFullscreenElement',
    'msFullscreenElement',
    'fullscreenElement'
  ];
  var isFullScreen = false;
  for (var i = 0; i < fullscreenElementAPI.length; i++) {
    var prop = fullscreenElementAPI[i];
    if (document[prop] && document[prop] !== null) {
      isFullScreen = true;
      break;
    }
  }

  if (isFullScreen) {
    // フルスクリーンが有効になる場合
    this.player.pause();
  } else {
    // フルスクリーンが無効になる場合
    this.player.el.style.display = "";
    this.video.style.opacity = 0;
    this.video.pause();
    this.player.play();
  }
};

Player.prototype.getWidth = function() {
  return this.options.width || this.player.el.width;
}

Player.prototype.getHeight = function() {
  return this.options.height || this.player.el.height;
}

Player.prototype.showEndcard = function() {
  // 動画を非表示にする
  this.player.el.style.display = 'none';
  this.video.style.display = 'none';
  // エンドカードの表示
  this.addEndcard();

  // イベントの初期化
  this.replayButton.addEventListener('click', this.replay.bind(this));
};

Player.prototype.addEndcard = function() {
  this.endcard = new Image;
  this.endcard.src = this.options.endcard;
  this.endcard.width = this.getWidth();
  this.endcard.height = this.getHeight();
  this.el.appendChild(this.endcard);

  // コントロールバーの追加
  this.addCtrl();
};

Player.prototype.removeEndcard = function() {
  this.el.removeChild(this.endcard);
  this.el.removeChild(this.ctrl);
}

Player.prototype.addCtrl = function() {
  this.ctrl = document.createElement('div');
  this.ctrl.style.zIndex = 100;
  this.ctrl.style.position = 'absolute';
  this.ctrl.style.width = '100%';
  this.ctrl.style.height = '40px';
  this.ctrl.style.bottom = 0;
  this.ctrl.style.left = 0;
  this.ctrl.style.opacity = 0.7;
  this.ctrl.style.background = '#000';
  this.el.appendChild(this.ctrl);

  // リプレイボタンの追加
  this.replayButton = document.createElement('button');
  this.replayButton.innerHTML = 'Replay';
  this.replayButton.style.height = '30px';
  this.replayButton.style.padding = '5px';
  this.replayButton.style.margin = '5px 8px';
  this.ctrl.appendChild(this.replayButton);
};

Player.prototype.replay = function() {
  // 動画を表示
  this.player.el.style.display = '';
  this.video.style.display = '';

  // エンドカードの削除
  this.removeEndcard();

  if (typeof this.options.replayInline !== 'undefined') {
    this.player.play();
  } else {
    this.video.currentTime = 0;
    this.fullscreen();
  }
};
