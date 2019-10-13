
import quicklink from "./core/quicklink/index.mjs";
import requestIdleCallback from './core/quicklink/request-idle-callback.mjs'
import KabutoError from './core/error';
import { checkUrlType,checkSameOrigin,getRealUrl} from './core/url';
import { getSourceUrls,getSourceUrlsByWorker } from './core/parse';
import { makeWorker } from './core/worker';
class Kabuto {
    pageUrl: string[] = []; // 页面记录
    sourceUrl: string[] = []; // source记录
    urls: string[] = []; // 手动模式下的资源栈
    origins: string[] | boolean = false;
    el: HTMLElement = document.body;
    observeTime:number = 500;
    ignores: any[] = [];
    timeout: number = 2000;
    constructor(config: { timeout?: number| void, urls?: string[] | void, origins?: string[] | boolean | void, el?: HTMLElement | void, ignores?: any[]| void,observeTime?:number| void} | void) {
        const {  urls = this.urls, origins = this.origins, el = this.el, ignores = this.ignores, timeout = this.timeout,observeTime = this.observeTime } = config || {};
        this.urls = urls.map((url)=>{
            return getRealUrl(url);
        });
        this.sourceUrl = urls;
        this.origins = origins;
        this.el = el;
        this.ignores = ignores;
        this.timeout = timeout;
        this.observeTime = observeTime;
        // 有url
        if (this.urls&&this.urls.length) {
            this.listen()
        }
        else {
            this.observe(this.el);
        }

    }
    /**
     * 增加Url
     * @param url
     */
    add(url: string) {
        url = getRealUrl(url);
        if (checkUrlType(url) === 'page') {
            // 页面
            if(this.pageUrl.indexOf(url)>-1){
                // 页面已经预加载
                return ;
            }
            this.urls.push(url);
            if(checkSameOrigin(url) ){
                // 同源
                this.pageUrl.push(url);
                if (window.Worker) {
                    let worker = makeWorker(getSourceUrlsByWorker);
                    worker({url}).then((res) => {
                        this.urls = this.urls.concat(res);
                        this.urls = this.urls.filter(el=>{
                            return !this.sourceUrl.includes( el );
                        });
                        this.listen();
                    })
                }
                else {
                    console.warn('注意：当前环境不支持web worker,页面的解析将在主线程空闲时进行');
                    const timeoutFn = requestIdleCallback;
                    const timeout = this.timeout || 2e3;
                    timeoutFn(()=>{
                        getSourceUrls(url).then((sourceUrls) => {
                            this.urls = this.urls.concat(sourceUrls);
                            this.urls = this.urls.filter(el=>{
                                return !this.sourceUrl.includes( el );
                            });
                            this.listen();
                        });
                    },{timeout})
                }
            }
            else{
                console.warn('注意：只有同源页面支持获取页面内的资源');
            }
            

        }
        else {
            if(this.sourceUrl.indexOf(url)>-1){
                // 页面已经预加载
                return ;
            }
            this.urls.push(url);
            this.listen();
            return;
        }
    }
    /**
     * 监听空闲时间
     */
    listen() {
        try {
            if(!(this.urls&&this.urls.length)){
                return ;
            }
            quicklink({
                origins:this.origins,
                urls:this.urls,
                ignores:this.ignores,
                timeout:this.timeout,
                observeTime:this.observeTime
            });
            this.sourceUrl = this.sourceUrl.concat(this.urls);
            this.urls = []; 
        } catch (error) {
            throw new KabutoError(error)
        }
        
    }
    /**
     * 监听DOM
     */
    observe(el:HTMLElement) {
        const self = this;
        if(!el){
            return;
        }
        quicklink({
            origins:this.origins,
            el,
            ignores:this.ignores,
            timeout:this.timeout,
            observeTime:this.observeTime,
            observerCb:(url)=>{
                return self.add(url);
            }
        });
    }

}

export default Kabuto;