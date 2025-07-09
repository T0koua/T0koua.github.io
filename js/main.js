// Lógica principal do site

function renderContent(config) {
    document.title = config.settings.title;
    document.getElementById('footer-text').textContent = config.settings.footer;
    
    document.getElementById('banner-container').innerHTML = `<img id="banner-img" src="${config.images.banner}" alt="Banner" class="w-full h-full object-cover object-center" onerror="this.style.display='none'">`;
    document.getElementById('profile-pic-container').innerHTML = `<img src="${config.images.profile}" alt="Foto de Perfil" class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-900 shadow-xl" onerror="this.style.display='none'">`;
    
    document.getElementById('profile-name').textContent = config.personal.name;
    document.getElementById('profile-quote').textContent = `"${config.personal.quote}"`;

    const socialContainer = document.getElementById('social-links');
    socialContainer.innerHTML = Object.entries(config.social).map(([key, value]) => `
        <a href="${value}" target="_blank" rel="noopener noreferrer" class="transition-transform hover:scale-110" title="${key.charAt(0).toUpperCase() + key.slice(1)}">
            <i data-feather="${key === 'discord' ? 'message-square' : key}" class="w-7 h-7 text-main hover:text-white"></i>
        </a>`).join('');

    const infoContainer = document.getElementById('personal-info');
    infoContainer.innerHTML = Object.entries(config.personal)
        .filter(([key]) => !['name', 'quote'].includes(key))
        .map(([key, value]) => `<div><h3 class="font-bold text-main">${key.charAt(0).toUpperCase() + key.slice(1)}</h3><p>${value}</p></div>`).join('');

    const setupContainer = document.getElementById('setup-list');
    setupContainer.innerHTML = Object.entries(config.setup).map(([key, value]) => `<li><strong class="text-main">${key}:</strong> ${value}</li>`).join('');

    const favoritesContainer = document.getElementById('favorites-grid');
    favoritesContainer.innerHTML = Object.entries(config.favorites).map(([category, items]) => `
        <div>
            <h3 class="font-bold text-lg mb-2 text-main">${category}</h3>
            <ul class="list-disc list-inside text-sm space-y-1">${items.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>`).join('');

    const curiositiesContainer = document.getElementById('curiosities-list');
    curiositiesContainer.innerHTML = config.curiosities.map(item => `<li>${item}</li>`).join('');

    const slideshowContainer = document.getElementById('background-slideshow');
    slideshowContainer.innerHTML = config.images.backgrounds.map(src => `<div class="slide" style="background-image: url('${src}');"></div>`).join('');
    
    feather.replace();
}

function initFloatingImages(config) {
    const container = document.getElementById('venti-floating-container');
    const positions = [
        { top: '5%', left: '-15%', width: '170px', delay: '-1s', duration: '12s' },    
        { top: '30%', right: '-18%', width: '200px', delay: '-3s', duration: '10s' }, 
        { top: '55%', left: '-12%', width: '160px', delay: '-5s', duration: '13s' },  
        { top: '80%', right: '-15%', width: '180px', delay: '-2s', duration: '11s' },  
        { top: '10%', right: '-10%', width: '150px', delay: '-6s', duration: '14s' }, 
        { top: '90%', left: '-10%', width: '210px', delay: '-4s', duration: '9s' },
        { top: '45%', left: '-20%', width: '165px', delay: '-8s', duration: '15s' },
        { top: '65%', right: '-22%', width: '175px', delay: '-7s', duration: '11s' },
        { top: '20%', left: '-10%', width: '190px', delay: '-9s', duration: '10s' },
        { top: '95%', right: '-12%', width: '155px', delay: '-11s', duration: '13s' }
    ];
    config.images.floating.forEach((src, i) => {
        const pos = positions[i % positions.length];
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Venti flutuando';
        img.className = 'suspended-venti';
        img.style.cssText = `top: ${pos.top}; left: ${pos.left || 'auto'}; right: ${pos.right || 'auto'}; width: ${pos.width}; animation-delay: ${pos.delay}; animation-duration: ${pos.duration};`;
        img.onerror = () => img.style.display = 'none';
        container.appendChild(img);
        initDraggable(img);
    });
}

function initDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    function onPointerDown(e) {
        e.preventDefault();
        isDragging = true;
        element.classList.add("is-dragging");

        startX = e.clientX;
        startY = e.clientY;
        
        const style = window.getComputedStyle(element);
        initialLeft = parseFloat(style.left) || 0;
        initialTop = parseFloat(style.top) || 0;
        
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
        element.style.right = 'auto'; 
    }

    function onPointerUp() {
        isDragging = false;
        element.classList.remove("is-dragging");
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
    }

    element.addEventListener("pointerdown", onPointerDown);
}

function initThreeJS() {
    let scene, camera, renderer, stars;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xa7f3d0, size: 0.7 });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    const animate = () => { requestAnimationFrame(animate); stars.rotation.z += 0.00015; renderer.render(scene, camera); };
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    const onMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        camera.position.x += (mouseX - camera.position.x) * 0.005;
        camera.position.y += (mouseY - camera.position.y) * 0.005;
        camera.lookAt(scene.position);
    };
    window.addEventListener('resize', onResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    animate();
}

function initScrollObserver() {
    const observer = new IntersectionObserver((e) => { e.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'))}, { threshold: 0.2 });
    document.querySelectorAll('.hidden-section').forEach(el => observer.observe(el));
}

function initBannerParallax() {
    window.addEventListener('scroll', () => {
        const bannerImg = document.getElementById('banner-img');
        if (bannerImg) bannerImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderContent(siteConfig);
    initFloatingImages(siteConfig);
    initThreeJS();
    initScrollObserver();
    initBannerParallax();
}); 
