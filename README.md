About
=====

A jQuery plugin providing streaming access to microphone via Flash.

Example
-------

      var microphone = new $.microphone('#microphone');
      $('#microphone').on('ready', function(event){
        console.log('ready');
        // will stop after 10 sec.
        setTimeout(function(){
          microphone.stop();
        }, 10000);
        //starts streaming
        microphone.start();
      });
      //when samples are available, this function is called
      $('#microphone').on('data', function(event, data){
        console.log(data);
      });
      // receive notification about voice activation detection
      $('#microphone').on('vad', function(event, data){
        console.log(data);
      });

License
-------

(The MIT License)

Copyright (c) 2011 Morteza Milani

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
