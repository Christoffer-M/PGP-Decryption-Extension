const regex101 = /(\w+|\d+|\s+)+(,\s*\d+)*/gm;
var messages = config.toString().match(regex101);
messages = messages.reverse();
var values = value;
values = values.reverse();

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

var markup = document.documentElement.innerHTML;
for (let index = 0; index < 2; index++) {
  let correctMatch = "";
  let currentIndex = 0;
  for (let index = 0; index < all.length; index++) {
    var thishtml = all[index].innerHTML;
    if (thishtml.match(regex)) {
      if (correctMatch === "") {
        currentIndex = index;
        correctMatch = thishtml;
      } else if (thishtml.length < correctMatch.length) {
        currentIndex = index;
        correctMatch = thishtml;
      }
    }
  }
  correctMatch = correctMatch.replace(regex, editedmessages.pop());
  all[currentIndex].innerHTML = correctMatch;
}
