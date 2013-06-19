A jQuery plugin providing Voice Activity Detection (vad) and streaming access to microphone via Flash and event handling.

## How

Simply attach the plugin to some DOM selector (`var microphone = new $.microphone('#div', options);`)
and start listening to JQuery events (`ready`, `data`, `event`, `vad`, `error`). 

Both `start` and `stop` method are used to activate and deactivate the microphone capture itself. Typically, `start()` is performed
upon `ready` event, while `stop()` is either to be used following a `setTimeout()` or upon `vad` event
type where `e.activating === false`. 

As for the `activity`, it can be used for instead to monitor activity level (`[0:100]`) and show off a volume/activity meter of your own.

The plugin creates the HTML object underneat the selector and add the `microphone` css class to be
styled for size, visibility and such.

Note that, as any Adobe Flash plugin requiring access to the microphone device, a user needs to accept
access notice, and potentially configure the device itself.

## Example

    var options = {
      vad: {
          level: 10, 
          timeout: 2000
      }
    };
    // hook microphone object to some div element
    // an <object> container will be created dynamically (215px x 138px)
    // with a stylable .microphone css class
    var microphone = new $.microphone('#div', options);
    $('#div').on('ready', function(event){
      console.log('ready');
      // will stop after 10 sec.
      setTimeout(function(){
        microphone.stop();
      }, 10000);
      //starts streaming
      microphone.start();
    });
    //when samples are available, this function is called
    $('#div').on('data', function(event, data){
      console.log(data);
    });
    // receive notification about voice activation detection
    $('#div').on('vad', function(event, data){
      console.log(data);
    });

## Default Options

    sampleRate : 8000,
    codec : 'pcmu',
    gain       : 50,
    swfPath    : 'microphone.swf',
    vad: {
      level: 10,
      timeout: 2000
    },
    debugging  : true

## Events 

### `vad`

This event is fired upon voice activity detection.

    {
      activating: true,
      bubbles: false,
      cancelable: false,
      currentTarget: Object,
      eventPhase: 2,
      target: Object,
      type: "activity"
    }

### `data`

This event is fired once a frame buffer buffer has been filled or the microphone has been stopped.
Buffer size is 4096.

    {
      sample: Array[4096],
      timestamp: 1370219409273,
    }


### `activity`

This event is fired once for each frame sample received within the microphone Flash plugin. It may not
be fired at continuous rate. Activity level values range between 0-100.

    {
        "encodeQuality": 6,
        "useEchoSuppression": false,
        "noiseSuppressionLevel": -30,
        "enhancedOptions": null,
        "activityLevel": 5,
        "soundTransform": {
            "rightToRight": 1,
            "volume": 1,
            "pan": 0,
            "leftToRight": 0,
            "rightToLeft": 0,
            "leftToLeft": 1
        },
        "gain": 50,
        "silenceLevel": 10,
        "rate": 8,
        "silenceTimeout": 2000,
        "enableVAD": true,
        "codec": "pcmu",
        "name": "Default",
        "muted": false,
        "framesPerPacket": 2,
        "index": 0
    }

### `status`

This event is fired upon the user clicking either one of `accept` or `reject` from within the Flash settings
privacy dialog.

    {
      "level": "status",
      "code": "Microphone.Muted",
      "currentTarget": {
          "encodeQuality": 6,
          "useEchoSuppression": false,
          "noiseSuppressionLevel": -30,
          "enhancedOptions": null,
          "activityLevel": -1,
          "soundTransform": {
              "rightToRight": 1,
              "volume": 1,
              "pan": 0,
              "leftToRight": 0,
              "rightToLeft": 0,
              "leftToLeft": 1
          },
          "gain": 28,
          "silenceLevel": 10,
          "rate": 8,
          "silenceTimeout": 2000,
          "enableVAD": true,
          "codec": "pcmu",
          "name": "Default",
          "muted": true,
          "framesPerPacket": 2,
          "index": 0
      },
      "eventPhase": 2,
      "type": "status",
      "bubbles": false,
      "cancelable": false,
      ...
    }

## Building Flash Object

    make swf

Note that you will need the flex builder command line tools from the SDK, which is 
[available](http://www.adobe.com/devnet/flex/flex-sdk-download.html) for free.

## SWF Bridge

Communication between SWF object and Javascript itself is done through a bridge object
(`$.microphone.Bridge`) which handles and properly dispatch events on the client side.

## Todo

* Port back to original repository (requires backward compatibility with no jquery wrapper) 
* Use callback for both `ready` and `error` instead of event. (Best practice)
* Fully document the option hash. 

## Contributors

* Morteza Milani (Original development)
* Pascal Deschenes (jQuery plugin, vad handling, and some bug fixes/cleanup)

## License

(The MIT License)
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
