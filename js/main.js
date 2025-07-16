// Mobile Detection Function
function isMobileDevice() {
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile keywords in user agent
    const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
    
    // Check screen width (mobile typically < 768px)
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    // Check touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return mobileKeywords.test(userAgent) || screenWidth < 768 || hasTouch;
}

// Disable Hero Section on Mobile
function disableHeroSectionOnMobile() {
    if (isMobileDevice()) {
        // Hide hero section
        const heroContainer = document.getElementById('hero-container');
        if (heroContainer) {
            heroContainer.style.display = 'none';
        }
        
        // Hide hero loading overlay
        const heroLoading = document.getElementById('hero-loading');
        if (heroLoading) {
            heroLoading.style.display = 'none';
        }
        
        // Hide scroll indicator if it exists
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.display = 'none';
        }
        
        // Adjust body padding/margin if needed (remove hero space)
        document.body.style.paddingTop = '0';
        
        console.log('Hero section disabled on mobile device');
        return true;
    }
    return false;
}

// Video Darkening Effect on Scroll
function initVideoScrollEffect() {
    // Skip if mobile device
    if (isMobileDevice()) return;
    
    const heroVideo = document.querySelector('.hero-bg-fixed');
    const heroVideoOverlay = document.querySelector('.hero-bg-fixed::after');
    
    if (!heroVideo) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Tính toán opacity dựa trên vị trí scroll
        // Từ 0 đến 100vh scroll, opacity tăng từ 0 đến 0.7
        const opacity = Math.min(scrollY / windowHeight * 0.7, 0.7);
        
        // Áp dụng overlay tối
        heroVideo.style.setProperty('--overlay-opacity', opacity);
        
        // Hoặc sử dụng filter brightness
        const brightness = Math.max(1 - (scrollY / windowHeight * 0.5), 0.5);
        heroVideo.querySelector('iframe').style.filter = `brightness(${brightness})`;
    });
}

// Hide Hero Loading
function hideHeroLoading() {
    const loadingOverlay = document.getElementById('hero-loading');
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// Vimeo Player Ready Handler
window.addEventListener('message', function(event) {
    if (event.data && typeof event.data === 'string') {
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'ready') {
                hideHeroLoading();
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }
});

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
        // Prepare components to load
        const componentsToLoad = [
            this.loadComponent('components/Header.html', 'header-container'),
            this.loadComponent('pages/SelectedWorksSection.html', 'works-container'),
            this.loadComponent('pages/VisualGallerySection.html', 'gallery-container'),
            this.loadComponent('components/Footer.html', 'footer-container'),
            this.loadComponent('components/VideoOverlay.html', 'video-overlay-container')
        ];
        
        // Only load hero section if not on mobile
        if (!isMobileDevice()) {
            componentsToLoad.push(this.loadComponent('pages/HeroSection.html', 'hero-container'));
        }
        
        // Load all components
        await Promise.all(componentsToLoad);
        
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
  // Function to extract YouTube video ID from embed URL
  function extractYouTubeVideoId(url) {
    // Handle both embed URLs and regular URLs, with or without parameters
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  
  // Function to open YouTube app on mobile
  function openYouTubeApp(videoId) {
    console.log('Opening YouTube app for video:', videoId);
    const youtubeAppUrl = `youtube://watch?v=${videoId}`;
    const youtubeWebUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Try to open YouTube app first
    window.location.href = youtubeAppUrl;
    
    // Fallback to web version after a short delay if app doesn't open
    setTimeout(() => {
      window.open(youtubeWebUrl, '_blank');
    }, 500);
  }
  
  // Hàm mở overlay với src động (desktop only)
  function openVideoOverlay(videoSrc) {
    var overlay = document.getElementById('video-overlay');
    var iframe = overlay.querySelector('iframe');
    overlay.classList.add('active');
    iframe.src = videoSrc;
    document.body.classList.add('video-overlay-open');
    
    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
  }
  
  // Hàm đóng overlay và dừng video
  function closeVideoOverlay() {
    var overlay = document.getElementById('video-overlay');
    var iframe = overlay.querySelector('iframe');
    overlay.classList.remove('active');
    iframe.src = '';
    document.body.classList.remove('video-overlay-open');
    
    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
  }
  
  // Handle escape key
  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      closeVideoOverlay();
    }
  }
  
  // Gán sự kiện cho nút đóng và overlay backdrop
  function setupVideoOverlayEvents() {
    var overlay = document.getElementById('video-overlay');
    var closeBtn = document.getElementById('close-video-overlay');
    var backdrop = overlay.querySelector('.video-overlay-backdrop');
    
    if (closeBtn && overlay) {
      closeBtn.onclick = closeVideoOverlay;
      
      // Click on backdrop to close
      if (backdrop) {
        backdrop.onclick = closeVideoOverlay;
      }
    }
  }
  
  // Gán sự kiện cho các thumbnail video với mobile detection
  function setupAllVideoThumbs() {
    var thumbs = document.querySelectorAll('[data-video-src]');
    thumbs.forEach(function(thumb) {
      thumb.onclick = function() {
        var src = thumb.getAttribute('data-video-src');
        
        // Check if mobile device
        if (isMobileDevice()) {
          // Extract video ID and open YouTube app
          var videoId = extractYouTubeVideoId(src);
          if (videoId) {
            openYouTubeApp(videoId);
          }
        } else {
          // Desktop: open video overlay
          openVideoOverlay(src);
        }
      };
    });
  }
  // Khởi tạo
  function initVideoOverlay() {
    // Only setup overlay events for desktop
    if (!isMobileDevice()) {
      setupVideoOverlayEvents();
    }
    setupAllVideoThumbs();
  }
  
  // Đảm bảo chạy sau khi DOM và component đã render
  function waitForDOM() {
    // For mobile, we don't need to wait for video-overlay element
    if (isMobileDevice()) {
      initVideoOverlay();
    } else if (document.getElementById('video-overlay')) {
      initVideoOverlay();
    } else {
      setTimeout(waitForDOM, 100);
    }
  }
  
  // Wait for components to load before initializing
  setTimeout(waitForDOM, 500);
  
  // Export global để bạn có thể gọi openVideoOverlay(src) ở bất kỳ đâu
  window.openVideoOverlay = openVideoOverlay;
  window.openYouTubeApp = openYouTubeApp;
})();

// --- Lấy title video YouTube và cập nhật vào .work-hover-text ---
function fetchYouTubeTitle(videoId, elId) {
  fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + videoId)
    .then(res => res.json())
    .then(data => {
      var el = document.getElementById(elId);
      if (el && data.title) {
        el.textContent = data.title;
        // Đảm bảo title xuống dòng nếu quá dài (phòng trường hợp CSS bị ghi đè)
        el.style.whiteSpace = 'normal';
        el.style.wordBreak = 'break-word';
        el.style.fontSize = '0.95rem';
        el.style.lineHeight = '1.3';
        el.style.textAlign = 'center';
        el.style.maxWidth = '95%';
        el.style.margin = '0 auto';
      }
    });
}
///call video titles
fetchYouTubeTitle('8JncZmV0Ov0', 'work-video-1-title');
fetchYouTubeTitle('buAZBDrp1t0', 'work-video-2-title');
fetchYouTubeTitle('6URs9GMbSf8', 'work-video-3-title');
fetchYouTubeTitle('oRlVs-3AuxE', 'work-video-4-title');
fetchYouTubeTitle('XyMhh_qggus', 'work-video-5-title');
fetchYouTubeTitle('Tj9cdjSxh88', 'work-video-6-title');

// Scroll Indicator Click Handler
function initScrollIndicator() {
    // Skip if mobile device
    if (isMobileDevice()) return;
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const selectedWorksSection = document.querySelector('.selected-works-section');
            if (selectedWorksSection) {
                selectedWorksSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
}

// Gallery Image Sizing
function initGalleryImageSizing() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        img.onload = function() {
            // Hiển thị ảnh 100% không crop, div sẽ theo kích thước ảnh
            this.style.width = '100%';
            this.style.height = 'auto';
            this.style.objectFit = 'contain';
            this.style.display = 'block';
            
            // Đặt kích thước div theo ảnh
            item.style.width = 'auto';
            item.style.height = 'auto';
        };
        
        // Trigger onload if image is already loaded
        if (img.complete) {
            img.onload();
        }
    });
}

// Gallery Expand Handler
function initGalleryExpand() {
    const gallerySection = document.querySelector('.visual-gallery-section');
    const expandIndicator = document.querySelector('.gallery-expand-indicator');
    
    if (expandIndicator && gallerySection) {
        expandIndicator.addEventListener('click', () => {
            gallerySection.classList.add('expanded');
            expandIndicator.classList.add('hidden');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if mobile device
    const isMobile = isMobileDevice();
    
    ComponentLoader.loadAllComponents();
    // Initialize video scroll effect after components load
    setTimeout(() => {
        if (!isMobile) {
            initVideoScrollEffect();
            initScrollIndicator();
        }
        initGalleryImageSizing();
        initGalleryExpand();
    }, 500);
});
