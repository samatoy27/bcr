document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle with accessibility improvements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = isExpanded ? 
                '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', (!isExpanded).toString());
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Form submission with enhanced validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if doesn't exist
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.style.color = '#e74c3c';
                        errorMessage.style.fontSize = '0.85rem';
                        errorMessage.style.marginTop = '5px';
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if exists
                    let errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('error');
                    
                    // Add error message
                    let errorMessage = emailField.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.style.color = '#e74c3c';
                        errorMessage.style.fontSize = '0.85rem';
                        errorMessage.style.marginTop = '5px';
                        errorMessage.textContent = 'Please enter a valid email address';
                        emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
                    } else {
                        errorMessage.textContent = 'Please enter a valid email address';
                    }
                }
            }
            
            if (!isValid) {
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data to Formspree
            fetch('https://formspree.io/f/mqapyaev', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to thanks page
                    window.location.href = 'thanks.html';
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Show error message
                const formError = document.createElement('div');
                formError.className = 'form-error';
                formError.style.color = '#e74c3c';
                formError.style.padding = '10px';
                formError.style.marginBottom = '20px';
                formError.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                formError.style.borderRadius = '5px';
                formError.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was a problem submitting your form. Please try again.';
                
                contactForm.prepend(formError);
                
                // Remove error after 5 seconds
                setTimeout(() => {
                    if (formError) formError.remove();
                }, 5000);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
        
        // Clear error on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
                const errorMessage = field.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            });
        });
    }

    // Enhanced lightbox for gallery images with keyboard navigation
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentIndex = 0;
    
    function createLightbox(imgSrc, imgAlt, index) {
        // Remove any existing lightbox
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }
        
        currentIndex = index;
        
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'Image gallery');
        
        // Create container for image and navigation
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.maxWidth = '90vw';
        container.style.maxHeight = '90vh';
        
        // Create image
        const lbImg = document.createElement('img');
        lbImg.src = imgSrc;
        lbImg.alt = imgAlt || 'Gallery image';
        lbImg.style.maxHeight = '90vh';
        lbImg.style.maxWidth = '90vw';
        lbImg.style.objectFit = 'contain';
        
        // Add image number indicator
        const imageCounter = document.createElement('div');
        imageCounter.style.position = 'absolute';
        imageCounter.style.bottom = '-30px';
        imageCounter.style.left = '0';
        imageCounter.style.right = '0';
        imageCounter.style.textAlign = 'center';
        imageCounter.style.color = 'white';
        imageCounter.textContent = `Image ${index + 1} of ${galleryItems.length}`;
        
        // Add navigation buttons if there are multiple images
        if (galleryItems.length > 1) {
            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.className = 'lightbox-nav prev';
            prevBtn.setAttribute('aria-label', 'Previous image');
            
            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.className = 'lightbox-nav next';
            nextBtn.setAttribute('aria-label', 'Next image');
            
            // Add event listeners to buttons
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateGallery(-1);
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateGallery(1);
            });
            
            // Append buttons to container
            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
        }
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '2rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '1001';
        closeBtn.setAttribute('aria-label', 'Close gallery');
        
        // Append elements to their containers
        container.appendChild(lbImg);
        container.appendChild(imageCounter);
        lightbox.appendChild(container);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        lightbox.addEventListener('click', () => {
            closeLightbox();
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', keyboardNavigation);
    }
    
    function navigateGallery(direction) {
        let newIndex = currentIndex + direction;
        
        // Loop around if we reach the ends
        if (newIndex < 0) {
            newIndex = galleryItems.length - 1;
        } else if (newIndex >= galleryItems.length) {
            newIndex = 0;
        }
        
        createLightbox(galleryItems[newIndex].src, galleryItems[newIndex].alt, newIndex);
    }
    
    function keyboardNavigation(e) {
        // Only respond if lightbox exists
        if (!document.querySelector('.lightbox')) {
            document.removeEventListener('keydown', keyboardNavigation);
            return;
        }
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateGallery(-1);
                break;
            case 'ArrowRight':
                navigateGallery(1);
                break;
        }
    }
    
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', keyboardNavigation);
        }
    }
    
    // Attach click events to gallery images
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt, index);
        });
        
        // Make gallery images more accessible
        img.parentElement.setAttribute('role', 'button');
        img.parentElement.setAttribute('tabindex', '0');
        img.parentElement.setAttribute('aria-label', `View ${img.alt || 'gallery image'}`);
        
        // Allow keyboard activation
        img.parentElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                img.click();
            }
        });
    });
    
    // Enhanced smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Account for fixed header offset
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
                
                // Set focus to the target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
    
    // Add current year to copyright
    const copyrightEl = document.querySelector('.copyright');
    if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.innerHTML = copyrightEl.innerHTML.replace('2025', currentYear);
    }
    
    // Lazy load images for better performance
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 200px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, imgOptions);
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
    
    // Add active class to current nav item
    const currentPage = window.location.pathname;
    const navLinkitems = document.querySelectorAll('.nav-links a');
    
    navLinkItems.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if it's the home page
        if (currentPage === '/' || currentPage === '/index.html') {
            if (linkPath === 'index.html' || linkPath === './') {
                link.classList.add('active');
            }
        } 
        // Check other pages
        else if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        }
    });
});
