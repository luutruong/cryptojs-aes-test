const CryptoJS = require('crypto-js');

function encrypt(message, key) {
  const keyMd5 = CryptoJS.MD5(key);
  const iv = CryptoJS.lib.WordArray.random(16);

  const cipher = CryptoJS.AES.encrypt(message, keyMd5, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  }).toString();

  const mac = CryptoJS.HmacSHA256(iv.toString(CryptoJS.enc.Base64) + cipher, keyMd5);

  const payload = {
    iv: iv.toString(CryptoJS.enc.Base64),
    mac: mac.toString(),
    value: cipher,
  };
  console.log(payload);

  const encoded = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));

  return CryptoJS.enc.Base64.stringify(encoded);
}

function decrypt(payload, key) {
  const keyMd5 = CryptoJS.MD5(key);
  const decoded = CryptoJS.enc.Base64.parse(payload).toString(CryptoJS.enc.Utf8);

  const obj = JSON.parse(decoded);
  console.log(obj);
 
  const cipher = CryptoJS.AES.decrypt(obj.value, keyMd5, {
    iv: CryptoJS.enc.Base64.parse(obj.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });

  return CryptoJS.enc.Utf8.stringify(cipher);
}

const encrypted = encrypt('test-message', 'test-encrypt-key');
console.log(`Encrypted: ${encrypted}`);

const decrypted = decrypt(encrypted, 'test-encrypt-key');
console.log(`Decrypted: ${decrypted}`);

