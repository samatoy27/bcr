document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(event) {
            // If you're using Formspree or another form service, you can remove the preventDefault
            // event.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to your server
            // For this template, we'll just show a success message
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for your appointment request!</h3>
                    <p>We've received your information and will contact you shortly to confirm your appointment.</p>
                </div>
            `;
            
            // Scroll to the success message
            formContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('nav ul li a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900) {
                nav.classList.remove('active');
            }
        });
    });
    
    // Handle sticky header behavior
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add compact class when scrolled down a bit
        if (scrollTop > 50) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
        
        // For mobile devices, hide header when scrolling down
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling DOWN past 100px
                header.classList.add('scrolling-down');
            } else {
                // Scrolling UP
                header.classList.remove('scrolling-down');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Gallery image modal functionality (if you have a gallery)
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const body = document.body;
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-modal');
            closeBtn.innerHTML = '&times;';
            
            modal.appendChild(closeBtn);
            modal.appendChild(modalImg);
            body.appendChild(modal);
            body.classList.add('modal-open');
            
            closeBtn.addEventListener('click', function() {
                body.removeChild(modal);
                body.classList.remove('modal-open');
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    body.removeChild(modal);
                    body.classList.remove('modal-open');
                }
            });
        });
    });
    
    // Add current year to footer if needed
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Testimonial carousel (if you have testimonials)
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 1) {
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        }
        
        // Initialize
        showTestimonial(currentTestimonial);
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
});
