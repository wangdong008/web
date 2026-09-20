let globalAllOpen = false;
const allToggleBtn = document.getElementById('allToggle');

function setAllItems(isOpen){
  document.querySelectorAll('.link-item').forEach(item=>{
    const arrowBtn=item.querySelector('.expand-btn');
    if(isOpen){
      item.classList.add('open');
      arrowBtn.classList.add('open');
    }else{
      item.classList.remove('open');
      arrowBtn.classList.remove('open');
      item.querySelector('.edit-panel').classList.remove('open');
    }
  })
}

allToggleBtn.onclick=()=>{
  globalAllOpen=!globalAllOpen;
  setAllItems(globalAllOpen);
  allToggleBtn.innerText= globalAllOpen ? "▼ 全部收起" : "▶ 全部展开";
}

const audio=document.createElement('audio');audio.preload='none';audio.style.display='none';document.body.appendChild(audio);

const clockTag=document.getElementById('clockTag');
const themeBtn=document.getElementById('themeBtn');
const wrap=document.getElementById('wrap');
const pad2=n=>String(n).padStart(2,'0');
function updateClock(){
  const d=new Date();
  const w=['日','一','二','三','四','五','六'];
  clockTag.innerText=`${d.getMonth()+1}月${d.getDate()}日 星期${w[d.getDay()]} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
updateClock();
setInterval(updateClock,5000);

// 定位天气：先取定位，再用 Open-Meteo 取天气、BigDataCloud 反查城市
const weatherTag=document.getElementById('weatherTag');
const WMO_TEXT={0:'晴',1:'晴间多云',2:'多云',3:'阴',45:'雾',48:'雾凇',51:'毛毛雨',53:'毛毛雨',55:'毛毛雨',56:'冻雨',57:'冻雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',71:'小雪',73:'中雪',75:'大雪',77:'小雪',80:'阵雨',81:'中阵雨',82:'大阵雨',85:'阵雪',86:'阵雪',95:'雷阵雨',96:'雷阵雨伴冰雹',99:'强雷阵雨'};
function loadWeather(){
  if(!navigator.geolocation){ weatherTag.innerText='天气不可用'; return; }
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat=pos.coords.latitude, lon=pos.coords.longitude;
    try{
      const [w,city]=await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&current=temperature_2m,weather_code&timezone=auto`).then(r=>r.json()),
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`).then(r=>r.json()).catch(()=>({}))
      ]);
      const t=Math.round(w.current.temperature_2m);
      const txt=WMO_TEXT[w.current.weather_code]||'';
      const place=city.city||city.locality||'当地';
      weatherTag.innerText=`📍 ${place} ${t}° ${txt}`;
    }catch(e){ weatherTag.innerText='天气获取失败'; }
  },()=>{ weatherTag.innerText='未授权定位'; });
}
loadWeather();
themeBtn.onclick=()=>{
  document.body.classList.toggle('day');
  document.body.classList.toggle('night');
  themeBtn.innerText=document.body.classList.contains('night')?'🌙':'☀️';
};
// 分享：调起系统分享面板（可选微信/任意浏览器）；不支持时复制链接
document.getElementById('shareBtn').onclick=async()=>{
  const shareUrl='https://wd.xhihi.art';
  if(navigator.share){
    try{ await navigator.share({title:'智捷数码科技', text:'智捷数码科技', url:shareUrl}); }catch(e){}
  }else{
    try{ await copyToClipboard(shareUrl); alert('链接已复制：'+shareUrl); }
    catch(e){ window.open(shareUrl,'_blank','noopener'); }
  }
};

function copyToClipboard(text){
  return new Promise((resolve)=>{
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(()=>resolve(true)).catch(()=>fallbackCopy(text,resolve));
    }else{
      fallbackCopy(text,resolve);
    }
  })
}
function fallbackCopy(text,resolve){
  const ta=document.createElement('textarea');
  ta.value=text;
  ta.style.position='fixed';
  ta.style.left='-9999px';
  ta.style.top='0px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try{
    document.execCommand('copy');
    resolve(true);
  }catch(e){
    resolve(false);
  }
  document.body.removeChild(ta);
}

const countBox=document.getElementById('countBox'),secDom=document.getElementById('sec'),pauseBtn=document.getElementById('pauseBtn');
let globalTimer=null,remain=10,paused=false;
function resetGlobalTimer(){
  clearInterval(globalTimer);
  remain=10;paused=false;pauseBtn.innerText='暂停';secDom.innerText=remain;
  // 把倒计时块移动到当前打开编辑面板条目的按钮行（铅笔后面）
  const openPanel=document.querySelector('.edit-panel.open');
  if(openPanel){
    const bar=openPanel.closest('.link-item').querySelector('.icon-bar');
    if(bar) bar.appendChild(countBox);
  }
  countBox.classList.add('show');
  globalTimer=setInterval(()=>{
    if(paused)return;
    remain--;secDom.innerText=remain;
    if(remain<=0){
      clearInterval(globalTimer);
      countBox.classList.remove('show');
      document.querySelectorAll('.edit-panel').forEach(p=>p.classList.remove('open'));
      document.querySelectorAll('.expand-btn').forEach(b=>b.classList.remove('open'));
    }
  },1000);
}
pauseBtn.onclick=()=>{paused=!paused;pauseBtn.innerText=paused?'恢复':'暂停';};

const modal=document.getElementById('imgModal'),bigImg=document.getElementById('bigImg');
document.querySelectorAll('[data-big]').forEach(i=>i.onclick=()=>{bigImg.src=i.dataset.big;modal.style.display='flex';document.body.style.overflow='hidden';});
document.querySelector('.modal-close').onclick=()=>{modal.style.display='none';document.body.style.overflow='';};
modal.onclick=e=>e.target===modal&&(modal.style.display='none',document.body.style.overflow='');

const STORAGE_KEY='link_v4';
let store=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');

const defaultData={
  e0:{label:"一帆风顺（导航站）",url:"https://gr.wangdong.cc.cd",note:""},
  e1:{label:"二龙戏珠（导航站）",url:"https://wddh.wangdong.cc.cd",note:""},
  e2:{label:"三头六臂（导航站）",url:"https://wdio.wangdong.cc.cd",note:""},
  e3:{label:"四通八达（导航站）",url:"https://dz.wangdong.cc.cd",note:""},
  e4:{label:"五颜六色（直播源酷9空壳使用）",url:"https://wd.xhihi.art/test.txt",note:""},
  e5:{label:"六六大顺（个人CF网盘）",url:"https://cf.wangdong.cc.cd",note:""},
  e6:{label:"七零八落（直播央卫视）",url:"https://cf.wangdong.cc.cd/zby.txt",note:""},
  e7:{label:"八仙过海（腾讯软件下载无广告）",url:"https://soft.qq.com/",note:""},
  e8:{label:"九九归一（网络测速）",url:"https://www.speedtest.cn/",note:""},
  e9:{label:"十全十美（图吧工具箱查电脑配置）",url:"https://www.tbtool.cn/",note:""},
  e10:{label:"CF网盘每日10G（游客Public）",url:"https://wp.wangdong.cc.cd/",note:""},
  e11:{label:"CF网盘图片（图床）",url:"https://tupian.wangdong.cc.cd/",note:""},
  e12:{label:"IT工具",url:"https://it.wangdong.cc.cd/",note:""},
  e13:{label:"个人博客（网页）",url:"https://bk.wangdong.cc.cd/",note:""}
};

Object.keys(defaultData).forEach(id=>{
  if(!store[id]) store[id]={...defaultData[id]};
  if(!store[id].label) store[id].label=defaultData[id].label;
  if(!store[id].url) store[id].url=defaultData[id].url;
  if(typeof store[id].note==='undefined') store[id].note="";
  if(typeof store[id].noteTouched!=='boolean') store[id].noteTouched=false;
});
localStorage.setItem(STORAGE_KEY,JSON.stringify(store));

// 根据网址自动生成默认简介（未手动编辑过时显示）
const AUTO_NOTES={
  "https://gr.wangdong.cc.cd":"导航站：常用网站快捷入口集合，打开即可一键直达日常要用的网站与服务。",
  "https://wddh.wangdong.cc.cd":"导航站：常用网站分类导航，快速找到需要的网址。",
  "https://wdio.wangdong.cc.cd":"导航站：常用网址导航入口，方便快速跳转常用服务。",
  "https://dz.wangdong.cc.cd":"导航站：常用网址导航，一键直达常用站点。",
  "https://wd.xhihi.art/test.txt":"直播源文件：可导入直播/影视类APP（如酷9空壳）播放，内含节目地址列表。",
  "https://cf.wangdong.cc.cd":"个人CF网盘：存放个人文件，支持分享与直链下载访问。",
  "https://cf.wangdong.cc.cd/zby.txt":"央卫视直播源：央视、卫视节目地址列表，复制到支持的播放器即可观看。",
  "https://soft.qq.com/":"腾讯软件中心：官方软件下载站，无广告插件，安全下载常用电脑软件。",
  "https://www.speedtest.cn/":"网络测速：一键测试当前宽带的上传、下载速度和网络延迟。",
  "https://www.tbtool.cn/":"图吧工具箱：电脑硬件检测工具合集，可查看CPU、显卡、内存等详细配置。",
  "https://wp.wangdong.cc.cd/":"CF网盘（游客模式）：每日10G流量，免登录即可上传和分享文件。",
  "https://tupian.wangdong.cc.cd/":"图片图床：上传图片后自动生成直链，方便在网页、论坛中贴图使用。",
  "https://it.wangdong.cc.cd/":"IT工具集：装机、远程、运维等常用小工具汇总。",
  "https://bk.wangdong.cc.cd/":"个人博客网页：技术笔记与日常记录。"
};
const normUrl=u=>String(u||'').replace(/\/+$/,'');
function autoNoteFor(url,label){
  const u=normUrl(url);
  for(const k in AUTO_NOTES){ if(normUrl(k)===u) return AUTO_NOTES[k]; }
  return "链接："+label+"。点击上方网址即可打开使用。";
}
function effectiveNote(id){
  const s=store[id];
  return s.noteTouched ? (s.note||"") : autoNoteFor(s.url, s.label);
}

document.querySelectorAll('.link-item').forEach(item=>{
  const id=item.dataset.id;
  const btnExpand=item.querySelector('.expand-btn');
  const labelDom=item.querySelector('.label-text');
  const urlDom=item.querySelector('.url-text');
  const btnCopy=item.querySelector('.btn-copy');
  const btnEdit=item.querySelector('.btn-edit');
  const panel=item.querySelector('.edit-panel');
  const noteShow=item.querySelector('.note-show-box');
  const inpL=item.querySelector('.i-label'),inpU=item.querySelector('.i-url');
  const save=item.querySelector('.save-btn'),tip=item.querySelector('.tip-save');
  const noteTextarea=item.querySelector('.i-note');

  labelDom.innerText=store[id].label;
  urlDom.innerText=store[id].url;
  urlDom.dataset.url=store[id].url;
  inpL.value=store[id].label;
  inpU.value=store[id].url;
  noteTextarea.value=effectiveNote(id);
  noteShow.innerText=effectiveNote(id);

  urlDom.onclick=(ev)=>{
    ev.preventDefault();
    urlDom.style.color="#dc2626";
    window.open(urlDom.dataset.url,'_blank','noopener noreferrer');
    setTimeout(()=>{
      if(!document.body.classList.contains('night')) urlDom.style.color="#0269d9";
      else urlDom.style.color="#63a8ff";
    },180);
  };

  function toggleExpand(force){
    const parentItem = item.closest('.link-item');
    const willOpen = (typeof force==='boolean') ? force : !parentItem.classList.contains('open');
    parentItem.classList.toggle('open', willOpen);
    btnExpand.classList.toggle('open', willOpen);
    if(panel.classList.contains('open'))resetGlobalTimer();
  }
  btnExpand.onclick=e=>{
    e.stopPropagation();
    toggleExpand();
  };
  // 点击文字或框架（胶囊背景）也可展开/收起；内部按钮、输入框、链接除外
  const itemWrap=item.querySelector('.item-wrap');
  itemWrap.onclick=e=>{
    const t=e.target;
    if(t.closest('button,a,input,textarea,.icon-bar,.edit-panel,.url-text'))return;
    toggleExpand();
  };
  labelDom.onclick=e=>{
    e.stopPropagation();
    toggleExpand();
  };

  btnEdit.onclick=()=>{
    panel.classList.add('open');
    btnExpand.classList.add('open');
    item.classList.add('open');
    resetGlobalTimer();
  };

  btnCopy.onclick=async()=>{
    const ok=await copyToClipboard(urlDom.dataset.url);
    const o=btnCopy.innerText;
    btnCopy.innerText=ok?'✅':'❌';
    setTimeout(()=>btnCopy.innerText='📋',1200);
  };

  save.onclick=()=>{
    const l=inpL.value.trim(),u=inpU.value.trim();if(!l||!u)return;
    const nt=noteTextarea.value.trim();
    store[id].label=l;
    store[id].url=u;
    store[id].note=nt;
    store[id].noteTouched=true;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(store));
    labelDom.innerText=l;urlDom.innerText=u;urlDom.dataset.url=u;
    noteShow.innerText=nt;
    tip.style.display='block';setTimeout(()=>tip.style.display='none',1200);
    panel.classList.remove('open');
  };

  [inpL,inpU,noteTextarea].forEach(i=>i.oninput=resetGlobalTimer);
});

const list=[{url:"https://cf.wangdong.cc.cd/mp3/Sky.mp3",n:"Sky"},{url:"https://cf.wangdong.cc.cd/mp3/Soul.mp3",n:"Soul"},{url:"https://cf.wangdong.cc.cd/mp3/夏恋.mp3",n:"夏恋"},{url:"https://cf.wangdong.cc.cd/mp3/梦中的婚礼.mp3",n:"梦中的婚礼"},{url:"https://cf.wangdong.cc.cd/mp3/洪荒之力.mp3",n:"洪荒之力"}];
let cur=0,ctrlOpen=false,tipT;
const mFab=document.getElementById('mFab'),mCtrl=document.getElementById('mCtrl'),playBtn=document.getElementById('play'),prevBtn=document.getElementById('prev'),nextBtn=document.getElementById('next'),cBtn=document.getElementById('cBtn'),songTip=document.getElementById('songTip');
const showTip=name=>{clearTimeout(tipT);songTip.innerText='🎵 '+name;songTip.classList.add('show');tipT=setTimeout(()=>songTip.classList.remove('show'),3000);};
const load=i=>{cur=i;audio.src=list[i].url;showTip(list[i].n);};
const play=()=>audio.play().then(()=>{playBtn.textContent='⏸';mFab.classList.add('playing');});
const pause=()=>{audio.pause();playBtn.textContent='▶';mFab.classList.remove('playing');};
mFab.onclick=()=>{ctrlOpen=!ctrlOpen;mCtrl.classList.toggle('open',ctrlOpen);};
cBtn.onclick=()=>{ctrlOpen=false;mCtrl.classList.remove('open');};
playBtn.onclick=()=>audio.paused?play():pause();
nextBtn.onclick=()=>{cur=(cur+1)%list.length;load(cur);play();};
prevBtn.onclick=()=>{cur=(cur-1+list.length)%list.length;load(cur);play();};
audio.onended=()=>{cur=(cur+1)%list.length;load(cur);play();};
load(cur);

// 搜索框：输入即过滤本站链接；回车/点按钮走百度搜索
const searchInput=document.getElementById('searchInput');
const baiduBtn=document.getElementById('baiduBtn');
function applyFilter(){
  const q=searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.link-item').forEach(item=>{
    const label=item.querySelector('.label-text').innerText||'';
    const url=item.querySelector('.url-text').innerText||'';
    const note=item.querySelector('.note-show-box').innerText||'';
    const text=(label+' '+url+' '+note).toLowerCase();
    item.style.display=(!q||text.includes(q))?'':'none';
  });
}
searchInput.addEventListener('input',applyFilter);
function baiduSearch(){
  const q=searchInput.value.trim();
  if(q) window.open('https://www.baidu.com/s?wd='+encodeURIComponent(q),'_blank','noopener');
}
searchInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); baiduSearch(); } });
baiduBtn.onclick=baiduSearch;
