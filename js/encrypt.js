$("#encryptTest").on('click', async () => {
  const key = await openpgp.generateKey({
    userIds: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
    rsaBits: 2048,                                              // RSA key size
    passphrase: '123456789'          // protects the private key
  });
  
  let values = Object.values(key);

  const publicKeyArmored = values[2];
  const privateKeyArmored = values[1]
  const passphrase = `123456789`; // what the private key is encrypted with

  const privateKey = (await openpgp.key.readArmored([privateKeyArmored])).keys[0];
  await privateKey.decrypt(passphrase);

  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText("Hello, World!"), // input as Message object
    publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for encryption
  });
  console.log(encrypted);

  // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encrypted), // parse armored message
    privateKeys: [privateKey], // for decryption
  });
  console.log(decrypted); // 'Hello, World!'
  await chrome.tabs.executeScript({code:"console.log('" + decrypted + "')"});
})