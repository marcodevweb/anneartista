// Main JS for Ainoa Artes - Fluid & Bouncy GSAP Animations

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Check
    if (typeof gsap === 'undefined') {
        console.error('GSAP missing.');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
 
    // Global Performance Config
    gsap.config({
        force3D: true,
        nullTargetWarn: false
    });
 
    // Optimize ScrollTrigger for performance
    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
    });

    // 2. TEXT SPLITTING (Preservando spans internos e classes)
    const splitText = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.dataset.splitDone) return;
            const nodes = Array.from(el.childNodes);
            el.innerHTML = '';
            
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN')) {
                    const isNoSplit = node.nodeType === Node.ELEMENT_NODE && node.classList.contains('no-split');
                    
                    if (isNoSplit) {
                        el.appendChild(node.cloneNode(true));
                        return;
                    }

                    const text = node.textContent;
                    const className = node.tagName === 'SPAN' ? node.className : '';
                    const words = text.split(/(\s+)/);

                    words.forEach(word => {
                        if (word.trim() === '') {
                            el.appendChild(document.createTextNode(word));
                            return;
                        }
                        const wordSpan = document.createElement('span');
                        if (className) wordSpan.className = className;
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';
                        
                        word.split('').forEach(char => {
                            const charSpan = document.createElement('span');
                            charSpan.textContent = char;
                            charSpan.style.display = 'inline-block';
                            charSpan.classList.add('char-anim');
                            wordSpan.appendChild(charSpan);
                        });
                        el.appendChild(wordSpan);
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    el.appendChild(node.cloneNode(true));
                }
            });
            el.dataset.splitDone = "true";
        });
    };

    // 3. ANIMATION ENGINE
    const startAnimations = () => {
        // A. TEXT - "Quicando" (Bounce)
        splitText('.font-comico:not(.no-split)');
        document.querySelectorAll('.font-comico:not(.no-split)').forEach(el => {
            const spans = el.querySelectorAll('.char-anim');
            if (spans.length > 0) {
                gsap.from(spans, {
                    scrollTrigger: { trigger: el, start: 'top 92%' },
                    y: -60,
                    opacity: 0,
                    rotate: -10,
                    duration: 1,
                    stagger: { amount: 0.5 },
                    ease: "bounce.out"
                });
            }
        });

        // B. GRIDS - "Esbarrão" (Sliding collision)
        // Adicionada a .embla__container para capturar os cards do curso no carrossel
        document.querySelectorAll('.grid, .flex-row-wrap, .flex-wrap, .embla__container').forEach(container => {
            const items = container.querySelectorAll('.reveal, .embla__slide > a');
            if (items.length > 0) {
                // Pre-disable transitions to prevent CSS fighting initially
                items.forEach(item => item.style.transition = 'none');

                gsap.fromTo(items, 
                    { 
                        x: window.innerWidth < 1024 ? 20 : 150, 
                        opacity: 0, 
                        scale: 0.8,
                        rotate: window.innerWidth < 1024 ? 5 : 15 
                    },
                    {
                        scrollTrigger: { 
                            trigger: container, 
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: "back.out(1.5)", 
                        overwrite: 'auto',
                        clearProps: "transform,transition", 
                        onComplete: () => {
                            items.forEach(i => i.style.transition = '');
                        }
                    }
                );
            }
        });

        // C. SINGLE REVEALS - "Salto" (Standard Pop)
        document.querySelectorAll('.reveal').forEach(el => {
            // Skip items inside animated containers to avoid double animation
            if (el.closest('.grid') || el.closest('.flex-row-wrap') || el.closest('.flex-wrap')) return;

            el.style.transition = 'none'; // Prevent CSS fighting

            gsap.fromTo(el, 
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: 'auto',
                    clearProps: "transform,transition",
                    onComplete: () => {
                        el.style.transition = '';
                    }
                }
            );
        });
    };

    // 4. SMOOTH SCROLL (Internal Links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id && id !== '#' && id.startsWith('#')) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    if (window.gsap && window.gsap.to && typeof ScrollToPlugin !== 'undefined') {
                        gsap.to(window, { 
                            duration: 0.5, 
                            scrollTo: { y: target, offsetY: 80 }, 
                            ease: "power4.out" 
                        });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // 5. EMBLA CAROUSEL (Mobile/Tablet Only with Parallax)
    const initEmblaCarousel = () => {
        const emblaNode = document.querySelector('#cursos-carousel');
        if (!emblaNode || typeof EmblaCarousel === 'undefined') return;

        const options = {
            loop: false,
            dragFree: true, // Movimentação livre e fluida
            align: 'start', // Alinhamento inicial para transição grid/carousel
            containScroll: 'trimSnaps',
            breakpoints: {
                '(min-width: 1024px)': { active: false } // Desativa no desktop
            }
        };

        const emblaApi = EmblaCarousel(emblaNode, options);

        const PARALLAX_FACTOR = 0.15; // Suave parallax
        const parallaxNodes = emblaApi.slideNodes().map((slideNode) => {
            const node = slideNode.querySelector('.embla__parallax__layer');
            if (node) node.style.transformOrigin = 'top center'; // Varal effect origin
            return node;
        });

        let lastScrollProgress = emblaApi.scrollProgress();
        let smoothedVelocity = 0;
        let peakVelocity = 0; // Tracked separately for release animation

        const applyParallaxStyles = () => {
            const snapList = emblaApi.scrollSnapList();
            const currentProgress = emblaApi.scrollProgress();
            const rawVelocity = currentProgress - lastScrollProgress;
            lastScrollProgress = currentProgress;

            // Low smoothing during active drag = fast response to input
            smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.35;

            // Track the highest velocity seen in this drag for the release spring
            if (Math.abs(rawVelocity) > Math.abs(peakVelocity)) {
                peakVelocity = rawVelocity;
            }

            // If the carousel is inactive (e.g., on desktop due to breakpoints), reset styles
            if (!snapList.length) {
                parallaxNodes.forEach(node => {
                    if (node) {
                        node.style.transform = '';
                        gsap.set(node, { rotation: 0 });
                    }
                });
                return;
            }

            snapList.forEach((scrollSnap, index) => {
                let diffToTarget = scrollSnap - currentProgress;

                // Fix for the edge cases
                if (currentProgress < 0) {
                    diffToTarget = scrollSnap;
                } else if (currentProgress > 1) {
                    diffToTarget = scrollSnap - 1;
                }

                const translate = diffToTarget * (-1 * PARALLAX_FACTOR) * 100;

                // === PHYSICS PROPORTIONAL TO DRAG INTENSITY ===
                // Normalize velocity into a 0-1 intensity value
                // Threshold increased to 0.04 for less sensitivity
                // Applied a power curve (1.5) to make small movements much subtler
                const absVelocity = Math.abs(smoothedVelocity);
                const rawIntensity = Math.min(1, absVelocity / 0.04);
                const intensity = Math.pow(rawIntensity, 1.5);

                // Swing angle scales 0→22 degrees with intensity
                const maxSwing = 22;
                const targetRotation = Math.sign(smoothedVelocity) * intensity * maxSwing;

                // Duration: fast drag = shorter duration (snappier), slow = longer (smoother)
                // Range: 0.55s (gentle) → 0.22s (aggressive)
                const duration = 0.55 - (intensity * 0.33);

                // Ease: linear blend from power2.out (calm) to back.out (energetic recoil)
                // Below 40% intensity → no recoil; above → scaled overshoot up to 2.5
                const overshoot = intensity > 0.4 ? (intensity - 0.4) / 0.6 * 2.5 : 0;
                const ease = overshoot > 0.1 ? `back.out(${overshoot.toFixed(2)})` : "power2.out";

                if (parallaxNodes[index]) {
                    gsap.to(parallaxNodes[index], {
                        xPercent: translate,
                        rotation: targetRotation,
                        duration,
                        ease,
                        overwrite: "auto"
                    });
                }
            });
        };

        // On pointer release: spring all nodes back to 0 rotation smoothly
        const onPointerUp = () => {
            const absRelease = Math.abs(peakVelocity);
            // Higher release velocity = slightly more spring in the return
            // Threshold updated to 0.04 to match sensitivity scale
            const springBack = Math.min(1.5, absRelease / 0.04 * 1.0);
            const returnDuration = 0.35 + springBack * 0.2; // 0.35s → 0.55s

            parallaxNodes.forEach(node => {
                if (node) {
                    gsap.to(node, {
                        rotation: 0,
                        duration: returnDuration,
                        ease: springBack > 0.3 ? `elastic.out(1, ${0.4 + springBack * 0.1})` : "power3.out",
                        overwrite: "auto"
                    });
                }
            });
            peakVelocity = 0;
        };

        emblaApi.on('init', applyParallaxStyles);
        emblaApi.on('scroll', applyParallaxStyles);
        emblaApi.on('reInit', applyParallaxStyles);
        emblaApi.on('pointerUp', onPointerUp);
    };

    // 6. AUTO-TRIGGER AVATAR (Mobile/Tablet)
    const initAvatarAutoTrigger = () => {
        if (window.innerWidth >= 1024) return;

        // Find the avatar container (the one with the group class and the teacher image)
        const avatarContainers = Array.from(document.querySelectorAll('.group.rounded-full')).filter(el => 
            el.querySelector('img[src*="teacher-avatar"]')
        );

        if (avatarContainers.length === 0) return;

        // Inject CSS for the forced hover state to match desktop hover effects
        const style = document.createElement('style');
        style.textContent = `
            .forced-hover {
                transform: translateY(-1rem) rotate(-3deg) !important;
                box-shadow: 20px 20px 0 0 #0A3323 !important;
            }
            .forced-hover .group-hover\\:translate-y-0 {
                transform: translateY(0) !important;
            }
            .forced-hover .group-hover\\:-translate-y-full {
                transform: translateY(-100%) !important;
            }
            @media (max-width: 768px) {
                .forced-hover {
                    box-shadow: 15px 15px 0 0 #0A3323 !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Animation Loop
        const runCycle = () => {
            avatarContainers.forEach(avatar => {
                avatar.classList.add('forced-hover');
                setTimeout(() => {
                    avatar.classList.remove('forced-hover');
                }, 5000); // Stays active for 5 seconds
            });
        };

        // Initial delay before first trigger
        setTimeout(() => {
            runCycle();
            setInterval(runCycle, 10000); // Runs every 10 seconds
        }, 3000);
    };

    // 7. TRACKING SYSTEM (URL Parameters for CTAs)
    const initTracking = () => {
        const params = new URLSearchParams(window.location.search);
        // Suporta ?src= ou ?utm_source=
        let src = params.get('src') || params.get('utm_source');
        
        // Se encontrou na URL, salva no session storage para persistir entre páginas
        if (src) {
            sessionStorage.setItem('ainoa_src', src);
        } else {
            // Se não tem na URL, tenta pegar do session storage (vinda de outra página do site)
            src = sessionStorage.getItem('ainoa_src');
        }

        if (src) {
            // 1. Encontra todos os links de checkout da Kiwify
            document.querySelectorAll('a[href*="kiwify.com.br"]').forEach(link => {
                try {
                    const url = new URL(link.href);
                    url.searchParams.set('src', src);
                    link.href = url.toString();
                } catch (e) {
                    console.error("Erro ao atualizar link de tracking Kiwify:", e);
                }
            });

            // 2. Encontra links internos do site para manter o parâmetro na URL ao navegar
            // Procura por links que terminam em .html ou que não começam com http (links relativos)
            document.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && (href.endsWith('.html') || (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')))) {
                    try {
                        const url = new URL(link.href);
                        url.searchParams.set('src', src);
                        link.href = url.toString();
                    } catch (e) {
                        // Silencioso para links internos complexos
                    }
                }
            });
        }
    };

    // Fire!
    startAnimations();
    initEmblaCarousel();
    initAvatarAutoTrigger();
    initTracking();
    
    // FAQ Accordion Logic
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const header = card.querySelector('.cursor-pointer');
        const answer = card.querySelector('.faq-answer');
        const icon = card.querySelector('.ph-plus');

        if (header && answer) {
            header.addEventListener('click', () => {
                const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

                // Close all others
                faqCards.forEach(otherCard => {
                    const otherAnswer = otherCard.querySelector('.faq-answer');
                    const otherIcon = otherCard.querySelector('.ph-plus');
                    if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                });

                if (!isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(45deg)';
                }
            });
        }
    });

    ScrollTrigger.refresh();
});
