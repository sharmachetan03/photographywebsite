document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent background scrolling when menu is active on mobile
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* ==========================================================================
       SCROLL EFFECTS & NAVIGATION HIGHLIGHT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Toggle navbar background blur on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active navigation link based on current section viewport position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    /* ==========================================================================
       GALLERY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let activeCategory = 'all';

    // Get array of current visible items for lightbox navigation
    const getVisibleItems = () => {
        return Array.from(galleryItems).filter(item => 
            activeCategory === 'all' || item.getAttribute('data-category') === activeCategory
        );
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            activeCategory = button.getAttribute('data-filter');

            // Animate grid items filter transition
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (activeCategory === 'all' || category === activeCategory) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });

    /* ==========================================================================
       LIGHTBOX MODAL GALLERY
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentItemIndex = 0;

    const openLightbox = (item) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.photo-title').textContent;
        const category = item.querySelector('.photo-category').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
        
        // Track the index relative to all items
        currentItemIndex = parseInt(item.getAttribute('data-index'), 10);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Restore background scroll only if mobile menu is not active
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    };

    const navigateLightbox = (direction) => {
        const visibleItems = getVisibleItems();
        if (visibleItems.length === 0) return;

        // Find the index in the visible elements list
        const currentVisibleItem = Array.from(galleryItems).find(item => parseInt(item.getAttribute('data-index'), 10) === currentItemIndex);
        let visibleIndex = visibleItems.indexOf(currentVisibleItem);

        if (direction === 'next') {
            visibleIndex = (visibleIndex + 1) % visibleItems.length;
        } else if (direction === 'prev') {
            visibleIndex = (visibleIndex - 1 + visibleItems.length) % visibleItems.length;
        }

        const nextItem = visibleItems[visibleIndex];
        openLightbox(nextItem);
    };

    // Attach click events to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    // Close Lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Next/Prev Buttons
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('next');
    });
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('prev');
    });

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.gallery-grid, .about-grid, .contact-grid');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION WITH SIMULATED API
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Client side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            // Set state to loading
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            formFeedback.textContent = '';

            // Simulate server network call (1.5 seconds)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Simulated success response
                showFeedback('Thank you, Aria! Your message has been sent successfully. I will get back to you shortly.', 'success');
                contactForm.reset();

                // Manually trigger label reset by losing focus
                document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                    input.blur();
                });
            }, 1500);
        });
    }

    const showFeedback = (msg, type) => {
        formFeedback.textContent = msg;
        formFeedback.className = 'form-feedback ' + type;
        
        // Clear message after 5 seconds on success
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
            }, 5000);
        }
    };
});
