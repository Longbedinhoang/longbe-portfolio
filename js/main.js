// Component Loader - Load HTML components into the main page
class ComponentLoader {
    static async loadComponent(componentPath, targetId) {
        try {
            const response = await fetch(componentPath);
            let html = await response.text();
            
            // Điều chỉnh đường dẫn trong header dựa trên vị trí hiện tại
            if (componentPath.includes('Header.html')) {
                html = this.adjustHeaderPaths(html);
            }
            
            document.getElementById(targetId).innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    }
    
    static adjustHeaderPaths(html) {
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        
        if (isInPagesFolder) {
            // Nếu đang ở trong thư mục pages, đường dẫn đã đúng
            return html;
        } else {
            // Nếu đang ở thư mục gốc, cần điều chỉnh đường dẫn
            return html
                .replace('href="../index.html"', 'href="index.html"')
                .replace('href="../pages/SelectedWorks.html"', 'href="pages/SelectedWorks.html"');
        }
    }

    static highlightCurrentPage() {
        // Highlight trang hiện tại trong navigation
        setTimeout(() => {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if ((currentPath.endsWith('index.html') || currentPath.endsWith('/')) && 
                    (href === 'index.html' || href === '../index.html')) {
                    link.classList.add('active');
                } else if (currentPath.includes('SelectedWorks.html') && 
                          (href === 'pages/SelectedWorks.html' || href === '../pages/SelectedWorks.html')) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    static async loadAllComponents() {
        // Load all components
        await Promise.all([
            this.loadComponent('components/Header.html', 'header-container'),
            this.loadComponent('pages/HeroSection.html', 'hero-container'),
            this.loadComponent('pages/SelectedWorksSection.html', 'works-container'),
            this.loadComponent('pages/VisualGallerySection.html', 'gallery-container'),
            this.loadComponent('components/Footer.html', 'footer-container')
        ]);
        
        // Initialize navigation after components are loaded
        NavigationManager.init();
        this.highlightCurrentPage();
    }
}

// Navigation Manager - Handle basic navigation without scrollspy
class NavigationManager {
    static init() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.bindEvents();
    }

    static bindEvents() {
        // Navigation links: chỉ smooth scroll nếu href bắt đầu bằng '#'
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // Nếu là href='#' thì chặn chuyển trang nhưng không làm gì
                else if (href === '#') {
                    e.preventDefault();
                }
                // Nếu là file .html thì để mặc định chuyển trang
            });
        });
    }
}

// Video Overlay - Handle video overlay functionality
(function() {
  // Hàm mở overlay với src động
  function openVideoOverlay(videoSrc) {
    var overlay = document.getElementById('video-overlay');
    var iframe = overlay.querySelector('iframe');
    overlay.style.display = 'flex';
    iframe.src = videoSrc;
  }
  // Hàm đóng overlay và dừng video
  function closeVideoOverlay() {
    var overlay = document.getElementById('video-overlay');
    var iframe = overlay.querySelector('iframe');
    overlay.style.display = 'none';
    iframe.src = '';
  }
  // Gán sự kiện cho nút đóng và overlay
  function setupVideoOverlayEvents() {
    var overlay = document.getElementById('video-overlay');
    var closeBtn = document.getElementById('close-video-overlay');
    if (closeBtn && overlay) {
      closeBtn.onclick = closeVideoOverlay;
      overlay.onclick = function(e) {
        if (e.target === overlay) closeVideoOverlay();
      };
    }
  }
  // Gán sự kiện cho các thumbnail video
  function setupAllVideoThumbs() {
    var thumbs = document.querySelectorAll('[data-video-src]');
    thumbs.forEach(function(thumb) {
      thumb.onclick = function() {
        var src = thumb.getAttribute('data-video-src');
        openVideoOverlay(src);
      };
    });
  }
  // Khởi tạo
  function initVideoOverlay() {
    setupVideoOverlayEvents();
    setupAllVideoThumbs();
  }
  // Đảm bảo chạy sau khi DOM và component đã render
  function waitForDOM() {
    if (document.getElementById('video-overlay')) {
      initVideoOverlay();
    } else {
      setTimeout(waitForDOM, 200);
    }
  }
  waitForDOM();
  // Export global để bạn có thể gọi openVideoOverlay(src) ở bất kỳ đâu
  window.openVideoOverlay = openVideoOverlay;
})();

// --- Lấy title video YouTube và cập nhật vào .work-hover-text ---
function fetchYouTubeTitle(videoId, elId) {
  fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + videoId)
    .then(res => res.json())
    .then(data => {
      var el = document.getElementById(elId);
      if (el && data.title) el.textContent = data.title;
    });
}
///call video titles
fetchYouTubeTitle('8JncZmV0Ov0', 'work-video-1-title');
fetchYouTubeTitle('buAZBDrp1t0', 'work-video-2-title');
fetchYouTubeTitle('6URs9GMbSf8', 'work-video-3-title');
fetchYouTubeTitle('oRlVs-3AuxE', 'work-video-4-title');
fetchYouTubeTitle('XyMhh_qggus', 'work-video-5-title');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});
