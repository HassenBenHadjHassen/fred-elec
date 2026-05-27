/**
 * FRED' ELEC — Main Website Scripts
 * Dynamic behaviors, animations, filters, and templates.
 */

(function () {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initAnimatedCounters();
    initFaqAccordion();
    initPortfolioFilter();
    initContactFormValidation();
  });

  /**
   * ── HEADER & NAVIGATION DRAWER ──
   */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    
    // Add scroll class to header
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile Hamburger & Drawer Controls
    const hamBtn = document.querySelector('.nav-ham');
    const closeBtn = document.querySelector('.drawer-close');
    const drawer = document.getElementById('mobileDrawer');
    
    if (hamBtn && drawer) {
      const toggleDrawer = (open) => {
        hamBtn.setAttribute('aria-expanded', String(open));
        drawer.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      };

      hamBtn.addEventListener('click', () => toggleDrawer(true));
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleDrawer(false));
      }

      // Close drawer on links click
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
      });

      // Close drawer on resize to desktop view
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && drawer.classList.contains('open')) {
          toggleDrawer(false);
        }
      });
    }
  }

  /**
   * ── SCROLL REVEAL (FADE-IN EFFECTS) ──
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .stagger');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback if IntersectionObserver not supported
      revealElements.forEach(el => el.classList.add('in'));
    }
  }

  /**
   * ── STATS COUNTER ANIMATION ──
   */
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          
          const el = entry.target;
          const targetValue = parseFloat(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800; // Animation duration in ms
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Cubic easeOut deceleration
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(targetValue * ease);
            
            el.textContent = currentValue + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = targetValue + suffix;
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => counterObserver.observe(counter));
    } else {
      // Fallback
      counters.forEach(counter => {
        const val = counter.getAttribute('data-count');
        const suf = counter.getAttribute('data-suffix') || '';
        counter.textContent = val + suf;
      });
    }
  }

  /**
   * ── FAQ ACCORDION SLIDE-TOGGLE ──
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      
      if (!question || !answer) return;

      // Set initial state
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close other open accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.faq-a').style.maxHeight = '0';
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          // Add extra padding to scrollHeight so text doesn't overflow
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * ── PORTFOLIO FILTER SYSTEM ──
   */
  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const cards = document.querySelectorAll('.portfolio-card-wrap');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          
          if (filter === 'all' || cat === filter) {
            card.style.display = 'block';
            // Subtle entrance animation
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /**
   * ── CONTACT FORM CLIENT-SIDE VALIDATION ──
   */
  function initContactFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('.form-control[required]');
      
      inputs.forEach(input => {
        // Reset custom borders
        input.style.borderColor = '';

        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444'; // Red border
        } else if (input.type === 'email') {
          // Simple email check
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(input.value.trim())) {
            isValid = false;
            input.style.borderColor = '#ef4444';
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
        // Display validation feedback
        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'form-feedback';
          feedback.style.color = '#ef4444';
          feedback.style.fontSize = '0.85rem';
          feedback.style.marginTop = '1rem';
          feedback.style.fontFamily = 'var(--display)';
          feedback.style.fontWeight = '600';
          form.appendChild(feedback);
        }
        feedback.textContent = 'Veuillez remplir correctement tous les champs obligatoires.';
      }
    });
  }

})();
