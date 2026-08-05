document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ====================================================
    // 1. Zoomoe Studio Hero Controller (Multi-Slide Fade)
    // ====================================================
    const heroWrapper = document.querySelector('.fade-wrapper');
    const heroSlides = document.querySelectorAll('.fade-section');
    const heroDots = document.querySelectorAll('.hero-dot');
    const currentSlideNum = document.getElementById('currentSlideNum');
    const ambientGlow = document.getElementById('ambientGlow');

    if (heroWrapper && heroSlides.length > 0) {
        let currentSlide = 0;
        let isAnimating = false;
        let allowPageScrollOnce = false;

        // Initialize first slide state
        heroSlides.forEach((slide, idx) => {
            if (idx === 0) slide.classList.add('active');
            else slide.classList.remove('active');
        });

        // Lock/unlock body scroll for hero slides
        const setBodyLock = (lock) => {
            if (lock && !allowPageScrollOnce) {
                document.body.classList.add('lock-scroll');
            } else {
                document.body.classList.remove('lock-scroll');
            }
        };

        // Observe Hero wrapper in viewport
        const heroObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && currentSlide < heroSlides.length - 1 && currentSlide >= 0) {
                setBodyLock(true);
            }
        }, { threshold: 0.5 });

        heroObserver.observe(heroWrapper);

        // Core Slide Transition Function
        const goToSlide = (targetIndex) => {
            if (isAnimating) return;

            // Slide boundaries check
            if (targetIndex >= heroSlides.length) {
                allowPageScrollOnce = true;
                setBodyLock(false);
                isAnimating = true;
                setTimeout(() => { isAnimating = false; }, 400);

                const nextSection = document.getElementById('about') || document.getElementById('services');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }

            if (targetIndex < 0) {
                allowPageScrollOnce = true;
                setBodyLock(false);
                isAnimating = true;
                setTimeout(() => { isAnimating = false; }, 400);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            allowPageScrollOnce = false;
            setBodyLock(true);
            isAnimating = true;

            // Deactivate current slide
            heroSlides[currentSlide].classList.remove('active');
            if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');

            // Activate target slide
            heroSlides[targetIndex].classList.add('active');
            if (heroDots[targetIndex]) heroDots[targetIndex].classList.add('active');

            // Update Counter
            if (currentSlideNum) {
                currentSlideNum.textContent = String(targetIndex + 1).padStart(2, '0');
            }

            currentSlide = targetIndex;

            setTimeout(() => {
                isAnimating = false;
            }, 850);
        };

        // Mouse Wheel Navigation
        const onWheel = (e) => {
            if (allowPageScrollOnce) {
                if (window.scrollY === 0 && e.deltaY < 0) {
                    allowPageScrollOnce = false;
                    setBodyLock(true);
                } else {
                    return;
                }
            }

            const isOverHero = e.target.closest('.fade-wrapper');
            if (!isOverHero && window.scrollY > 50) return;

            if (e.cancelable) e.preventDefault();

            const direction = e.deltaY > 0 ? 1 : -1;
            goToSlide(currentSlide + direction);
        };

        // Touch Swipe Navigation
        let touchStartY = 0;
        let touchStartX = 0;
        let touchActive = false;

        const onTouchStart = (e) => {
            const isOverHero = e.target.closest('.fade-wrapper');
            if (!isOverHero) return;

            touchActive = true;
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        };

        const onTouchMove = (e) => {
            if (!touchActive || allowPageScrollOnce) return;
            const dy = e.touches[0].clientY - touchStartY;
            const dx = e.touches[0].clientX - touchStartX;
            if (Math.abs(dy) > Math.abs(dx) && e.cancelable) {
                e.preventDefault();
            }
        };

        const onTouchEnd = (e) => {
            if (!touchActive) return;
            touchActive = false;
            const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dy) >= 45) {
                const direction = dy < 0 ? 1 : -1;
                goToSlide(currentSlide + direction);
            }
        };

        // Keyboard Arrow Navigation
        const onKeyDown = (e) => {
            if (window.scrollY < 100 && !allowPageScrollOnce) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    goToSlide(currentSlide + 1);
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    goToSlide(currentSlide - 1);
                }
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        // Hero Pagination Click Events
        heroDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    goToSlide(targetIdx);
                }
            });
        });
    }

    // Ambient Glow Tracking
    if (ambientGlow) {
        window.addEventListener('mousemove', (e) => {
            ambientGlow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        });
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
        });
    }

    // Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                // Release lock scroll if scrolling from nav link
                document.body.classList.remove('lock-scroll');
                
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
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
        } else {
            mobileDrawer.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
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
    };

    const closeVideoModal = () => {
        if (!videoModal || !videoIframe) return;
        videoModal.classList.remove('open');
        videoModal.setAttribute('aria-hidden', 'true');
        videoIframe.src = '';
        document.body.style.overflow = '';
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
    };

    const closeQuoteModal = () => {
        if (!quoteModal) return;
        quoteModal.classList.remove('open');
        quoteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
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

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your message has been sent to our director team.');
            contactForm.reset();
        });
    }

    // Quote Modal Form Handler
    if (quoteModalForm) {
        quoteModalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeQuoteModal();
            showToast('Quote request submitted! We will respond within 24 hours.');
            quoteModalForm.reset();
        });
    }

    // ====================================================
    // 8. GSAP ScrollTrigger Animations & Stat Counters
    // ====================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Section Header Animations
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
                tl.fromTo(subtitle, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" });
            }
            if (title) {
                tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
            }
        });

        // Animated Number Counters in About Section
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
                            duration: 2,
                            snap: { innerText: 1 },
                            ease: "power2.out"
                        });
                    });
                }
            });
        }

        // Service Cards Animation
        gsap.fromTo('.service-card', 
            { y: 60, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.12, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Portfolio Items Fade
        gsap.utils.toArray('.work-item').forEach((item, i) => {
            gsap.fromTo(item, 
                { y: 60, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    delay: (i % 2) * 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Testimonial Cards Animation
        gsap.fromTo('.testimonial-card',
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
});
