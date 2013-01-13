// global jQuery: true
//   microphone.js
//   Morteza Milani (mrtz.milani@googlemail.com)
//   https://github.com/milani/microphone.js
//   Published under MIT license

// this is the internal object used within swf
var Mic = {
  mics : [],
  push : function(object){
    this.mics[object.id] = object;
  },
  ready : function(id){
    this.mics[id].onReady();
  },
  status: function(id, event){
    this.mics[id].onStatus(event);
  },
  vad: function(id, event){
    this.mics[id].onVad(event);
  },
  event: function(id, event){
    this.mics[id].onEvent(event);
  },
  data : function(id, data, event){
    this.mics[id].onData(data, event);
  },
  end: function(id, data, event){
    this.mics[id].onEnd(data, event);
  },
  error : function(id, message){
    this.mics[id].onError(message);
  }
}

;(function($) {

  if (window.location.protocol === "file:") {
    throw new Error("Flash can't access microphone on " + window.location.protocol +" location. [" + window.location + "].");
  }

  $.microphone = function(el, options) {

    var init, plugin, defaults = {
      sampleRate : 8000,
      codec : 'pcmu',
      gain       : 50,
      swfPath    : 'microphone.swf',
      vad: {
        level: 10,
        timeout: 2000
      },
      debugging  : true
    };

    plugin = this;

    plugin.settings = {};

    init = function() {
      plugin.settings = $.extend({}, defaults, options);
      plugin.el = el;
      plugin.id = 'mic' + new Date().getTime();

      var args, swf, bridge; 
      swf = $('<object>').attr('id', plugin.id);
      swf.attr('type', 'application/x-shockwave-flash');
      swf.attr('data', plugin.settings.swfPath);
      swf.css({width:'215px', height: '138px'});
      
      args = "debugging=" + plugin.settings.debugging + "&";
      args += "gain=" + plugin.settings.gain + "&";
      args += "codec=" + plugin.settings.codec + "&";
      args += "id=" + plugin.id + "&";
      args += "silenceLevel=" + plugin.settings.vad.level + "&";
      args += "silenceTimeout=" + plugin.settings.vad.timeout;

      $(swf).append($('<param>').attr('name', 'movie').attr('value', plugin.settings.swfPath));
      $(swf).append($('<param>').attr('name', 'FlashVars').attr('value', args));

      $(el).append(swf);

      // swf bridge
      bridge = {id: plugin.id};
      
      bridge.onReady= function() {
        plugin.swf = document.getElementById(plugin.id);
        console.log('ready');
        $(plugin.el).trigger('ready');
      };
      bridge.onData = function (data, event){
        $(plugin.el).trigger('data', {timestamp: new Date().getTime(), sample: data, event: event});
      }; 
      bridge.onEnd = function (data, event){
        $(plugin.el).trigger('end', {timestamp: new Date().getTime(), sample: data, event: event});
      }; 
      bridge.onError= function(message) {
        $(plugin.el).trigger('error', message);
      };
      bridge.onStatus = function(event) {
        $(plugin.el).trigger('status', event);
      };
      bridge.onEvent = function(event) {
        $(plugin.el).trigger('event', event);
      };
      bridge.onVad= function(event) {
        $(plugin.el).trigger('vad', event);
      };
      
      Mic.push(bridge);
    };

    plugin.list = function() {
      return plugin.swf.getMicrophoneList();
    };
    plugin.start = function() {
      plugin.swf.start();
    };
    plugin.stop = function(){
      plugin.swf.stop();
    };
    plugin.echo = function(enabled){
      plugin.swf.enableLoopBack(enabled);
    };
    
    init();

  };
})(jQuery);
