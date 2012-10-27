About
=====

A jQuery plugin providing vad and streaming access to microphone via Flash.

Only supports speex codec right now.

## Example

      var options = {
        vad: {
            level: 10, 
            timeout: 2000
        }
      };
      // hook microphone object to some div element
      // an <object> will be created dynamically
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

## Building Flash Object

    rake swf

Note that you will need the flex builder command line tools from the SDK, which is 
[available](http://www.adobe.com/devnet/flex/flex-sdk-download.html) for free.

## Contributors

* Morteza Milani
* Pascal Deschenes

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
