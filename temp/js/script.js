/**
 * GreenHarvest - Fresh Vegetable Supplier Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initReviewSlider();
    initNewsletterForm();
    initContactForm();
    initFaqToggles();
    initSmoothScrolling();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Review Slider
 */
function initReviewSlider() {
    const reviewSlider = document.querySelector('.review-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (reviewSlider && prevBtn && nextBtn) {
        const reviewCards = reviewSlider.querySelectorAll('.review-card');
        let currentIndex = 0;
        let cardWidth;
        let visibleCards;
        
        // Function to update slider based on screen size
        function updateSliderLayout() {
            // Get the width of a review card including margin
            const reviewCard = reviewCards[0];
            const reviewCardStyle = window.getComputedStyle(reviewCard);
            const marginRight = parseInt(reviewCardStyle.marginRight);
            cardWidth = reviewCard.offsetWidth + marginRight;
            
            // Determine how many cards are visible at once based on screen width
            if (window.innerWidth >= 1024) {
                visibleCards = 3;
            } else if (window.innerWidth >= 768) {
                visibleCards = 2;
            } else {
                visibleCards = 1;
            }
            
            // Reset position
            currentIndex = 0;
            updateSliderPosition();
        }
        
        // Function to update the slider position
        function updateSliderPosition() {
            reviewSlider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= reviewCards.length - visibleCards;
            
            // Update button appearance based on state
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        }
        
        // Initialize slider layout
        updateSliderLayout();
        
        // Add event listeners for buttons
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentIndex < reviewCards.length - visibleCards) {
                currentIndex++;
                updateSliderPosition();
            }
        });
        
        // Update layout on window resize
        window.addEventListener('resize', updateSliderLayout);
        
        // Add touch swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        reviewSlider.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        }, false);
        
        reviewSlider.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - go to next slide
                if (currentIndex < reviewCards.length - visibleCards) {
                    currentIndex++;
                    updateSliderPosition();
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - go to previous slide
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                }
            }
        }
        
        // Add transition effect
        reviewSlider.style.transition = 'transform 0.3s ease';
    }
}

/**
 * Newsletter Form Validation
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate form submission success
                newsletterMessage.textContent = 'Thank you for subscribing!';
                newsletterMessage.style.color = 'white';
                emailInput.value = '';
                
                // Reset message after 3 seconds
                setTimeout(function() {
                    newsletterMessage.textContent = '';
                }, 3000);
            } else {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#FFCCCC';
            }
        });
    }
}

/**
 * Contact Form Validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        // Get all error message elements
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');
        const consentError = document.getElementById('consent-error');
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset all error messages
            nameError.textContent = '';
            emailError.textContent = '';
            subjectError.textContent = '';
            messageError.textContent = '';
            consentError.textContent = '';
            
            // Get form values
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const subject = this.querySelector('#subject').value;
            const message = this.querySelector('#message').value.trim();
            const consent = this.querySelector('#consent').checked;
            
            let isValid = true;
            
            // Validate name
            if (name === '') {
                nameError.textContent = 'Please enter your name';
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Validate subject
            if (subject === '' || subject === null) {
                subjectError.textContent = 'Please select a subject';
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                messageError.textContent = 'Please enter your message';
                isValid = false;
            } else if (message.length < 10) {
                messageError.textContent = 'Your message is too short';
                isValid = false;
            }
            
            // Validate consent
            if (!consent) {
                consentError.textContent = 'You must agree to the privacy policy';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission success
                formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
                formStatus.style.color = 'green';
                
                // Reset form
                contactForm.reset();
                
                // Reset status after 5 seconds
                setTimeout(function() {
                    formStatus.textContent = '';
                }, 5000);
            } else {
                formStatus.textContent = 'Please fix the errors in the form.';
                formStatus.style.color = 'red';
            }
        });
    }
}

/**
 * FAQ Toggles
 */
function initFaqToggles() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const icon = otherItem.querySelector('.faq-toggle i');
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
                const icon = item.querySelector('.faq-toggle i');
                
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Scroll to target with header offset
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Email Validation Helper Function
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Add Animation on Scroll
 * This adds a fade-in animation to elements as they come into view
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .service-card, .best-card, .process-step, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Call scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        initScrollAnimations();
    }
});