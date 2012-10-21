// global jQuery: true
//   microphone.js
//   Morteza Milani (mrtz.milani@googlemail.com)
//   https://github.com/milani/microphone.js
//   Published under MIT license
//
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
  data : function(id, data){
    this.mics[id].onData(data);
  },
  error : function(id, message){
    this.mics[id].onError(message);
  }
}


;(function($) {

  $.microphone = function(el, options) {

    var init, plugin, defaults = {
      sampleRate : 16000,
      gain       : 50,
      swfPath    : 'microphone.swf',
      debugging  : true
    };

    plugin = this;

    plugin.settings = {};

    init = function() {
      plugin.settings = $.extend({}, defaults, options);
      plugin.el = el;
      plugin.id = 'mic' + new Date().getTime();

      // code goes here
      var args, swf; 
      swf = $('<object>').attr('id', plugin.id);
      swf.attr('type', 'application/x-shockwave-flash');
      swf.attr('data', plugin.settings.swfPath);
      swf.css({width:'215px', height: '138px'});
      
      args = "debugging=" + plugin.settings.debugging + "&";
      args += "rate=" + plugin.settings.sampleRate + "&";
      args += "id=" + plugin.id;

      $(swf).append($('<param>').attr('name', 'movie').attr('value', plugin.settings.swfPath));
      $(swf).append($('<param>').attr('name', 'FlashVars').attr('value', args));

      $(el).append(swf);


      // swf bridge
      var bridge = {id: plugin.id};
      
      bridge.onReady= function() {
        plugin.swf = document.getElementById(plugin.id);
        console.log('ready');
        $(plugin.el).trigger('ready');
      };
      bridge.onData = function (data){
        $(plugin.el).trigger('data', {timestamp: new Date().getTime(), sample: data});
      }; 
      bridge.onError= function(message) {
        $(plugin.el).trigger('error', message);
      };
      bridge.onStatus = function(event) {
        $(plugin.el).trigger('status', event);
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
