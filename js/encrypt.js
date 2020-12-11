$(async function () {
  // const key = await openpgp.generateKey({
  //   userIds: [{ name: "Jon Smith", email: "jon@example.com" }], // you can pass multiple user IDs
  //   rsaBits: 2048, // RSA key size
  //   passphrase: "123456789", // protects the private key
  // });

  // let values = Object.values(key);
  // // console.log(values[2])
  // // console.log(values[1])

  $("#encrypt").on("click", async () => {
    const privkey = document.getElementById("privateKey").value;
    const passphrase = document.getElementById("passphrase").value;

    const email = document.getElementById("email").value;
    var error = document.getElementById("errortext");
    var passerror = document.getElementById("passworderror");
    if (email !== "" && privkey !== "" && passphrase !== "") {
      if (!error.classList.contains("hide")) {
        error.classList.add("hide");
      }
      const privateKey = (await openpgp.key.readArmored([privkey])).keys[0];
      try {
        if (!passerror.classList.contains("hide")) {
          passerror.classList.add("hide");
        }
        await privateKey.decrypt(passphrase);
        const inputvalue = document.getElementById("encryptedmessage").value;
        var { data: cleartext } = await openpgp.sign({
          message: openpgp.cleartext.fromText(inputvalue), // CleartextMessage or Message object
          privateKeys: [privateKey], // for signing
        });
        cleartext = cleartext;
        const regex = /(?<=Comment:\s).*/gm;
        cleartext = cleartext.replace(regex, email);

        document.getElementById("encryptedmessage").value = cleartext;
      } catch (err) {
        console.log(err);
        passerror.innerHTML = err;
        passerror.classList.remove("hide");
      }
    } else {
      error.classList.remove("hide");
    }
  });

  $("#decrypt").on("click", async () => {
    const pubkey = document.getElementById("pubkeyverify").value;
    const encryptedmessage = document.getElementById("decryptedmessage").value;

    var error = document.getElementById("errortextpubkey");

    if (pubkey !== "" && encryptedmessage !== "") {
      try {
        const verified = await openpgp.verify({
          message: await openpgp.cleartext.readArmored(encryptedmessage), // parse armored message
          publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification
        });

        let verifyvalues = Object.values(verified);

        document.getElementById("decryptedmessage").value = verifyvalues[1];
        console.log(verified.signatures[0]);
        const { valid } = verified.signatures[0];
        console.log(valid);
        var text = document.getElementById("verifyresult");
        if (valid) {
          text.classList.remove("red-color");
          text.innerHTML = "VERIFIED!";
          if (!text.classList.contains("green-color")) {
            text.classList.add("green-color");
          }
          text.classList.remove("hide");
          console.log(
            "signed by key id " + verified.signatures[0].keyid.toHex()
          );
        } else {
          throw new Error("signature could not be verified");
        }
      } catch (err) {
        text.classList.remove("green-color");
        text.innerHTML = "VERIFIED!";
        if (!text.classList.contains("red-color")) {
          text.classList.add("red-color");
        }
        text.classList.remove("hide");

        text.innerHTML = "NOT VERIFIED! BE CAREFUL!";
        console.log("ERROR: " + err);
      }
    } else {
      error.classList.remove("hide");
    }
  });

  $("#htmlGrabber").on("click", async () => {
    console.log("Popup DOM fully loaded and parsed");

    var encryptedMessages = [];
    var decryptedMessage = "";
    const pubkey = document.getElementById("publickeyscanner").value;

    if (pubkey !== "") {
      await chrome.tabs.executeScript(
        null,
        { file: "encGrabber.js" },
        function (result) {
          encryptedMessages = result[0];
          receiveEncryption();
          decrypt();
        }
      );

      async function receiveEncryption() {
        encryptedMessages.forEach((element) => {
          console.log("HI THERE: " + element);
        });
      }

      async function decrypt() {
        const updatedValues = [];
        for (const message of encryptedMessages) {
          const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(message), // parse armored message
            publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification
          });
          const verifyvalues = Object.values(verified);
          console.log(verifyvalues[1]);
          const { valid } = verified.signatures[0];
          if (valid) {
            console.log(
              "signed by key id " + verified.signatures[0].keyid.toHex()
            );
            updatedValues.push(verifyvalues[1]);
          } else {
            throw new Error("signature could not be verified");
          }
        }
        console.log(updatedValues.length);
        for (const iterator of updatedValues) {
          console.log(iterator);
        }
        updatePage(updatedValues);
      }

      function updatePage(messages) {
        chrome.tabs.executeScript(
          {
            code: "var config = " + JSON.stringify(messages),
          },
          function () {
            chrome.tabs.executeScript({ file: "htmlChanger.js" });
          }
        );
      }
    } else {
      console.log("NO PUBKEY");
    }
  });
});
