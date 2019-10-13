function getSourceUrls(url:string): Promise<any[]>{
    // 解析html，返回资源链接
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const sourceUrls = parseHtml(req.responseText||'');
                resolve(sourceUrls);
            }
        };
        req.open("GET", url,true);
        req.send();
    })
}
function getSourceUrlsByWorker(){
    // 解析html，返回资源链接
    onmessage = ( event )=>{
        const {url,jobId}= event.data;
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // web worker中无法使用dom操作，采用正则匹配
                    const html  = req.responseText||'';
                    const resourceReg = /(<script .*?src=[\'\"](.+?)[\'\"])|(<link .*?href=[\'\"](.+?)[\'\"]|(<img .*?\ssrc=[\'\"](.+?)[\'\"]))/gi;
                    const sourceUrls = html.match(resourceReg).filter((resource)=>{
                        return resource.indexOf('rel="dns-prefetch"')<0 && resource.indexOf("rel='dns-prefetch'")<0;
                    }).map((link)=>{
                        return link.replace(resourceReg, '$2$4$6')
                    })
                    postMessage({jobId,sourceUrls}); 
                    resolve(sourceUrls);
                }
            };
            req.open("GET", url,true);
            req.send();
        })  
      }
   
}
function parseHtml(html: string):any[] {
    const dom = document.createDocumentFragment();
    const body = document.createElement('html')
    body.innerHTML = html;
    dom.appendChild(body);
    return Array.from(dom.querySelectorAll('script,link,img')).filter(source=>{
        return source.rel!=='dns-prefetch'&&(source.src || source.href);
    }).map((link) => {
        return link.src || link.href;
    });
}

export {
    getSourceUrls,
    getSourceUrlsByWorker,
    parseHtml
};