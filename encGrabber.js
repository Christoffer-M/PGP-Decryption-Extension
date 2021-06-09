(function () {
  const markup = document.documentElement.innerHTML;
  const regex =
    /(((-----BEGIN PGP SIGNED MESSAGE-----)(\n.*?)*)(-----END PGP SIGNATURE-----))+/gm;
  const result = markup.match(regex);
  if (result !== null) {
    return result;
  } else {
    return null;
  }
})();
