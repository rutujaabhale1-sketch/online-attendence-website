// Simple JavaScript functionality for the website

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show success message (in a real application, this would send to a server)
            alert(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon!`);
            
            // Reset form
            this.reset();
        });
    }

    // Mobile menu toggle (for responsive design)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.style.display = 'none';
    
    const nav = document.querySelector('nav .container');
    if (nav) {
        nav.insertBefore(mobileMenuToggle, nav.querySelector('ul'));
        
        mobileMenuToggle.addEventListener('click', function() {
            const navList = nav.querySelector('ul');
            navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Check screen size for mobile menu
    function checkScreenSize() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('nav ul');
        
        if (window.innerWidth <= 768) {
            if (mobileMenuToggle) {
                mobileMenuToggle.style.display = 'block';
            }
            if (navList) {
                navList.style.display = 'none';
                navList.style.flexDirection = 'column';
                navList.style.position = 'absolute';
                navList.style.top = '100%';
                navList.style.left = '0';
                navList.style.right = '0';
                navList.style.background = '#2c3e50';
                navList.style.padding = '1rem';
                navList.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            }
        } else {
            if (mobileMenuToggle) {
                mobileMenuToggle.style.display = 'none';
            }
            if (navList) {
                navList.style.display = 'flex';
                navList.style.flexDirection = 'row';
                navList.style.position = 'static';
                navList.style.padding = '0';
                navList.style.boxShadow = 'none';
            }
        }
    }

    // Initial check and event listener for resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.feature, .service, .team-member');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Simple animation for elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Current year in footer
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }
});

// Simple utility functions
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const error = formGroup.querySelector('.error') || document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        error.style.color = '#e74c3c';
        error.style.fontSize = '0.9rem';
        error.style.marginTop = '0.5rem';
        
        if (!formGroup.querySelector('.error')) {
            formGroup.appendChild(error);
        }
        
        input.style.borderColor = '#e74c3c';
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const error = formGroup.querySelector('.error');
        if (error) {
            error.remove();
        }
        input.style.borderColor = '#ddd';
    }
}

// Add CSS for additional styles
const additionalStyles = `
    .mobile-menu-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }
    
    .scroll-to-top:hover {
        background: #2980b9 !important;
        transform: scale(1.1);
    }
    
    .error {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: normal;
    }
    
    .checkbox-label input[type="checkbox"] {
        margin-right: 0.5rem;
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
