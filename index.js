#!/usr/bin/env node

/**
 * Athor: Ben Henderson - benhenderson976@gmail.com
 * script to preserve folder structure when using imagemin through npm scripts
 *  OPTIONS:
 *  -o output directory expected string follow
 *  -v verbose logging, default false, setting true will display image paths
 **/

'use strict'

/**
 *import required packages, adding more optimization packs is possible
 *must be imported here and delt with in:
 * optimizeImage to pass the plugin
 **/

const path = require('path')
const readline = require('readline')
const Imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminOptipng = require('imagemin-optipng')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminSvgo = require('imagemin-svgo')
const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  fg: {
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m'
  },
  bg: {
    Cyan: '\x1b[46m',
    Blue: '\x1b[44m'
  }
}

// VARIABLES

// defaulted output folder is current directory
let outdir = process.env.PWD

// verbose logging defaulted false
let verbose = false

/**
 *output all folders into this parent directory i.e. creates a images folder in dist
 *also used to slice the string and remove the base dir
 *example:
 * ./assets/images/123.jpg would result in
 * [your output dir]/images/123.jpg
 **/
const DEST_SUBROOT_FOLDER = 'images'

// tick does not work on windows only bash
const ticksymbol = '✔'
const cross = '❌'

// variable to hold output directory, set with -o command defaulted to current directory

let entry = ''
let readlines = false
/**
 *@PROPERY input the readable stream to listen to: process.stdin in here
 *@PROPERY output the writeable stream to write data to: process.stout here
 *@PROPERY terminal defaulted to false, will treat the input as if it is tty, may cause double printing on windows
 **/
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

// Handle the optional `-o` argument for the destination folder
if (process.argv.indexOf('-o') !== -1) {
  outdir = path.normalize(process.argv[process.argv.indexOf('-o') + 1])
}

// Handle the optional `-v` argument for verbose logging
if (process.argv.indexOf('-v') !== -1) {
  verbose = true
}

if (process.argv.indexOf('-rl') !== -1) {
  readlines = true
}

if (process.argv.indexOf('-e') !== -1) {
  entry = process.argv[process.argv.indexOf('-e') + 1]
  return optimizeImage(entry)
}

/**
 * FUNCTION imagemin
 * @PARAM {string} srcpath   source path to the file to be optomized
 * @PARAM {string} destpath output path for optomized images
 * @PARAM {function} plugins for imaginemin to deal with formats
 *
 * @DESCRIPTION creates a promise to imagemin that is used to optomize images
 * @RETURN returns a message in the console with success or error message
 **/

function imagemin(srcpath, destpath, plugin) {
  Imagemin([srcpath], destpath, {
    plugins: [plugin]
  })
    .then(files => {
      if (files && verbose) {
        console.log(
          colors.Bright + colors.fg.Green,
          ticksymbol,
          colors.Reset,
          destpath
        )
        process.exit()
      }
    })
    .catch(err => {
      console.log(
        colors.Bright + colors.fg.Red,
        'cross, there was an error',
        err,
        colors.Reset
      )
    })
}

/**
 * FUNCTION getPathInfo
 *@PARAM {string} srcpath the source path piped to the script
 *
 *@DESCRIPTION a function to get the folder structure that the image
 * is being pulled from to create the same structure on output
 *
 *@RETURN {object} destination folder structure and file extension (jpg,svg, etc.)
 **/

function getPathInfo(srcpath) {
  console.log('srcpath', srcpath)

  /**
   * path.extname - node function to return extension of path
   * path.sep get the seperator in the string '/' here
   * subpath removes the folders up to images
   **/

  var ext = path.extname(srcpath),
    parts = srcpath.split(path.normalize(path.sep)),
    subpath = parts.slice(parts.indexOf(DEST_SUBROOT_FOLDER), parts.length)

  //remove last item, filename in this case
  subpath.pop()

  // adds the output dir to the start of subpath
  subpath.unshift(outdir)
  console.log(subpath)
  //join the array using the seperator '/' and normalize it
  return {
    dest: path.normalize(subpath.join(path.sep)),
    ext: ext
  }
}

/**
 * FUNCTION optimizeImage
 *PARAM {string} image files path
 * gets the path details @see getPathInfo
 **/
function optimizeImage(srcpath) {
  var p = getPathInfo(srcpath)
  // switch statement to determine which plugin to use
  switch (p.ext) {
    case '.jpg':
      imagemin(srcpath, p.dest, imageminJpegtran({ progressive: true }))
      break
    case '.png':
      imagemin(srcpath, p.dest, imageminOptipng({ optimizationLevel: 5 }))
      break
    case '.gif':
      imagemin(srcpath, p.dest, imageminGifsicle({ interlaced: true }))
      break
    case '.svg':
      imagemin(
        srcpath,
        p.dest,
        imageminSvgo({
          plugins: [
            { removeUselessDefs: false },
            { cleanupIDs: false },
            { removeViewBox: false }
          ]
        })
      )
      break
  }
}

//when image is passed in
if (readlines) {
  rl.on('line', line => {
    optimizeImage(line)
  })
}
