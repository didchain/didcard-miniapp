function randomBytes(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

module.exports = {
  randomBytes: randomBytes
};