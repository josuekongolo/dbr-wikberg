/**
 * DBR Wikberg - Main JavaScript
 * Handles navigation, form submission, and interactions
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNavigation();
        initSmoothScroll();
        initContactForm();
        initHeaderScroll();
        initScrollAnimations();
    });

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact Form Handling
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');

        if (!form) return;

        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any existing messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            // Validate form
            if (!validateForm(form)) {
                return;
            }

            // Get form data
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                location: form.location.value.trim(),
                projectType: form.projectType.value,
                description: form.description.value.trim(),
                wantSiteVisit: form.siteVisit.checked
            };

            // Get submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn__text');
            const originalText = btnText.textContent;

            // Set loading state
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                // For production, integrate with Resend API or other email service
                await simulateFormSubmission(formData);

                // Show success message
                successMessage.style.display = 'block';
                form.reset();

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                // Reset button state
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
            }
        });

        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function(field) {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            field.addEventListener('input', function() {
                // Remove error state on input
                this.style.borderColor = '';
            });
        });
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(function(field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Check if empty
        if (!value) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Phone validation (Norwegian format)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+47)?[\s-]?[2-9]\d{7}$/;
            const cleanedPhone = value.replace(/[\s-]/g, '');
            if (!phoneRegex.test(cleanedPhone) && cleanedPhone.length < 8) {
                isValid = false;
            }
        }

        // Update field styling
        if (!isValid) {
            field.style.borderColor = 'var(--color-error)';
        } else {
            field.style.borderColor = '';
        }

        return isValid;
    }

    /**
     * Simulate form submission
     * Replace this with actual API integration in production
     */
    function simulateFormSubmission(formData) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data (for development)
                console.log('Form submitted with data:', formData);

                // Simulate success (90% of the time for demo)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');

        if (!header) return;

        let lastScrollTop = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow when scrolled
            if (scrollTop > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    /**
     * Scroll Animations (simple fade-in)
     */
    function initScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;

        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .value-card, .project-card');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Format phone number
     */
    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 8) {
            return cleaned.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
        }
        return phone;
    }

})();

/**
 * Resend API Integration (for production use)
 * Uncomment and configure when ready to deploy
 */
/*
async function sendEmailViaResend(formData) {
    const RESEND_API_KEY = 'your-api-key-here';

    const emailContent = `
        Ny henvendelse fra nettsiden:

        Navn: ${formData.name}
        E-post: ${formData.email}
        Telefon: ${formData.phone}
        Prosjektadresse: ${formData.location || 'Ikke oppgitt'}
        Type prosjekt: ${formData.projectType}
        Onsker befaring: ${formData.wantSiteVisit ? 'Ja' : 'Nei'}

        Beskrivelse:
        ${formData.description}
    `;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'noreply@dbrwikberg.no',
            to: 'post@dbrwikberg.no',
            subject: `Ny henvendelse: ${formData.projectType} - ${formData.name}`,
            text: emailContent,
            reply_to: formData.email
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/
