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

function playLocalTrack(track) {
  const mimeTypes = {
    mp3: 'audio/mpeg',
    flac: 'audio/flac',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4'
    // Add other formats as needed
  };

  let trackPath = track.Location;
  console.log('Track Path:', trackPath);
  let extension = trackPath.split('.').pop().toLowerCase();
  let mimeType = mimeTypes[extension] || 'audio/*'; // Default to 'audio/*' if extension is not in the mapping

  window.musicPlayer.playTrack(trackPath);
  window.musicPlayer.onTrackData((data) => {
    // Ensure the data is correctly formatted as a byte array
    const byteArray = new Uint8Array(data);

    // Create the Blob with the correct MIME type
    const audioBlob = new Blob([byteArray], { type: mimeType });

    // Generate the URL and create an Audio object for playback
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Attempt playback and handle potential errors
    audio.play().catch((error) => {
      console.error('Playback failed', error);
      // Consider fallbacks or error handling here
    });
  });
}

export { getLocalMusic, getAllLocalTracks, loadAndParseFile, playLocalTrack };
