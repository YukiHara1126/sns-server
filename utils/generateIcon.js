const identicon = require("identicon.js");

const generateIcon = (input, size = 64) => {
  const hash = require("crypto").createHash("md5").update(input).digest("hex");
  const svg = new identicon(hash, size);
  return `data:image/png;base64,${svg}`;
};

module.exports = generateIcon;
