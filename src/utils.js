export function convLargeToString(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
}

export function extractColorFromImage(imageUrl) {
  const img = new Image();
  img.src = imageUrl;
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    console.log(color);
    return color;
  };
}

export function secondsToReadableTime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let timeString = '';
  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0) {
    timeString += `${minutes}min`;
  }
  return timeString.trim();
}

export function stripHtmlTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create a matrix
  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

  // Initialize the matrix
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }

  // Compute the distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Deletion
        dp[i][j - 1] + 1, // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return dp[len1][len2];
}
function compareTracks(standardTrack1, standardTrack2) {
  const weights = {
    album: 4,
    year: 2,
    artists: 7,
    duration: 1,
    name: 13,
    missingPenalty: 20 // Penalty for missing attributes
  };

  let totalScore = 0;
  let attributesCompared = 0;

  // Compare album names
  if (standardTrack1.album && standardTrack2.album) {
    totalScore +=
      weights.album *
      levenshteinDistance(
        String(standardTrack1.album).toLowerCase(),
        String(standardTrack2.album).toLowerCase()
      );
    attributesCompared++;
  } else {
    totalScore += weights.missingPenalty;
  }

  // Compare years
  if (standardTrack1.year && standardTrack2.year) {
    totalScore += weights.year * (standardTrack1.year === standardTrack2.year ? 0 : 1);
    attributesCompared++;
  } else {
    totalScore += weights.missingPenalty;
  }

  // Compare artist names
  if (standardTrack1.artists && standardTrack2.artists) {
    totalScore +=
      weights.artists *
      levenshteinDistance(
        String(standardTrack1.artists).toLowerCase(),
        String(standardTrack2.artists).toLowerCase()
      );
    attributesCompared++;
  } else {
    totalScore += weights.missingPenalty;
  }

  // Compare duration (in seconds)
  if (standardTrack1.duration && standardTrack2.duration) {
    totalScore += weights.duration * Math.abs(standardTrack1.duration - standardTrack2.duration);
    attributesCompared++;
  } else {
    totalScore += weights.missingPenalty;
  }

  // Compare track names
  if (standardTrack1.name && standardTrack2.name) {
    totalScore +=
      weights.name *
      levenshteinDistance(
        String(standardTrack1.name).toLowerCase(),
        String(standardTrack2.name).toLowerCase()
      );
    attributesCompared++;
  } else {
    totalScore += weights.missingPenalty;
  }

  // Normalize score to account for number of attributes compared
  if (attributesCompared > 0) {
    totalScore = totalScore / attributesCompared;
  }

  return totalScore;
}

export function getMatchLocalSpotify(localTrackObj, spotifyTrackObj, maxScore = 100) {
  const matchValue = compareTracks(
    {
      name: localTrackObj.Title,
      album: localTrackObj.Album,
      year: localTrackObj.Year,
      artists: localTrackObj.Artist,
      duration: localTrackObj.TotalTime
    },
    {
      name: spotifyTrackObj.track.name,
      album: spotifyTrackObj.track.album.name,
      year: spotifyTrackObj.track.album.release_date,
      artists: spotifyTrackObj.track.artists.map((artist) => artist.name).join(', '),
      duration: spotifyTrackObj.track.duration_ms / 1000
    }
  );

  const minScore = 0;
  const highSimilarityPercentage = 99;

  let score = matchValue;

  // Ensure score is within bounds
  if (matchValue < minScore) {
    score = minScore;
  }
  if (matchValue > maxScore) {
    score = maxScore;
  }

  // Linear interpolation
  const percentage = Math.round(
    highSimilarityPercentage - (score / maxScore) * highSimilarityPercentage
  );

  return [matchValue, percentage];
}
