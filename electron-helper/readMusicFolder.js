import fs from 'fs';
// const NodeID3 = require('node-id3');
import * as id3 from 'id3js';

// MP3-, AAC-, WAVE-, AIFF- und Apple Lossless-Dateien, Flac, M4A, OGG, ALAC, WAV, AIF, WL:MP§, MP4
const ALLOWED_FYLETYPES = [
  'mp3',
  'aac',
  'wav',
  'aiff',
  'alac',
  'flac',
  'm4a',
  'ogg',
  'alac',
  'wav',
  'aif',
  'wl:mp3',
  'mp4'
];

async function readMusicFolder(path) {
  return new Promise((resolve, reject) => {
    readSubFolder(path)
      .then((tracklist) => {
        console.log(`Found ${tracklist.length} Tracks.`);
        resolve(tracklist);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function readSubFolder(path) {
  return new Promise((resolve, reject) => {
    let tracklist = [];
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      let promiseQueue = [];
      let index = 0;
      function enqueue() {
        if (index === files.length) {
          Promise.all(promiseQueue)
            .then(() => {
              resolve(tracklist);
            })
            .catch((err) => {
              reject(err);
            });
          return;
        }
        let file = files[index++];
        let promise = new Promise((resolve, reject) => {
          fs.lstat(`${path}/${file}`, (err, stats) => {
            if (err) {
              reject(err);
              return;
            }
            if (stats.isDirectory()) {
              readSubFolder(`${path}/${file}`)
                .then((subfolderTracklist) => {
                  tracklist = tracklist.concat(subfolderTracklist);
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              const pathToTrack = `${path}/${file}`;
              console.log(`processing ${file}...`);
              const track = {
                filename: file,
                path: pathToTrack,
                filetype: file.split('.').pop()
              };
              if (ALLOWED_FYLETYPES.includes(track.filetype.toLowerCase())) {
                id3.fromPath(pathToTrack).then((tags) => {
                  // tags now contains v1, v2 and merged tags
                  console.log(tags);
                  track.tags = tags;
                  if (track.tags.title === undefined) {
                    track.tags.title = file.split('.').shift();
                  }
                });
                // readTrackID3Tags(pathToTrack)
                // .then((tags) => {
                // track.tags = tags;
                // if (track.tags.title === undefined) {
                // track.tags.title = file.split('.').shift();
                // }
                tracklist.push(track);
                resolve();
                // })
                // .catch((err) => {
                // reject(err);
                // });
              } else {
                resolve();
              }
            }
          });
        });
        promiseQueue.push(promise);
        if (promiseQueue.length >= 20 || index === files.length) {
          Promise.all(promiseQueue)
            .then(enqueue)
            .catch((err) => {
              reject(err);
            });
          promiseQueue = [];
        } else {
          enqueue();
        }
      }
      enqueue();
    });
  });
}

// function readTrackID3Tags(pathToTrack) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       exclude: ['popularimeter'], // don't read the specified tags (default: [])
//       onlyRaw: false, // only return raw object (default: false)
//       noRaw: true // don't generate raw object (default: false)
//     };
//     NodeID3.read(pathToTrack, options, (err, tags) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(tags);
//       }
//     });
//   });
// }

// module.exports = readMusicFolder;
export default readMusicFolder;
