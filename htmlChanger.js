(function () {
  var messages = config;
  var values = value;
  var encryptedmess = encmess;
  var editedmessages = [];

  var all = document.getElementsByTagName("*");
  for (let index = 0; index < messages.length; index++) {
    if (values[index] === true) {
      const temp = `<p  style='background-color: green'>${messages[index]}</p>`;
      editedmessages.push(temp);
    } else {
      const temp = `<p  style='background-color: red'>${messages[index]}</p>`;
      editedmessages.push(temp);
    }
  }

  for (let i = 0; i < messages.length; i++) {
    let currentIndex = 0;
    let found = false;
    const encryptedMessage = encryptedmess[i].trim();
    for (let index = 0; index < all.length; index++) {
      let thishtml = all[index].innerHTML.trim();
      if (thishtml === encryptedMessage) {
        currentIndex = index;
        found = true;
        break;
      }
    }
    if (found) {
      all[currentIndex].innerHTML = editedmessages[i];
    } else {
      console.log("No matches found!");
    }
  }
})();
