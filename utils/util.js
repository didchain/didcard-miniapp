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

module.exports = {
  formatTime,
  randomBytes,
};
