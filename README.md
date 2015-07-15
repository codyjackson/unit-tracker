#unit-tracker

A small map application which tracks the paths of various units.

###Demo:
To run the demo download this [XML File](https://raw.githubusercontent.com/codyjackson/unit-tracker/master/assets/GMIMessageEx2.xml) to drive the application. Then click the image below to launch the application.

[![Unit Tracker Demo](https://github.com/codyjackson/unit-tracker/blob/master/media/thumbnail.png?raw=true)](https://rawgit.com/codyjackson/unit-tracker/master/media/demo/index.html#/)


###Dependencies:
1. install [http://nodejs.org/](nodejs)
2. install [http://mimosa.io/](mimosajs)

   ```
    $ npm install -g mimosa
   ```
3. install all other dependencies:

   ```
   $ npm install
   ```

###Building:
```
$ mimosa build -o
```

###Run Development Server:
```
$ mimosa watch --server
```

###Directories of interest:

```
unit-tracker
  assets
    javascripts
    stylesheets
    partial-views

  views
    index.hbs
```
    
