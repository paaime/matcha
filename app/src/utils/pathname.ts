export const formatPathname = (pathname: string) => {
  const languagePrefixes = ['/de', '/fr']; // Add your language prefixes here
  const matchingPrefix = languagePrefixes.find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (matchingPrefix) {
    const withoutLanguage = pathname.substr(matchingPrefix.length);
    return withoutLanguage;
  }

  return pathname;
};

export const titlePathname = (pathname: string) => {
  const withouthSlash = pathname.slice(1);

  return withouthSlash.charAt(0).toUpperCase() + withouthSlash.slice(1);
};
