# 智捷数码科技 - 电子名片导航站

纯前端单页应用，无需后端，可直接部署到 GitHub Pages / Cloudflare Pages / Vercel。

## ✨ 功能特性

- 🌓 昼夜模式切换（自动记忆用户选择）
- 📢 顶部公告栏（可随时修改文字）
- 📞 手机号一键拨打
- 📋 链接一键复制 + Toast 弹窗反馈
- 📂 链接折叠/展开（一帆风顺永久显示，其余默认收起）
- 💬 微信号一键复制
- 🗺 高德地图一键导航到店
- 📇 vCard 联系人文件下载（一键保存到手机通讯录）
- 🔗 原生分享（唤起微信/QQ等系统分享面板）
- 🖼 图片点击放大查看
- 📱 手机/电脑视图切换
- 🔢 本地访问计数（纯浏览器，不上传服务器）
- 📱 全响应式适配手机/平板/电脑

## 📁 文件结构

```
zj-digital-nav/
├── index.html      # 主页面结构
├── style.css       # 全部样式（含昼夜主题）
├── main.js         # 全部交互逻辑
└── README.md       # 项目说明
```

## 🚀 部署到 GitHub Pages

### 方法一：直接上传（最简单）

1. 在 GitHub 新建仓库，命名为 `你的用户名.github.io`（个人主页仓库）或任意名字
2. 把这三个文件上传到仓库根目录
3. 进入仓库 → Settings → Pages
4. Source 选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`
5. 保存后等待 1-2 分钟，访问 `https://你的用户名.github.io/仓库名/`

### 方法二：Git 命令行

```bash
cd zj-digital-nav
git init
git add .
git commit -m "init: 智捷数码导航站"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

然后到 GitHub 仓库 Settings → Pages 开启即可。

## ☁️ 部署到 Cloudflare Pages

1. 登录 Cloudflare Dashboard → Workers & Pages → Create → Pages
2. 选择 `Connect to Git`，绑定你的 GitHub 仓库
3. 构建设置全部留空（纯静态，无需构建命令）
4. 部署完成后会分配一个 `xxx.pages.dev` 域名
5. 可在 Custom domains 绑定自己的域名

## ✏️ 自定义修改点

### 修改手机号
打开 `index.html`，搜索 `15518707076`，替换为你的真实手机号（两处：`<a href="tel:...">` 和 vCard 里）。

### 修改微信号
打开 `main.js`，搜索 `wxNumber = "ZJSM202601"`，替换为你的真实微信号。

### 修改公告文字
打开 `index.html`，搜索 `notice-box` 这个 div，修改里面的文字即可。

### 修改导航链接
打开 `index.html`，在 `<ul>` 标签内找到对应条目，修改 `data-url` 属性和显示文字。

### 修改高德导航坐标
打开 `index.html`，搜索 `position=115.871,34.412`，替换为你店铺的真实经纬度。
获取坐标方法：高德地图 → 搜索店铺 → 右键选"这是哪儿" → 复制经纬度。

### 修改营业时间/服务区域
打开 `index.html`，搜索 `service-info` 这个 div，直接修改文字。

## 📝 技术说明

- 纯 HTML + CSS + JavaScript，零依赖
- 所有数据存储在浏览器 localStorage（主题记忆、访问计数）
- 链接打开使用 `window.open` 新标签页
- 复制功能优先使用 `navigator.clipboard`，旧浏览器自动降级 `execCommand`
- 分享功能使用 Web Share API，不支持的浏览器自动降级复制链接

## 📄 License

© 2026 智捷数码科技 版权所有｜虞城县智捷数码科技商行
