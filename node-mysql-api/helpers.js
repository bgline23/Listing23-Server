import crypto from "crypto";

const algorithm = "aes256"; // or any other algorithm supported by OpenSSL
const secret = process.env.API_SECRET;

const key = crypto
  .createHash("sha256")
  .update(String(secret))
  .digest("base64")
  .substring(0, 32);

const initVector = key.substring(0, 16);

const encrypt = text => {
  const cipher = crypto.createCipheriv(algorithm, key, initVector);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

const decrypt = text => {
  const decipher = crypto.createDecipheriv(algorithm, key, initVector);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

export { encrypt, decrypt };
