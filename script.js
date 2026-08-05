document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

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

        // Function to lock/unlock body scroll
        const setBodyLock = (lock) => {
            if (lock && !allowPageScrollOnce) {
                document.body.classList.add('lock-scroll');
            } else {
                document.body.classList.remove('lock-scroll');
            }
        };

        // Lock scroll when Hero wrapper is in view
        const heroObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && currentSlide < heroSlides.length - 1 && currentSlide >= 0) {
                setBodyLock(true);
            }
        }, { threshold: 0.5 });

        heroObserver.observe(heroWrapper);

        // Core Slide Transition Logic
        const goToSlide = (targetIndex) => {
            if (isAnimating) return;

            // Handle Boundaries (Release page scroll)
            if (targetIndex >= heroSlides.length) {
                allowPageScrollOnce = true;
                setBodyLock(false);
                isAnimating = true;
                setTimeout(() => { isAnimating = false; }, 400);

                const nextSection = heroWrapper.nextElementSibling || document.getElementById('services') || document.getElementById('about');
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

            // Lock scroll for normal slide transitions
            allowPageScrollOnce = false;
            setBodyLock(true);
            isAnimating = true;

            // Deactivate current slide & dot
            heroSlides[currentSlide].classList.remove('active');
            if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');

            // Activate new slide & dot
            heroSlides[targetIndex].classList.add('active');
            if (heroDots[targetIndex]) heroDots[targetIndex].classList.add('active');

            // Update Counter
            if (currentSlideNum) {
                currentSlideNum.textContent = String(targetIndex + 1).padStart(2, '0');
            }

            // Subtle Background Image Scale Shift per slide
            const heroBg = heroWrapper.querySelector('.hero-bg');
            if (heroBg) {
                heroBg.style.transform = `scale(${1 + targetIndex * 0.05})`;
            }

            currentSlide = targetIndex;

            setTimeout(() => {
                isAnimating = false;
            }, 850);
        };

        // Wheel Event Handler (Desktop)
        const onWheel = (e) => {
            if (allowPageScrollOnce) {
                // If scrolled past bottom slide, re-enable hero hijacking when user scrolls back to top
                if (window.scrollY === 0 && e.deltaY < 0) {
                    allowPageScrollOnce = false;
                    setBodyLock(true);
                } else {
                    return;
                }
            }

            const isOverHero = e.target.closest('.fade-wrapper');
            if (!isOverHero && window.scrollY > 50) return;

            if (e.cancelable) {
                e.preventDefault();
            }

            const direction = e.deltaY > 0 ? 1 : -1;
            goToSlide(currentSlide + direction);
        };

        // Touch Event Handler (Mobile)
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
            if (!touchActive) return;
            if (allowPageScrollOnce) return;

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const dy = currentY - touchStartY;
            const dx = currentX - touchStartX;

            // Check if vertical gesture
            if (Math.abs(dy) > Math.abs(dx)) {
                if (e.cancelable) e.preventDefault();
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

        // Keyboard Arrow Handler
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

        // Attach Event Listeners
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        // Dot Pagination Clicks
        heroDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    goToSlide(targetIdx);
                }
            });
        });
    }

    // Ambient Glow Cursor Tracking
    if (ambientGlow) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            ambientGlow.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        });
    }



    // ====================================================
    // 3. Header Scroll Effect & Parallax
    // ====================================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ====================================================
    // 4. Section Animations & ScrollTriggers
    // ====================================================
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

    // Services Grid Animation
    gsap.fromTo('.service-card', 
        { y: 60, opacity: 0, scale: 0.95 },
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.15, 
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: '.services-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Portfolio Items Parallax & Fade
    gsap.utils.toArray('.work-item').forEach((item, i) => {
        gsap.fromTo(item, 
            { y: 80, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                delay: i % 2 === 0 ? 0 : 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Smooth Scrolling for Nav Links
    const navLinks = document.querySelectorAll('.nav-link, .btn-primary, .btn-quote');
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    if (link.classList.contains('nav-link')) {
                        link.classList.add('active');
                    }
                    
                    window.scrollTo({
                        top: targetSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

