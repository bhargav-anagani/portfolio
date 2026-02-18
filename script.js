class PortfolioManager {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.activeSection = 'home';
    this.sectionPositions = {};
    this.taxi = document.getElementById('navTaxi');
    this.pathDots = document.getElementById('pathDots');
    this.pathFilled = document.getElementById('navPathFilled');
    this.sectionOrder = [
      'home', 'about', 'education', 'skills', 'projects',
      'coding', 'certifications', 'activities', 'experience',
      'contact'
    ];

    this.init();
    this.initBackground();
  }

  init() {
    this.createNavigationPath();
    this.setupIntersectionObserver();
    this.setupResumeDownload();
    this.setupAnimations();
    this.setupKeyboardNavigation();
    this.setupActiveSection();
    this.updateTaxiPosition();
  }

  initBackground() {
    const canvas = document.getElementById('aiBackground');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.color = `rgba(100, 255, 218, ${Math.random() * 0.5})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(width * height / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.update();
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 - distance / 1000})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(123, 97, 255, ${0.2 - dist / 1500})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const mouse = { x: undefined, y: undefined };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('resize', resize);
    resize();
    animate();
  }

  createNavigationPath() {
    const totalSections = this.sectionOrder.length;
    const container = document.querySelector('.nav-path-container');
    // Ensure container exists
    if (!container) return;

    this.pathDots.innerHTML = '';

    this.sectionOrder.forEach((sectionId, index) => {
      const dot = document.createElement('div');
      dot.className = 'path-dot';
      if (sectionId === 'home') dot.classList.add('active');

      const top = (index / (totalSections - 1)) * 100;
      dot.style.top = `${top}%`;
      dot.dataset.target = sectionId;

      const label = document.createElement('div');
      label.className = 'path-dot-label';
      label.textContent = this.formatSectionName(sectionId);
      dot.appendChild(label);

      dot.addEventListener('click', () => {
        this.scrollToSection(sectionId);
      });

      this.pathDots.appendChild(dot);
    });
  }

  formatSectionName(sectionId) {
    const names = {
      'home': 'Home',
      'about': 'About',
      'education': 'Education',
      'skills': 'Skills',
      'projects': 'Projects',
      'coding': 'Coding',
      'certifications': 'Certifications',
      'activities': 'Activities',
      'experience': 'Experience',
      'contact': 'Contact'
    };
    return names[sectionId] || sectionId;
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.setActiveSection(sectionId);
          this.animateSection(entry.target);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  setupResumeDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.generateResumePDF();
      });
    }
  }

  setupAnimations() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.5}s`;
    });

    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.animateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  animateOnScroll() {
    const scrollY = window.scrollY;
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const currentIndex = this.sectionOrder.indexOf(this.activeSection);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = Math.min(currentIndex + 1, this.sectionOrder.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = this.sectionOrder.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        const nextSection = this.sectionOrder[nextIndex];
        this.scrollToSection(nextSection);
      }
    });
  }

  setupActiveSection() {
    this.setActiveSection('home');
  }

  setActiveSection(sectionId) {
    if (this.activeSection === sectionId) return;

    this.activeSection = sectionId;

    this.sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
      }
    });

    const currentIndex = this.sectionOrder.indexOf(sectionId);

    document.querySelectorAll('.path-dot').forEach((dot, index) => {
      dot.classList.remove('active');
      dot.classList.remove('visited');

      if (dot.dataset.target === sectionId) {
        dot.classList.add('active');
      }
      else if (index < currentIndex) {
        dot.classList.add('visited');
      }
    });

    this.updateTaxiPosition(currentIndex);
  }

  updateTaxiPosition(currentIndex) {
    const activeDot = document.querySelector('.path-dot.active');
    if (activeDot && this.taxi) {
      const top = activeDot.style.top;
      this.taxi.style.top = top;

      if (currentIndex === undefined) {
        currentIndex = this.sectionOrder.indexOf(this.activeSection);
      }
      const total = this.sectionOrder.length - 1;
      const percentage = (currentIndex / total) * 100;

      if (this.pathFilled) {
        this.pathFilled.style.height = `${percentage}%`;
      }
    }
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      this.setActiveSection(sectionId);

      setTimeout(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }

  animateSection(section) {
    section.classList.add('active');

    const animatedElements = section.querySelectorAll('.card, .section-header');
    animatedElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }

  generateResumePDF() {
    const link = document.createElement('a');
    link.href = 'Resume.pdf';
    link.download = 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification('Resume downloaded successfully!');
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(100, 255, 218, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(100, 255, 218, 0.3);
      color: var(--accent-cyan);
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      z-index: 1000;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    });

    setTimeout(() => {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioManager();
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
