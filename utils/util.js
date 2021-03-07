const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second]
    .map(formatNumber)
    .join(':')}`;
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
    did: did,
    time_stamp: new Date().getTime(),
    latitude: latitude,
    longitude: longitude,
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
    did: signData.did,
    time_stamp: signData.time_stamp,
    latitude: signData.latitude,
    longitude: signData.longitude,
    sig: signature || '',
  };
}

function checkKeystore(jsontext) {
  try {
    if (!jsontext || !jsontext.length)
      throw { errCode: 'KEYSTORE_FORMAT_INCORRECT', errMsg: '空串' };
    const keystore = JSON.parse(jsontext);
    if (
      typeof keystore !== 'object' ||
      !keystore.hasOwnProperty('version') ||
      !keystore.hasOwnProperty('did') ||
      !keystore.hasOwnProperty('cipher_txt')
    ) {
      throw new Error('keystore json illegal,it must contain keys [version,did,cipher_txt].');
    }
    return keystore;
  } catch (e) {
    throw { errCode: 'KEYSTORE_FORMAT_INCORRECT', errMsg: '账号格式不正确.' };
  }
}

module.exports = {
  formatTime,
  randomBytes,
  buildSignData,
  appendSignature,
  checkKeystore,
};
