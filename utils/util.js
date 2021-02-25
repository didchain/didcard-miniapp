const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

function randomBytes(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

function buildSignData(did, latitude, longitude) {
  if (!did) {
    throw new Error('Parameter did required.');
  }
  const data = {
    time_stamp: new Date().getTime(),
    latitude: latitude || '',
    longitude: longitude || '',
    did: did,
  };

  return data;
}

function appendSignature(signData, signature) {
  if (
    typeof signData !== 'object' ||
    !signData.hasOwnProperty('did') ||
    !signData.hasOwnProperty('time_stamp') ||
    !signData.hasOwnProperty('latitude') ||
    !signData.hasOwnProperty('longitude')
  ) {
    throw new Error('signData required contains keys [did,time_stamp,latitude,longitude]');
  }

  return {
    time_stamp: signData.time_stamp,
    latitude: signData.latitude,
    longitude: signData.longitude,
    signature: signature || '',
    did: signData.did,
  };
}

module.exports = {
  formatTime,
  randomBytes,
  buildSignData,
  appendSignature,
};
