(function () {
  var markup = document.documentElement.innerHTML;
  const regex = /(((-----BEGIN PGP SIGNED MESSAGE-----)(\n.*?)*)(-----END PGP SIGNATURE-----))+/gm;
  console.log("Matches found: " + markup.match(regex).length);
  const result = markup.match(regex);
  for (let index = 0; index < result.length; index++) {
    console.log(result[index]);
  }
  return result;
})();
