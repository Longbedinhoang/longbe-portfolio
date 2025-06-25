// Component Loader - Load HTML components into the main page
class ComponentLoader {
    static async loadComponent(componentPath, targetId) {
        try {
            const response = await fetch(componentPath);
            const html = await response.text();
            document.getElementById(targetId).innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
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
    }
}

// Navigation Manager - Handle scrollspy and smooth scrolling
class NavigationManager {
    static init() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        
        this.bindEvents();
        this.updateActiveNav();
    }

    static bindEvents() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Update active state
                this.navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Throttled scroll event listener
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }

    static updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        let activeSection = 'home';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Update navigation active state
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});
