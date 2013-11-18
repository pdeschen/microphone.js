/*
   microphone.as
   Morteza Milani (mrtz.milani@googlemail.com)
https://github.com/milani/microphone.js
Published under MIT license
 */
package {
  import flash.display.Sprite;
  import flash.text.TextField;
  import flash.media.Microphone;
  import flash.media.SoundCodec;
  import flash.events.StatusEvent;
  import flash.events.ActivityEvent;
  import flash.events.SampleDataEvent;
  import flash.external.ExternalInterface;
  import flash.system.Security;
  import flash.system.SecurityPanel;
  import flash.system.Capabilities;

  public class microphone extends Sprite {

    private var mic:Microphone    = null;
    private var MAX_BUFFER_SIZE:Number = 4096;
    private var debugging:Boolean = false;
    private var JSObject:String   = "jQuery.microphone.Bridges";
    private var id:String = null;
    private var silenceLevel:Number = 50;
    private var silenceTimeout:Number = 2000;
    private var gain:Number = 50;
    private var buffer_size:Number = MAX_BUFFER_SIZE;
    private var codec:String= SoundCodec.PCMU;
    private var buffer:Array = new Array();

    public function microphone() {

      var flashPlayerVersion:String = Capabilities.version;
      var osArray:Array = flashPlayerVersion.split(' ');
      var versionArray:Array = osArray[1].split(',');
      var majorVersion:Number = parseInt(versionArray[0]);
      var majorRevision:Number = parseInt(versionArray[1])/10;

      var options:Object = this.loaderInfo.parameters;

      debugging = options.debugging  || debugging;
      JSObject  = options.objectName || JSObject;
      silenceLevel = options.silenceLevel || silenceLevel;
      silenceTimeout = options.silenceTimeout || silenceTimeout;
      codec = options.codec || codec;
      gain = options.gain || gain;
      buffer_size = options.buffer_size || MAX_BUFFER_SIZE;
      // what happens when no id is provided? Events can't be dispatched
      id = options.id;

      log(options);

      if(majorVersion + majorRevision < 10.1){
        error("Flash Player 10.1 or above is required.");
        return;
      }

      Security.showSettings(SecurityPanel.DEFAULT);

      mic = Microphone.getMicrophone();

      if ( null != mic ) {
        mic.addEventListener(StatusEvent.STATUS, statusHandler);
        mic.addEventListener(ActivityEvent.ACTIVITY, activityHandler);
        mic.codec = codec;
        mic.enableVAD = true;
        mic.setSilenceLevel(silenceLevel, silenceTimeout);
        mic.setUseEchoSuppression(false);
        mic.setLoopBack(false);
        mic.gain = gain;
        mic.rate = 8;

        ExternalInterface.addCallback("setMic", setMic);
        ExternalInterface.addCallback("getMicrophoneList", getMicrophoneList);
        ExternalInterface.addCallback("getName", getName);
        ExternalInterface.addCallback("setQuality", setQuality);
        ExternalInterface.addCallback("setGain", setGain);
        ExternalInterface.addCallback("setRate", setRate);
        ExternalInterface.addCallback("getRate", getRate);
        ExternalInterface.addCallback("start", start);
        ExternalInterface.addCallback("stop", stop);

      } else if (Microphone.isSupported === false) {
        error("Microphone usage is not supported.");
      } else {
        error("No microphone detected.");
      }
      ExternalInterface.call(JSObject + '.ready', id);
    };

    public function start():void {
      log('ready.');
      buffer = new Array();
      mic.addEventListener(SampleDataEvent.SAMPLE_DATA,streamHandler);
    };

    public function stop():void {
      log('stopped.');
      // dispatch remaining buffer
      // could we have accumulated buffer > buffer_size at this point?
      log('dispatching remaining buffer of size ' + buffer.length + ".");
      ExternalInterface.call(JSObject + '.end', id, buffer);
      mic.removeEventListener(SampleDataEvent.SAMPLE_DATA,streamHandler);
    };

    public function streamHandler(event:SampleDataEvent):void {
      log('sending activity level event.');
      ExternalInterface.call(JSObject + '.activity', id, event.currentTarget);
      log('accumulating received data.');
      // accumulate stream
      while(event.data.bytesAvailable){
        buffer.push(event.data.readFloat());
      }
      // only dispatch if we have reached max buffer size. Remaining will be
      // pertained and dispatched on next event handling or upon stop
      if (buffer.length >= buffer_size ) {
        log('dispatching buffer of size ' + buffer_size + ".");
        ExternalInterface.call(JSObject + '.data', id, buffer.splice(0, buffer_size));
      }
    };

    public function setQuality(quality:Number):void {
      mic.encodeQuality = quality;
    };

    public function setGain(gain:Number):void {
      mic.gain = gain;
    };

    public function setRate(rate:Number):void {
      mic.rate = rate;
    };

    public function getRate():Number{
      return mic.rate;
    };

    public function getName():String {
      return Microphone.names[mic.index];
    };

    public function setMic(index:Number):Boolean {
      mic = Microphone.getMicrophone(index);
      log("Microphone changed");
      return true;
    };

    public function getMicrophoneList():Array {
      var list:Array = new Array();

      for (var i:Number = 0, l:Number = Microphone.names.length; i < l; i++) {
        list[i] = Microphone.names[i];
      }
      return list;
    };

    public function statusHandler(event:StatusEvent):void {
      ExternalInterface.call(JSObject + '.status', id, event);
      log("status:" + event.code + " : " + event);
    };

    public function activityHandler(event:ActivityEvent):void {
      ExternalInterface.call(JSObject + '.vad', id, event);
      log("vad: " + mic.activityLevel + " : " + event);
    };

    public function error(message:String):void {
      ExternalInterface.call(JSObject + '.error', id, "microphone.js:", message);
      log("error: " + message);
    };

    public function log(message:*):void {
      if(debugging){
        ExternalInterface.call('console.log', "microphone.js:", message);
      }
    };

  }
}
