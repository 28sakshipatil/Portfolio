// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Hamburger menu toggle
        hamburger.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        this.animateHamburger(true);
        this.isMenuOpen = true;
    }

    closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        this.animateHamburger(false);
        this.isMenuOpen = false;
    }

    animateHamburger(isOpen) {
        const bars = hamburger.querySelectorAll('.bar');
        if (isOpen) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        navbar.style.background = scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = scrolled 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(15, 23, 42, 0.95)';
        }
    }

    updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Smooth Scrolling Manager
class ScrollManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });

        // Smooth scroll for CTA buttons
        const ctaButtons = document.querySelectorAll('a[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });
    }

    scrollToSection(targetSection) {
        const navHeight = navbar.offsetHeight;
        const targetPos = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
        this.addScrollAnimations();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, options);
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll(`
            .about-content > *,
            .skill-category,
            .timeline-item,
            .project-card,
            .contact-content > *
        `);

        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }

    addScrollAnimations() {
        // Parallax effect for floating shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add floating label effect
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    handleInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    handleInputBlur(input) {
        if (!input.value.trim()) {
            input.parentElement.classList.remove('focused');
        }
    }

    showSuccessMessage() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Message sent successfully!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat h3');
        this.init();
    }

    init() {
        if (this.counters.length > 0) {
            this.createObserver();
        }
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const text = counter.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current) + suffix;
            
            if (current >= number) {
                counter.textContent = text;
                clearInterval(timer);
            }
        }, 40);
    }
}

// Typing Effect for Hero Section
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.texts = [
            'Full Stack Developer',
            'UI/UX Designer', 
            'Problem Solver',
            'Creative Thinker'
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle Background Effect
class ParticleBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#8B5CF6';
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    new ScrollManager();
    new AnimationManager();
    new ContactFormManager();
    new StatsCounter();
    new TypingEffect();
    new ParticleBackground();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    console.log('🎉 Portfolio loaded successfully!');
});

// Additional CSS for notifications and loading states
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
    border-left: 4px solid var(--primary-color);
    transform: translateX(400px);
    transition: all 0.3s ease;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification.success {
    border-left-color: #10B981;
}

.notification.success i {
    color: #10B981;
}

.notification.show {
    transform: translateX(0);
}

body.loaded {
    opacity: 1;
}

body {
    opacity: 0;
    transition: opacity 0.5s ease;
}

.form-group.focused label {
    top: -0.5rem;
    font-size: 0.8rem;
    color: var(--primary-color);
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.hero-buttons .btn:hover {
    animation: pulse 0.5s ease;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Enhanced scroll reveal animations
class EnhancedScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupElements();
        this.createObserver();
    }

    setupElements() {
        const elementsConfig = [
            {
                selector: '.hero-text > *',
                delay: 100,
                direction: 'up'
            },
            {
                selector: '.profile-card',
                delay: 200,
                direction: 'right'
            },
            {
                selector: '.about-stats .stat',
                delay: 150,
                direction: 'up'
            },
            {
                selector: '.hobby-item',
                delay: 100,
                direction: 'scale'
            },
            {
                selector: '.skill-item',
                delay: 50,
                direction: 'scale'
            },
            {
                selector: '.timeline-item',
                delay: 200,
                direction: 'left'
            },
            {
                selector: '.project-card',
                delay: 200,
                direction: 'up'
            }
        ];

        elementsConfig.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.transitionDelay = `${index * config.delay}ms`;
                
                switch (config.direction) {
                    case 'up':
                        element.style.transform = 'translateY(50px)';
                        break;
                    case 'down':
                        element.style.transform = 'translateY(-50px)';
                        break;
                    case 'left':
                        element.style.transform = 'translateX(-50px)';
                        break;
                    case 'right':
                        element.style.transform = 'translateX(50px)';
                        break;
                    case 'scale':
                        element.style.transform = 'scale(0.8)';
                        break;
                }
                
                this.elements.push({
                    element,
                    config,
                    revealed: false
                });
            });
        });
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elementData = this.elements.find(
                        item => item.element === entry.target
                    );
                    
                    if (elementData && !elementData.revealed) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = elementData.config.direction === 'scale' 
                            ? 'scale(1)' 
                            : 'translate(0, 0)';
                        elementData.revealed = true;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(item => {
            observer.observe(item.element);
        });
    }
}

// Mouse cursor effect
class CursorEffect {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
        `;

        // Cursor follower
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'cursor-follower';
        this.cursorFollower.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.5;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }

    bindEvents() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            this.cursor.style.left = mouseX - 4 + 'px';
            this.cursor.style.top = mouseY - 4 + 'px';
        });

        // Smooth follower animation
        const animateFollower = () => {
            const distX = mouseX - followerX;
            const distY = mouseY - followerY;

            followerX += distX * 0.1;
            followerY += distY * 0.1;

            this.cursorFollower.style.left = followerX - 15 + 'px';
            this.cursorFollower.style.top = followerY - 15 + 'px';

            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hover effects
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .skill-item, .hobby-item'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform = 'scale(1.5)';
                this.cursorFollower.style.opacity = '0.2';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
                this.cursorFollower.style.opacity = '0.5';
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '0.5';
        });
    }
}

// Page transition effects
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        this.createPageLoader();
        this.bindEvents();
    }

    createPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <div class="logo-animation"></div>
                </div>
                <div class="loader-text">Loading...</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: all 0.5s ease;
        `;

        document.body.appendChild(loader);

        // Simulate loading
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 1500);
    }

    bindEvents() {
        // Add transition effects for internal navigation
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add transition effect here if needed
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.debounceScrollEvents();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    debounceScrollEvents() {
        let scrollTimer;
        const originalScroll = window.onscroll;
        
        window.onscroll = function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (originalScroll) originalScroll();
            }, 16); // ~60fps
        };
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    // Add small delay to ensure all elements are ready
    setTimeout(() => {
        new EnhancedScrollReveal();
        
        // Only add cursor effect on non-touch devices
        if (!('ontouchstart' in window)) {
            new CursorEffect();
        }
        
        new PageTransitions();
        new PerformanceOptimizer();
    }, 100);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Add keyboard accessibility
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            const navigationManager = new NavigationManager();
            navigationManager.closeMenu();
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

console.log('🚀 Enhanced Portfolio JavaScript loaded successfully!');