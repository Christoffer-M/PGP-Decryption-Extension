console.log("config: " + config);
const regex1 = /(\w+|\d+)(,\s*\d+)*/gm;
var messages = config.toString().match(regex1);
var markup = document.documentElement.innerHTML;
const regex = /(((-----BEGIN PGP SIGNED MESSAGE-----)(\n.*?)*)(-----END PGP SIGNATURE-----))+/gm;
const results = markup.match(regex);
for (const message of messages) {
  if (markup.match(regex)) {
    markup = markup.replace(regex, message);
  }
}
document.open();
document.write(markup);
document.close();
