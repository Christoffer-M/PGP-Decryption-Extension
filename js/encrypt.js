$(async function () {
  $("#encrypt").on("click", async () => {
    const privkey = document.getElementById("privateKey").value;
    const passphrase = document.getElementById("passphrase").value;
    var error = document.getElementById("errortext");
    var passerror = document.getElementById("passworderror");
    if (privkey !== "" && passphrase !== "") {
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

        document.getElementById("encryptedmessage").value = cleartext;
      } catch (err) {
        console.error(err);
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
        const { valid } = verified.signatures[0];
        const text = document.getElementById("verifyresult");
        if (valid) {
          if (text.classList.contains("red-color")) {
            text.classList.remove("red-color");
          }
          if (!text.classList.contains("green-color")) {
            text.classList.add("green-color");
          }
          text.innerHTML = "VERIFIED!";
          text.classList.remove("hide");
          console.log(
            "signed by key id " + verified.signatures[0].keyid.toHex()
          );
        } else {
          throw new Error("signature could not be verified");
        }
      } catch (err) {
        const text = document.getElementById("verifyresult");
        if (text.classList.contains("green-color")) {
          text.classList.remove("green-color");
        }
        if (!text.classList.contains("red-color")) {
          text.classList.add("red-color");
        }
        text.classList.remove("hide");

        text.innerHTML = "NOT VERIFIED! BE CAREFUL!";
        console.error(err);
      }
    } else {
      error.classList.remove("hide");
    }
  });

  $("#htmlGrabber").on("click", async () => {
    console.log("Popup DOM fully loaded and parsed");

    var encryptedMessages = [];
    const pubkey = document.getElementById("publickeyscanner").value;

    if (pubkey !== "") {
      await chrome.tabs.executeScript(
        null,
        { file: "encGrabber.js" },
        function (result) {
          encryptedMessages = result[0];
          const text = document.getElementById("scantext");
          if (encryptedMessages === null) {
            text.innerHTML =
              "Could not find any Encrypted messages on this page.";
            text.classList.remove("hide");
          } else {
            if (!text.classList.contains("hide")) {
              text.classList.add("hide");
            }
            decrypt();
          }
        }
      );

      async function decrypt() {
        const updatedValues = [];
        const values = [];
        for (const message of encryptedMessages) {
          try {
            const verified = await openpgp.verify({
              message: await openpgp.cleartext.readArmored(message), // parse armored message
              publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification
            });
            const verifyvalues = Object.values(verified);
            const { valid } = verified.signatures[0];
            updatedValues.push(verifyvalues[1]);

            if (valid) {
              console.log(
                "signed by key id " + verified.signatures[0].keyid.toHex()
              );
              values.push(true);
            } else {
              values.push(false);
            }
          } catch (error) {
            console.error(error);
            const regex =
              /((Hash: SHA512)((\n.*?)*))(-----BEGIN PGP SIGNATURE-----)/gm;
            const res = regex.exec(message);
            values.push(false);
            updatedValues.push(res[3].trim() + "- SHA not valid!");
          }
        }
        updatePage(updatedValues, values, encryptedMessages);
      }

      function updatePage(messages, values, encmess) {
        chrome.tabs.executeScript(
          {
            code:
              "var config = " +
              JSON.stringify(messages) +
              "; var value = " +
              JSON.stringify(values) +
              "; var encmess = " +
              JSON.stringify(encmess),
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
