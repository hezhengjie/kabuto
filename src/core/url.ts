function checkUrlType(url:string):string {
  // 获取后缀
  const ext = url.substr(url.lastIndexOf('.') + 1).toLowerCase();
  if(ext === 'html'|| ext === 'asp' || ext === 'jsp' || ext === 'php' || !!ext){
    return 'page';
  }
  else{
    return 'source';
  }
}
function checkSameOrigin(url:string):boolean {
  const host = new URL(url).hostname;
  const localhost = location.hostname;
  return host === localhost;
}
export {
  checkUrlType,
  checkSameOrigin
};