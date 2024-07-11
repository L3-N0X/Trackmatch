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

export function msToReadableTime(ms) {
  // convert ms to mm:ss
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function stripHtmlTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

function levenshteinDistance(str1, str2) {
  const len1 = str1.length,
    len2 = str2.length;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const dp = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(null));

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[len1][len2];
}

function jaccardSimilarity(str1, str2) {
  const set1 = new Set(str1.split(' ')),
    set2 = new Set(str2.split(' '));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return 1 - intersection.size / union.size;
}

function compareSourceTracks(track1, track2) {
  const weights = {
    album: 1,
    year: 1,
    artists: 45,
    nameLevenshtein: 13,
    nameJaccard: 20,
    nameLength: 4,
    nameOtherParts: 0.5,
    missingPenalty: 20
  };
  let totalScore = 0,
    attributesCompared = 0;

  function compareAttribute(attribute, weight, comparisonFunction = levenshteinDistance) {
    if (track1[attribute] && track2[attribute]) {
      const score = comparisonFunction(
        String(track1[attribute]).toLowerCase(),
        String(track2[attribute]).toLowerCase()
      );
      totalScore += weight * (attribute === 'year' ? (score === 0 ? 0 : 1) : score);
      attributesCompared++;
    } else {
      totalScore += weights.missingPenalty;
    }
  }

  compareAttribute('album', weights.album);
  compareAttribute('year', weights.year, (y1, y2) => (y1 === y2 ? 0 : 1));
  compareAttribute('artists', weights.artists, jaccardSimilarity);
  if (track1.name && track2.name) {
    // split name at a ( or - and compare the first part of the name seperately
    const nameParts1 = track1.name.split(/[-()]/),
      nameParts2 = track2.name.split(/[-()]/);
    if (
      (nameParts1[0].length > 2 || nameParts2[0].length > 2) &&
      (nameParts1.length > 1 || nameParts2.length > 1)
    ) {
      totalScore +=
        weights.nameLevenshtein *
        levenshteinDistance(nameParts1[0].toLowerCase(), nameParts2[0].toLowerCase());
      totalScore +=
        weights.nameJaccard *
        jaccardSimilarity(nameParts1[0].toLowerCase(), nameParts2[0].toLowerCase());
      totalScore +=
        weights.nameLength *
        (1 -
          Math.abs(nameParts1[0].length - nameParts2[0].length) /
            Math.max(nameParts1[0].length, nameParts2[0].length));
      attributesCompared++;

      // compare the rest of the name parts
      for (let i = 1; i < Math.min(nameParts1.length, nameParts2.length); ++i) {
        totalScore +=
          weights.nameOtherParts *
          levenshteinDistance(
            nameParts1[i] ? nameParts1[i].toLowerCase() : '',
            nameParts2[i] ? nameParts2[i].toLowerCase() : ''
          );
      }
    } else {
      const name1 = track1.name.toLowerCase(),
        name2 = track2.name.toLowerCase();
      totalScore += weights.nameLevenshtein * levenshteinDistance(name1, name2);
      totalScore += weights.nameJaccard * jaccardSimilarity(name1, name2);
      totalScore +=
        weights.nameLength *
        (1 - Math.abs(name1.length - name2.length) / Math.max(name1.length, name2.length));
      attributesCompared++;
    }
  } else {
    totalScore += weights.missingPenalty;
  }

  return attributesCompared > 0 ? totalScore / attributesCompared : totalScore;
}

export function getMatchLocalSpotify(localTrackObj, spotifyTrackObj, maxScore = 100) {
  const matchValue = compareSourceTracks(
    {
      name: localTrackObj.Title,
      album: localTrackObj.Album,
      year: String(localTrackObj.Year),
      artists: localTrackObj.Artist,
      duration: localTrackObj.TotalTime
    },
    {
      name: spotifyTrackObj.track.name,
      album: spotifyTrackObj.track.album.name,
      year: spotifyTrackObj.track.album.release_date.split('-')[0],
      artists: spotifyTrackObj.track.artists.map((artist) => artist.name).join(', '),
      duration: spotifyTrackObj.track.duration_ms / 1000
    }
  );

  const minScore = 0;
  const highSimilarityPercentage = 100;

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
