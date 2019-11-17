function checkUrlType(url: string): string {
  // 获取后缀
  const ext = url.substr(url.lastIndexOf(".") + 1).toLowerCase();
  if (
    ext === "html" ||
    ext === "asp" ||
    ext === "jsp" ||
    ext === "php" ||
    !!ext
  ) {
    return "page";
  } else {
    return "source";
  }
}
function checkSameOrigin(url: string): boolean {
  const host = getHostName(url);
  const localhost = location.hostname;
  return host === localhost;
}
/**
 * 判断是否是同一个URl，只是参数不一致
 */
function checkSameUrl(url1: string, url2: string): boolean {
  return (
    getHostName(url1) === getHostName(url2) &&
    getUrlPath(url1) === getUrlPath(url2)
  );
}
function isRelative(url: string) {
  const Reg = new RegExp("^(?:[a-z]+:)?//", "i");
  return !Reg.test(url);
}
function getHostName(url: string) {
  if (!isRelative(url)) {
    return new URL(url).hostname;
  } else {
    return location.hostname;
  }
}
function getUrlPath(url: string) {
  if (!isRelative(url)) {
    return new URL(url).pathname;
  } else {
    return url;
  }
}
function getRealUrl(url: string) {
  if (isRelative(url)) {
    return `${location.origin}${url}`;
  }
  return url;
}
export { getHostName, checkSameUrl, checkUrlType, getRealUrl, checkSameOrigin };
