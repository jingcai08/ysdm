var rule = {
title:'真不卡',
host:'https://www.zbkk.net',
url:'/vodshow/fyclass--------fypage---.html',
searchUrl:'/vodsearch/**----------fypage---.html',
class_parse:'.stui-header__menu .dropdown li:gt(0):lt(5);a&&Text;a&&href;.*/(.*?).html',
一级:'.stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href',
搜索:'ul.stui-vodlist__media:eq(0) li,ul.stui-vodlist:eq(0) li,#searchList li;a&&title;.lazyload&&data-original;.text-muted&&Text;a&&href;.text-muted:eq(-1)&&Text',
cate_exclude:'猜你|喜欢|APP|首页',
}
// 以下是内置变量和解析方法
var MOBILE_UA='Mozilla/5.0 (Linux; Android 11; Mi 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36';
var UA='Mozilla/5.0';
function urljoin(a,b){//url拼接，暂未实现
return a+b
}
function homeParse(homeObj){//首页分类解析，筛选暂未实现
    let classes = [];
  if(homeObj.class_name&&homeObj.class_url){
        let names=homeObj.class_name.split('&');
        let urls=homeObj.class_url.split('&');
        let cnt=Math.min(names.length,urls.length);
        for (let i = 0; i < cnt; i++){
          classes.push({
             'type_id': urls[i],
            'type_name': names[i]
            });
        }
    }
    
    if(homeObj.class_parse){
     let p=homeObj.class_parse.split(';');
     if(p.length>=4){
         try{
             let html = req(homeObj.MY_URL, {
    headers: headers,
    method: "GET",
    //data: {k: "v"}
    });
    let list=pdfa(html,p[0]);
    
    list.forEach(it=>{
        try{
        let name=pdfh(it,p[1]);
        if(homeObj.cate_exclude&&(new RegExp(homeObj.cate_exclude).test(name))){
            continue;
        }
        let url=pdfh(it,p[2]);
        if(p[3]){
            let exp=new RegExp(p[3]);
            url=url.match(exp)[1];
        }
        
        classes.push({
             'type_id': url,
            'type_name': name
        });
        }catch(e){
            
        }
        
        
    });
   
         }catch(e){
             
         }
         
     }
     
    }
    
    return JSON.stringify({
        'class': classes
    });
   
}

function categoryParse(cateObj) {//一级分类页数据解析
    let p=cateObj.一级?cateObj.一级.split(';'):[];
    if(p.length<5){
        return '{}'
    }
    let d=[];
    let url=cateObj.url.replaceAll('fyclass',tid).replaceAll('fypage',pg);
    try{
        let html=req(url,{
            headers:{
                'User-Agent':MOBILE_UA
            }
        });
        let list=pdfa(html,p[0]);
        list.forEach(it=>{
            d.push({
            'vod_id': pd(it,p[4]),
            'vod_name': pdfh(it,p[1]),
            'vod_pic': pd(it,p[2]),
            'vod_remarks': pdfh(it,p[3]),
            });
        });
        return JSON.stringify({
        'page': parseInt(cateObj.pg),
        'pagecount': 999,
        'limit': 20,
        'total': 999,
        'list': d,
       });
    }catch(e){
        return '{}'
    }
}

function searchParse(searchObj) {//搜索列表数据解析
    let p=searchObj.搜索?searchObj.搜索.split(';'):[];
    if(p.length<5){
        return '{}'
    }
    let d=[];
    let url=searchObj.searchUrl.replaceAll('**',searchObj.wd).replaceAll('fypage',searchObj.pg);
    try{
        let html=req(url,{
            headers:{
                'User-Agent':MOBILE_UA
            }
        });
        let list=pdfa(html,p[0]);
        list.forEach(it=>{
            let ob={
            'vod_id': pd(it,p[4]),
            'vod_name': pdfh(it,p[1]),
            'vod_pic': pd(it,p[2]),
            'vod_remarks': pdfh(it,p[3]),
            };
            if(p.length>5&&p[5]){
                ob.vod_content = pdfh(it,p[5]);
            }
            d.push(ob);
        });
        return JSON.stringify({
        'page': parseInt(searchObj.pg),
        'pagecount': 10,
        'limit': 20,
        'total': 100,
        'list': d,
       });
    }catch(e){
        return '{}'
    }
}

// 以上是内置变量和解析方法

function init(ext) {
}

function home(filter) {
    let homeObj={
    MY_URL=rule.host,
    class_name:rule.class_name||'',
    class_url:rule.class_url||'',
    class_parse:rule.class_parse||'',
    cate_exclude:rule.cate_exclude,
   };
   return homeParse(homeObj);
}

function homeVod(params) {

}

function category(tid, pg, filter, extend) {
   let cateObj={
    url:urljoin(rule.host,rule.url),
    一级:rule.一级,
    tid:tid, 
    pg:pg, 
    filter:filter, 
    extend:extend
    };
    return categoryParse(cateObj)
}

function detail(id) {
}

function play(flag, id, flags) {
}

function search(wd, quick,pg) {
  let searchObj={
    searchUrl:urljoin(rule.host,rule.searchUrl),
    搜索:rule.搜索,
    wd:wd, 
    pg:pg, 
    quick:quick,
 };
 return searchParse(searchObj)
}

export default {
    init: init,
    home: home,
    homeVod: homeVod,
    category: category,
    detail: detail,
    play: play,
    search: search
}