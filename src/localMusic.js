const loadAndParseFile = async () => {
  if (localStorage.getItem('xmlFilePath')) {
    console.log('XML File Path:', localStorage.getItem('xmlFilePath'));
    try {
      const parsedData = await window.readAndParseFile(localStorage.getItem('xmlFilePath'));
      //   return parsedData;
      localStorage.setItem('localMusic', JSON.stringify(parsedData));
    } catch (err) {
      console.error(`Error reading and parsing file: ${err}`);
    }
  }
};

if (window.readAndParseFile) {
  loadAndParseFile();
} else {
  console.error('readAndParseFile function not available');
}

function getLocalMusic() {
  return new Promise((resolve) => {
    //  return the load and parsed file
    resolve(JSON.parse(localStorage.getItem('localMusic')));
  });
}

function getAllLocalTracks() {
  return new Promise((resolve) => {
    const localMusic = JSON.parse(localStorage.getItem('localMusic'));
    const tracks = localMusic.DJXML.Library.Track;
    resolve(tracks);
  });
}

export { getLocalMusic, getAllLocalTracks };
