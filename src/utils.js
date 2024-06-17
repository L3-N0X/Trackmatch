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
