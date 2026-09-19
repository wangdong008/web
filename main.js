// ===== 全局 Toast 提示 =====
function showToast(msg){
    const toast = document.getElementById('toastBox');
    toast.innerText = msg;
    toast.style.display = 'block';
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(()=>{
        toast.style.display = 'none';
    }, 2200);
}

// ===== 本地访问计数 =====
function initVisitCount(){
    let cnt = Number(localStorage.getItem('visit_cnt') || 0);
    cnt += 1;
    localStorage.setItem('visit_cnt', String(cnt));
    document.getElementById('visitCount').innerText = cnt;
}
initVisitCount();

// ===== 昼夜切换 + 本地记忆 =====
const body = document.body;
const toggleBtn = document.getElementById('toggleBtn');
const dateBox = document.getElementById('dateBox');
const themeIcon = document.getElementById('themeIcon');
const ripple = document.getElementById('ripple');

// 读取本地存储主题
const saveTheme = localStorage.getItem('site_theme');
if(saveTheme === 'night'){
    body.classList.remove('day');
    body.classList.add('night');
    themeIcon.textContent = '🌙';
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
            localStorage.setItem('site_theme', 'night');
        }else{
            body.classList.remove('night');
            body.classList.add('day');
            themeIcon.textContent = '☀️';
            localStorage.setItem('site_theme', 'day');
        }
        themeIcon.style.transform = 'rotate(180deg) scale(1)';
        themeIcon.style.opacity = '1';
    }, 220);
}

toggleBtn.onclick = ()=>{
    if(body.classList.contains('day')){
        setTheme('night');
    }else{
        setTheme('day');
    }
};

// ===== 链接折叠切换 =====
const collapseToggle = document.getElementById('collapseToggle');
const linkCollapseBox = document.getElementById('linkCollapseBox');
collapseToggle.onclick = function(){
    linkCollapseBox.classList.toggle('open');
    if(linkCollapseBox.classList.contains('open')){
        collapseToggle.innerText = "📁 收起全部链接";
    }else{
        collapseToggle.innerText = "📂 展开全部链接";
    }
};

// ===== 胶囊链接点击跳转（带动画） =====
document.querySelectorAll('.link-text').forEach(el=>{
    el.addEventListener('click', function(e){
        e.preventDefault();
        const url = this.dataset.url;
        const link = this;
        if(link.classList.contains('clicked')) return;
        link.classList.add('clicked');
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        });
        setTimeout(()=>{
            link.classList.remove('clicked');
        }, 220);
    });
});

// ===== 手机/电脑视图切换 =====
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

// ===== 图片放大弹窗 =====
const zoomImages = document.querySelectorAll('[data-big]');
const modal = document.getElementById('imgModal');
const bigImg = document.getElementById('bigImg');
const closeBtn = document.querySelector('.modal-close');
zoomImages.forEach(img=>{
    img.addEventListener('click', ()=>{
        bigImg.src = img.dataset.big;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});
closeBtn.addEventListener('click', ()=>{
    modal.style.display = 'none';
    document.body.style.overflow = '';
});
modal.addEventListener('click', (e)=>{
    if(e.target === modal){
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// ===== 复制链接按钮 =====
document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click', async function(){
        const url = this.previousElementSibling.dataset.url;
        try{
            await navigator.clipboard.writeText(url);
            showToast('✅ 链接已复制');
        }catch(err){
            const ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('✅ 链接已复制');
        }
    });
});

// ===== 微信弹窗逻辑 =====
const wechatModal = document.getElementById('wechatModal');
const openWechatBtn = document.getElementById('openWechatBtn');
const closeWxModal = document.getElementById('closeWxModal');
const copyWxBtn = document.getElementById('copyWxBtn');
const wxNumber = "ZJSM202601";

openWechatBtn.onclick = ()=>{
    wechatModal.style.display = 'flex';
};
closeWxModal.onclick = ()=>{
    wechatModal.style.display = 'none';
};
wechatModal.addEventListener('click', (e)=>{
    if(e.target === wechatModal) wechatModal.style.display = 'none';
});
copyWxBtn.onclick = async ()=>{
    try{
        await navigator.clipboard.writeText(wxNumber);
        showToast('✅ 微信号复制成功');
    }catch(e){
        const ta = document.createElement('textarea');
        ta.value = wxNumber;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✅ 微信号复制成功');
    }
};

// ===== vCard 联系人下载 =====
const downloadVcfBtn = document.getElementById("downloadVcfBtn");
downloadVcfBtn.onclick = function(){
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
N:智捷数码科技;;
FN:智捷数码科技
TEL;CELL:15518707076
NOTE:弱电安防、综合布线、无线组网、智能家居、电脑手机维修，虞城商丘上门服务
END:VCARD`;
    const blob = new Blob([vcfContent], {type:"text/vcard;charset=utf-8"});
    const vcfUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = vcfUrl;
    a.download = "智捷数码科技.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(vcfUrl);
    showToast("📇 联系人文件已下载");
};

// ===== 原生页面分享 =====
const sharePageBtn = document.getElementById("sharePageBtn");
sharePageBtn.onclick = async function(){
    const shareData = {
        title: "智捷数码科技",
        text: "弱电安防｜综合布线｜无线组网｜上门服务",
        url: location.href
    };
    try{
        if(navigator.share){
            await navigator.share(shareData);
            showToast("分享唤起成功");
        }else{
            await navigator.clipboard.writeText(location.href);
            showToast("⚠️ 浏览器不支持分享，已复制页面链接");
        }
    }catch(err){
        showToast("分享已取消");
    }
};
