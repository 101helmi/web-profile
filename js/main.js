/* ============================================
   COSMIC PORTFOLIO - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  ThemeManager.init();
  StarsBackground.init();
  MobileMenu.init();
  ScrollReveal.init();
  SmoothScroll.init();
});

/* ---------- Theme Manager (Dark/Light Mode) ---------- */
const ThemeManager = {
  init() {
    this.toggle = document.querySelector('.theme-toggle');
    this.body = document.documentElement;
    
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (systemPrefersDark) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
    
    // Toggle event
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },
  
  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },
  
  toggleTheme() {
    const currentTheme = this.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};

/* ---------- Stars Background (Dark Mode Effect) ---------- */
const StarsBackground = {
  init() {
    this.container = document.querySelector('.stars-container');
    if (!this.container) return;
    
    this.createStars();
    this.createShootingStars();
  },
  
  createStars() {
    const starCount = 150;
    const sizes = ['small', 'medium', 'large'];
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]}`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation
      star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
      star.style.setProperty('--delay', `${Math.random() * 3}s`);
      star.style.setProperty('--base-opacity', `${0.3 + Math.random() * 0.5}`);
      
      this.container.appendChild(star);
    }
  },
  
  createShootingStars() {
    const shootingStarCount = 3;
    
    for (let i = 0; i < shootingStarCount; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random starting position (top area)
      shootingStar.style.left = `${Math.random() * 70}%`;
      shootingStar.style.top = `${Math.random() * 30}%`;
      
      // Stagger animations
      shootingStar.style.animationDelay = `${i * 5 + Math.random() * 3}s`;
      
      this.container.appendChild(shootingStar);
    }
  }
};

/* ---------- Mobile Menu ---------- */
const MobileMenu = {
  init() {
    this.toggle = document.querySelector('.menu-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.links = document.querySelectorAll('.nav-link');
    
    if (!this.toggle || !this.menu) return;
    
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking a link
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  },
  
  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
    
    // Animate hamburger
    const spans = this.toggle.querySelectorAll('span');
    if (this.menu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  },
  
  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
    
    const spans = this.toggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
};

/* ---------- Scroll Reveal Animation ---------- */
const ScrollReveal = {
  init() {
    this.elements = document.querySelectorAll('.reveal');
    
    if (this.elements.length === 0) return;
    
    // Initial check
    this.revealOnScroll();
    
    // Scroll event with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.revealOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  },
  
  revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    this.elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }
};

/* ---------- Smooth Scroll for Anchor Links ---------- */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

/* ---------- Active Nav Link on Scroll ---------- */
const ActiveNavOnScroll = {
  init() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (this.sections.length === 0) return;
    
    window.addEventListener('scroll', () => this.updateActiveLink());
  },
  
  updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
};

/* ---------- Navbar Scroll Effect ---------- */
const NavbarScroll = {
  init() {
    this.navbar = document.querySelector('.navbar');
    if (!this.navbar) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.navbar.style.boxShadow = 'var(--shadow-md)';
      } else {
        this.navbar.style.boxShadow = 'none';
      }
    });
  }
};

// Initialize navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
  NavbarScroll.init();
  ActiveNavOnScroll.init();
});

/* ---------- Project Filter (for projects page) ---------- */
const ProjectFilter = {
  init() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    
    if (this.filterBtns.length === 0) return;
    
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.filterProjects(btn));
    });
  },
  
  filterProjects(clickedBtn) {
    const filter = clickedBtn.dataset.filter;
    
    // Update active button
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    // Filter projects
    this.projectCards.forEach(card => {
      const categories = card.dataset.category?.split(',') || [];
      
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }
};

// Initialize project filter if on projects page
document.addEventListener('DOMContentLoaded', function() {
  ProjectFilter.init();
});

/* ---------- Form Validation (for contact page) ---------- */
const ContactForm = {
  init() {
    this.form = document.querySelector('.contact-form');
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },
  
  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (!this.isValidEmail(data.email)) {
      this.showMessage('Please enter a valid email', 'error');
      return;
    }
    
    // Here you would normally send the data to a server
    // For now, we'll just show a success message
    this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    this.form.reset();
  },
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  showMessage(message, type) {
    // Remove existing message
    const existingMsg = this.form.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const msgElement = document.createElement('div');
    msgElement.className = `form-message ${type}`;
    msgElement.textContent = message;
    msgElement.style.cssText = `
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      background: ${type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
      color: ${type === 'success' ? '#22c55e' : '#ef4444'};
      border: 1px solid ${type === 'success' ? '#22c55e' : '#ef4444'};
    `;
    
    this.form.appendChild(msgElement);
    
    // Remove message after 5 seconds
    setTimeout(() => msgElement.remove(), 5000);
  }
};

// Initialize contact form if on contact page
document.addEventListener('DOMContentLoaded', function() {
  ContactForm.init();
});

/* ---------- Typing Effect for Hero (Optional) ---------- */
const TypingEffect = {
  init(element, texts, speed = 100, pause = 2000) {
    this.element = document.querySelector(element);
    if (!this.element) return;
    
    this.texts = texts;
    this.speed = speed;
    this.pause = pause;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    
    this.type();
  },
  
  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.pause;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
};

// Uncomment to enable typing effect
// document.addEventListener('DOMContentLoaded', function() {
//   TypingEffect.init('.hero-subtitle', ['Backend Developer', 'Python Enthusiast', 'Problem Solver']);
// });
