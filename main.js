// ===== 昼夜切换 + 日期显示 =====
const body = document.body;
const toggleBtn = document.getElementById('toggleBtn');
const dateBox = document.getElementById('dateBox');
const themeIcon = document.getElementById('themeIcon');
const ripple = document.getElementById('ripple');
function getWeek(){
  const w = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const d = new Date();
  return `${d.getMonth()+1}月${d.getDate()}日 ${w[d.getDay()]}`;
}
dateBox.innerText = getWeek();
function createRipple(){
  ripple.classList.remove('ripple');
  void ripple.offsetWidth;
  ripple.classList.add('ripple');
}
function setTheme(mode){
  createRipple();
  themeIcon.style.transform = 'rotate(0deg) scale(0.6)';
  themeIcon.style.opacity = '0';
  setTimeout(()=>{
    if(mode === 'night'){
      body.classList.remove('day');
      body.classList.add('night');
      themeIcon.textContent = '🌙';
    }else{
      body.classList.remove('night');
      body.classList.add('day');
      themeIcon.textContent = '☀️';
    }
    themeIcon.style.transform = 'rotate(180deg) scale(1)';
    themeIcon.style.opacity = '1';
  },220);
}
toggleBtn.onclick = ()=>{
  if(body.classList.contains('day')){
    setTheme('night');
  }else{
    setTheme('day');
  }
}
//胶囊点击：最快跳转，第一帧渲染动画后立刻打开网页
document.querySelectorAll('.link-text').forEach(el=>{
    el.addEventListener('click',function(e){
        e.preventDefault();
        const url = this.dataset.url;
        const link = this;
        if(link.classList.contains('clicked')) return;
        link.classList.add('clicked');
        // 等待下一渲染帧，动画视觉出现后马上跳转
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                window.open(url,'_blank','noopener,noreferrer');
            })
        });
        setTimeout(()=>{
            link.classList.remove('clicked');
        },220);
    })
})
// ===== 原有功能 =====
const params = new URLSearchParams(location.search);
const view = params.get('view');
const box = document.getElementById('mainBox');
const btnM = document.getElementById('btnMobile');
const btnD = document.getElementById('btnDesktop');
if(view === 'desktop'){
    box.classList.add('desktop-view');
    btnD.classList.add('active');
}else{
    btnM.classList.add('active');
}
const zoomImages = document.querySelectorAll('[data-big]');
const modal = document.getElementById('imgModal');
const bigImg = document.getElementById('bigImg');
const closeBtn = document.querySelector('.modal-close');
zoomImages.forEach(img=>{
    img.addEventListener('click',()=>{
        bigImg.src = img.dataset.big;
        modal.style.display = 'flex';
        document.body.style.overflow='hidden';
    })
})
closeBtn.addEventListener('click',()=>{
    modal.style.display='none';
    document.body.style.overflow='';
});
modal.addEventListener('click',(e)=>{
    if(e.target === modal){
        modal.style.display='none';
        document.body.style.overflow='';
    }
});
document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
        const url = this.previousElementSibling.dataset.url;
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position='fixed';
        ta.style.left='-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const oldText = btn.innerText;
        btn.innerText='已复制';
        setTimeout(()=>{btn.innerText=oldText;},1200);
    })
})
