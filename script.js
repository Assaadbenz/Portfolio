/**
 * PORTFOLIO ASSAAD EL MILOUDI - JAVASCRIPT ENHANCEMENTS
 * Fonctionnalités interactives :
 * 1. Effet machine à écrire (Typewriter) dynamique dans le Hero
 * 2. Mode sombre / Mode clair (Dark/Light mode) avec persistance localStorage
 * 3. Navigation fluide avec mise en avant automatique de la section active
 * 4. Animations d'apparition au défilement (Scroll Reveal via IntersectionObserver)
 * 5. Animation dynamique des jauges de langues et compétences
 * 6. Effet 3D Tilt interactif sur les cartes de projets
 * 7. Bouton flottant retour en haut (Back to top)
 * 8. Copie rapide des coordonnées dans le presse-papiers avec notification Toast
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. EFFET MACHINE À ÉCRIRE (TYPEWRITER)
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const words = [
      'Web Moderne & Full-Stack',
      'Systèmes Informatiques',
      'Prompt Engineering & IA',
      'Data Science & Analyse',
      'Réseaux & Télécoms'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 1800;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElement.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterElement.textContent = currentWord.substring(0, charIndex);
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        timeout = delayBetweenWords;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 400;
      }

      setTimeout(typeEffect, timeout);
    }

    typeEffect();
  }

  /* ==========================================================================
     2. GESTION DU THÈME SOMBRE / CLAIR (DARK / LIGHT THEME)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Définir le thème initial
  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      showToast(newTheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé');
    });
  }

  /* ==========================================================================
     3. NAVIGATION ACTIVE & OMBRE DYNAMIQUE AU DÉFILEMENT
     ========================================================================== */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Ombre dynamique sur la navbar
    if (window.scrollY > 30) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }

    // Détection de la section active
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. ANIMATIONS D'APPARITION AU SCROLL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Repli si IntersectionObserver n'est pas supporté
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ==========================================================================
     5. ANIMATION DES JAUGES DE LANGUES AU DÉFILEMENT
     ========================================================================== */
  const languageBars = document.querySelectorAll('.language-fill');
  
  if ('IntersectionObserver' in window && languageBars.length > 0) {
    const langObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.getAttribute('data-level');
          if (targetWidth) {
            entry.target.style.width = targetWidth;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    languageBars.forEach(bar => {
      // Sauvegarder la largeur cible et réinitialiser à 0 pour l'animer
      if (!bar.getAttribute('data-level')) {
        const computedWidth = bar.classList.contains('fill-5') ? '100%' :
                              bar.classList.contains('fill-4') ? '80%' : '60%';
        bar.setAttribute('data-level', computedWidth);
        bar.style.width = '0%';
      }
      langObserver.observe(bar);
    });
  }

  /* ==========================================================================
     6. EFFET 3D TILT SUR LES CARTES DE PROJETS
     ========================================================================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* ==========================================================================
     7. BOUTON RETOUR EN HAUT (BACK TO TOP)
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     8. COPIE DANS LE PRESSE-PAPIERS AVEC NOTIFICATION TOAST
     ========================================================================== */
  const copyElements = document.querySelectorAll('[data-copy]');

  copyElements.forEach(item => {
    item.addEventListener('click', (e) => {
      // Si l'utilisateur clique directement sur le lien <a>, on ne bloque pas sa navigation
      if (e.target.tagName.toLowerCase() === 'a') {
        return;
      }
      
      const textToCopy = item.getAttribute('data-copy');
      if (!textToCopy) return;

      copyToClipboard(textToCopy);
    });
  });

  // Gestionnaire pour les boutons de copie dédiés
  const copyBtnEmail = document.getElementById('btn-copy-email');
  if (copyBtnEmail) {
    copyBtnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('elmiloudiassaad2@gmail.com');
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copié dans le presse-papiers : ${text}`);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }



  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copié : ${text}`);
  }

  function showToast(message) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'portfolio-toast';
      toast.className = 'portfolio-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  /* ==========================================================================
     9. FILTRES INTERACTIFS DES PROJETS PAR CATÉGORIE
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     10. COMPTEURS ANIMÉS DES STATISTIQUES HERO
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter-number[data-target]');
  if (counterElements.length > 0) {
    let countersStarted = false;
    const startCounters = () => {
      if (countersStarted) return;
      countersStarted = true;

      counterElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1000;
        const stepTime = Math.max(Math.floor(duration / target), 80);

        const timer = setInterval(() => {
          current += 1;
          el.textContent = current;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          }
        }, stepTime);
      });
    };

    setTimeout(startCounters, 350);
  }

  /* ==========================================================================
     11. ASSISTANT RECRUTEUR & FORMULAIRE INTERACTIF DE CONTACT
     ========================================================================== */
  const templatePills = document.querySelectorAll('.template-pill');
  const contactNameInput = document.getElementById('contact-name');
  const contactSubjectInput = document.getElementById('contact-subject');
  const contactBodyTextarea = document.getElementById('contact-body');
  const btnSendGmail = document.getElementById('btn-send-gmail');
  const btnSendClient = document.getElementById('btn-send-client');

  function updateContactLinks() {
    if (!btnSendGmail || !btnSendClient) return;

    const name = contactNameInput?.value.trim() || '';
    const subject = contactSubjectInput?.value.trim() || 'Prise de contact - Portfolio Assaad EL MILOUDI';
    let body = contactBodyTextarea?.value.trim() || '';

    if (name) {
      body += `\n\n---\nDe : ${name}`;
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    btnSendGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=elmiloudiassaad2@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
    btnSendClient.href = `mailto:elmiloudiassaad2@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
  }

  if (templatePills.length > 0) {
    templatePills.forEach(pill => {
      pill.addEventListener('click', () => {
        templatePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const newSubject = pill.getAttribute('data-subject') || '';
        const newMsg = pill.getAttribute('data-msg') || '';

        if (contactSubjectInput) contactSubjectInput.value = newSubject;
        if (contactBodyTextarea) contactBodyTextarea.value = newMsg;

        updateContactLinks();
        showToast('Modèle de message appliqué !');
      });
    });

    [contactNameInput, contactSubjectInput, contactBodyTextarea].forEach(input => {
      input?.addEventListener('input', updateContactLinks);
    });

    updateContactLinks();
  }

  /* ==========================================================================
     12. IMPRESSION / TÉLÉCHARGEMENT DIRECT CV SI URL ?print=true
     ========================================================================== */
  if (window.location.search.includes('print=true')) {
    setTimeout(() => {
      window.print();
    }, 700);
  }

});
