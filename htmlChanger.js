(function () {
  const regex101 = /(\w+|\d+|\s+)+(,\s*\d+)*/gm;
  var messages = config.toString().match(regex101);
  var values = value;
  var encryptedmess = encmess;
  console.log(encryptedmess);
  var editedmessages = [];

  const regex = /(((-----BEGIN PGP SIGNED MESSAGE-----)(\n.*?)*)(-----END PGP SIGNATURE-----))+/gm;
  var all = document.getElementsByTagName("*");
  for (let index = 0; index < messages.length; index++) {
    if (values[index] === true) {
      const temp =
        "<p  style='background-color: green'>" + messages[index] + "</p>";
      editedmessages.push(temp);
    } else {
      const temp =
        "<p  style='background-color: red'>" + messages[index] + "</p>";
      editedmessages.push(temp);
    }
  }

  for (let i = 0; i < messages.length; i++) {
    let currentIndex = 0;
    let found = false;
    for (let index = 0; index < all.length; index++) {
      let thishtml = all[index].innerHTML;
      if (thishtml === encryptedmess[i]) {
        currentIndex = index;
        found = true;
        break;
      }
    }
    if (found) {
      all[currentIndex].innerHTML = editedmessages[i];
    } else {
      console.log("Corret match was empty.");
    }
  }
})();
