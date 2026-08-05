document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ====================================================
    // 0. Lenis Smooth Scroll Engine (PC & Mobile)
    // ====================================================
    let lenis = null;

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential inertia curve
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: true,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Synchronize Lenis scroll position with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    // ====================================================
    // 1. Fullscreen Cinematic Dark Showreel Hero Controller
    // ====================================================
    const playShowreelBtn = document.getElementById('playShowreelBtn');
    const ambientGlow = document.getElementById('ambientGlow');

    if (playShowreelBtn) {
        playShowreelBtn.addEventListener('click', () => {
            if (typeof openVideoModal === 'function') {
                openVideoModal('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', 'SUPERZZEROS 2026 REEL', 'CINEMATIC SHOWCASE');
            }
        });
    }

    // GSAP Hero Entrance Animations
    if (typeof gsap !== 'undefined') {
        const heroTl = gsap.timeline();
        
        heroTl.fromTo('.hero-main-title', 
            { opacity: 0, y: 40, skewY: 2 }, 
            { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: "power4.out" }, 
            0.2
        )
        .fromTo('.hero-lead-text', 
            { opacity: 0, y: 25 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
            "-=0.6"
        )
        .fromTo('.hero-actions', 
            { opacity: 0, y: 25 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
            "-=0.6"
        )
        .fromTo('.hero-quick-stats', 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 
            "-=0.5"
        )
        .fromTo('.hero-marquee', 
            { opacity: 0 }, 
            { opacity: 1, duration: 1, ease: "power2.out" }, 
            "-=0.4"
        );
    }

    // High Performance RAF Ambient Glow Tracking
    if (ambientGlow) {
        let mouseX = 0, mouseY = 0;
        let ticking = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!ticking) {
                requestAnimationFrame(() => {
                    ambientGlow.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ====================================================
    // 2. Header Scroll Effect & Active ScrollSpy
    // ====================================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // ScrollSpy highlight active section link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // Smooth Anchor Scroll with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                if (lenis) lenis.start();
                
                if (lenis) {
                    lenis.scrollTo(targetSection, { offset: -70, duration: 1.1 });
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ====================================================
    // 3. Mobile Navigation Drawer
    // ====================================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link, #mobileQuoteBtn');

    const toggleDrawer = (open) => {
        if (open) {
            mobileDrawer.classList.add('open');
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileDrawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        } else {
            mobileDrawer.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
    };

    if (mobileMenuToggle && mobileDrawer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.contains('open');
            toggleDrawer(!isOpen);
        });

        if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer(false));
        if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleDrawer(false));
        
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => toggleDrawer(false));
        });
    }

    // ====================================================
    // 4. Portfolio Category Filter Logic
    // ====================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.classList.remove('hidden');
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });

            setTimeout(() => {
                if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            }, 350);
        });
    });

    // ====================================================
    // 5. Video Lightbox Modal Controller
    // ====================================================
    const videoModal = document.getElementById('videoModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
    const videoIframe = document.getElementById('videoIframe');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoCat = document.getElementById('modalVideoCat');

    const openVideoModal = (embedUrl, title, category) => {
        if (!videoModal || !videoIframe) return;
        if (videoIframe) videoIframe.src = embedUrl;
        if (modalVideoTitle) modalVideoTitle.textContent = title || 'PROJECT VIDEO';
        if (modalVideoCat) modalVideoCat.textContent = category || 'VIDEO SHOWCASE';

        videoModal.classList.add('open');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    };

    const closeVideoModal = () => {
        if (!videoModal || !videoIframe) return;
        videoModal.classList.remove('open');
        videoModal.setAttribute('aria-hidden', 'true');
        videoIframe.src = '';
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    };

    workItems.forEach(item => {
        item.addEventListener('click', () => {
            const embedUrl = item.getAttribute('data-video-embed');
            const title = item.getAttribute('data-video-title');
            const cat = item.getAttribute('data-video-cat');
            if (embedUrl) {
                openVideoModal(embedUrl, title, cat);
            }
        });
    });

    if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', closeVideoModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }

    // ====================================================
    // 6. Request a Quote Modal Controller
    // ====================================================
    const quoteModal = document.getElementById('quoteModal');
    const openQuoteBtns = document.querySelectorAll('#openQuoteModalBtn, #mobileQuoteBtn');
    const closeQuoteModalBtn = document.getElementById('closeQuoteModalBtn');
    const quoteModalForm = document.getElementById('quoteModalForm');

    const openQuoteModal = () => {
        if (!quoteModal) return;
        quoteModal.classList.add('open');
        quoteModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    };

    const closeQuoteModal = () => {
        if (!quoteModal) return;
        quoteModal.classList.remove('open');
        quoteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    };

    openQuoteBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openQuoteModal);
    });

    if (closeQuoteModalBtn) closeQuoteModalBtn.addEventListener('click', closeQuoteModal);
    if (quoteModal) {
        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) closeQuoteModal();
        });
    }

    // Escape Key Handler for all Modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeQuoteModal();
            toggleDrawer(false);
        }
    });

    // ====================================================
    // 7. Toast Notification & Form Submissions
    // ====================================================
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    const showToast = (message) => {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = message;
        toastNotification.classList.add('show');

        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 4000);
    };

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your message has been sent to our director team.');
            contactForm.reset();
        });
    }

    if (quoteModalForm) {
        quoteModalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeQuoteModal();
            showToast('Quote request submitted! We will respond within 24 hours.');
            quoteModalForm.reset();
        });
    }

    // ====================================================
    // 8. Sohub.digital Inspired GSAP ScrollTrigger Animations
    // ====================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        // A. Section Header Text Reveal (Mask/Slide-Up)
        gsap.utils.toArray('.section-header').forEach(headerEl => {
            const subtitle = headerEl.querySelector('.section-subtitle');
            const title = headerEl.querySelector('.section-title');
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: headerEl,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            if (subtitle) {
                tl.fromTo(subtitle, 
                    { opacity: 0, y: 25 }, 
                    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
                );
            }
            if (title) {
                tl.fromTo(title, 
                    { opacity: 0, y: 40, skewY: 2 }, 
                    { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power4.out" }, 
                    "-=0.4"
                );
            }
        });

        // B. Animated Number Counters in About Section
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            ScrollTrigger.create({
                trigger: '.about-stats-wrapper',
                start: "top 80%",
                once: true,
                onEnter: () => {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'), 10);
                        if (isNaN(target)) return;

                        gsap.to(stat, {
                            innerText: target,
                            duration: 2.2,
                            snap: { innerText: 1 },
                            ease: "power2.out"
                        });
                    });
                }
            });
        }

        // C. Service Cards Staggered Reveal
        gsap.fromTo('.service-card', 
            { y: 70, opacity: 0, scale: 0.96 },
            { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                duration: 0.9, 
                stagger: 0.12, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: "top 82%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // D. Portfolio Masonry Items Reveal & Image Parallax Effect
        gsap.utils.toArray('.work-item').forEach((item) => {
            const image = item.querySelector('.work-image');

            gsap.fromTo(item, 
                { y: 80, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            if (image) {
                gsap.fromTo(image, 
                    { yPercent: -8, scale: 1.12 },
                    {
                        yPercent: 8,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }
        });

        // E. Testimonials Grid Staggered Reveal
        gsap.fromTo('.testimonial-card',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.85,
                stagger: 0.14,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: "top 82%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // F. Brand Logos Reveal
        gsap.fromTo('.brand-logo-item',
            { opacity: 0, y: 20 },
            {
                opacity: 0.7,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.brand-logos-row',
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
});
