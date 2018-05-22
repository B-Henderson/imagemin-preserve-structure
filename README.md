# imagemin-preserve-structure

> Preserve folder structure

## A small node script to preserve folder structure when using imagemin

## Options

```
    -v logging default false
    -o output directory
    -e entry directory/file
    -rl readline to allow for piping files
```

## Usage

###Basic usage with the command line:

####input

```
 npx imageps -e images/test/*.*  -o dist -v
```

####output

```
 ✔  dist\images\test\conflig.jpg
 ✔  dist\images\test\nandos.jpg
 ✔  dist\images\test\Mug-meme-close-enough.jpg
```

preserving the folder structure into the dist folder

###Using a pipe from glob

####input

```
 npx glob \"./assets/src/images/**/*.{png,jpg,gif,svg}\" | npx imageps -rl -v -o  dist
```

## Related

* [imagemin](https://github.com/imagemin/imagemin) - API to minify the images
* [glob](https://github.com/isaacs/node-glob) - package for matching patterns
