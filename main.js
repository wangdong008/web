const body = document.body;
const toggleBtn = document.getElementById('toggleBtn');
const dateBox = document.getElementById('dateBox');
const themeIcon = document.getElementById('themeIcon');
const ripple = document.getElementById('ripple');
const countTip = document.getElementById('countTip');
const countText = document.getElementById('countText');
const pauseBtn = document.getElementById('pauseBtn');

// 自动关闭总时长：10秒
const AUTO_CLOSE_DELAY = 10000;
let autoCloseTimer = null;
let activeOpenItem = null;
let countDownTimer = null;
let remainSec = 10;
let isPaused = false;

function hideCountTip(){
    countTip.style.display = 'none';
}
function showCountTip(sec){
    countText.innerText = `⏱ 剩余：${sec}秒`;
    countTip.style.display = 'flex';
}

function resetAutoTimer(item){
    if(autoCloseTimer) clearTimeout(autoCloseTimer);
    if(countDownTimer) clearInterval(countDownTimer);
    activeOpenItem = item;
    remainSec = 10;
    isPaused = false;
    pauseBtn.innerText = "暂停";
    showCountTip(remainSec);

    countDownTimer = setInterval(()=>{
        if(isPaused) return;
        remainSec -=1;
        showCountTip(remainSec);
        if(remainSec <=0){
            clearInterval(countDownTimer);
        }
    },1000);

    autoCloseTimer = setTimeout(()=>{
        if(isPaused) return;
        if(activeOpenItem){
            activeOpenItem.open = false;
        }
        hideCountTip();
        if(countDownTimer) clearInterval(countDownTimer);
        autoCloseTimer = null;
        activeOpenItem = null;
        isPaused = false;
    },AUTO_CLOSE_DELAY);
}

function clearAutoTimer(){
    if(autoCloseTimer) clearTimeout(autoCloseTimer);
    if(countDownTimer) clearInterval(countDownTimer);
    autoCloseTimer = null;
    activeOpenItem = null;
    isPaused = false;
    hideCountTip();
}

pauseBtn.onclick = ()=>{
    isPaused = !isPaused;
    if(isPaused){
        pauseBtn.innerText = "恢复计时";
        countText.innerText = "⏸ 已暂停，永久保持展开";
    }else{
        pauseBtn.innerText = "暂停";
        remainSec =10;
        showCountTip(remainSec);
    }
}

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

//监听折叠展开收起
document.querySelectorAll('.fold-item').forEach(item=>{
    item.addEventListener('toggle',()=>{
        if(item.open){
            resetAutoTimer(item);
        }else{
            clearAutoTimer();
        }
    })
})

//点击链接、复制、修改，只有非暂停状态重置倒计时
document.querySelectorAll('.link-text,.copy-btn,.edit-btn').forEach(el=>{
    el.addEventListener('click',()=>{
        if(activeOpenItem && !isPaused){
            resetAutoTimer(activeOpenItem);
        }
    })
})

document.querySelectorAll('.link-text').forEach(el=>{
  el.addEventListener('click',function(e){
    e.preventDefault();
    const url = this.dataset.url;
    const link = this;
    if(link.classList.contains('clicked')) return;
    link.classList.add('clicked');
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

const editModal = document.getElementById('editModal');
const editTitle = document.getElementById('editTitle');
const editUrl = document.getElementById('editUrl');
const editNote = document.getElementById('editNote');
const btnCancel = document.getElementById('btnCancel');
const btnSave = document.getElementById('btnSave');
let currentEditId = null;

document.querySelectorAll('.edit-btn').forEach(btn=>{
  btn.addEventListener('click',function(){
    currentEditId = this.getAttribute('data-edit');
    const item = this.closest('.fold-item');
    const summary = item.querySelector('.fold-summary');
    const linkText = item.querySelector('.link-text');
    const note = item.querySelector('.link-note');

    editTitle.value = summary.textContent.trim();
    editUrl.value = linkText.dataset.url;
    editNote.value = note ? note.textContent.trim() : '';

    editModal.classList.add('show');
  })
})

btnCancel.addEventListener('click',()=>{
  editModal.classList.remove('show');
  currentEditId = null;
})

btnSave.addEventListener('click',()=>{
  if(!currentEditId) return;
  const item = document.querySelector(`[data-edit="${currentEditId}"]`).closest('.fold-item');
  const summary = item.querySelector('.fold-summary');
  const linkText = item.querySelector('.link-text');
  const note = item.querySelector('.link-note');

  if(editTitle.value.trim()){
    summary.textContent = editTitle.value.trim();
  }
  if(editUrl.value.trim()){
    linkText.dataset.url = editUrl.value.trim();
    linkText.textContent = editUrl.value.trim();
  }
  if(note){
    note.textContent = editNote.value.trim();
  }

  editModal.classList.remove('show');
  currentEditId = null;
})
