// Main Application Script - Construction Management System
// Main app script - Construction Management System

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ Construction Management System is ready');
    
    // Initialize main menu functionality
    initializeMainMenu();
    
    // Initialize authentication system
    if (typeof SimpleAuth !== 'undefined') {
        try {
            window.simpleAuth = new SimpleAuth();
        } catch (error) {
            console.error('❌ Error initializing authentication:', error);
        }
    } else {
        console.warn('⚠️ SimpleAuth class not found. Make sure auth.js is loaded.');
    }
    
    // Add mobile-specific enhancements
    initializeMobileEnhancements();
});

// Mobile-specific enhancements
function initializeMobileEnhancements() {
    // Add touch-friendly interactions
    addTouchSupport();
    
    // Handle mobile orientation changes
    handleOrientationChange();
    
    // Add mobile navigation improvements
    enhanceMobileNavigation();
}

// Add touch support for better mobile experience
function addTouchSupport() {
    // Add touch feedback for menu items
    const menuItems = document.querySelectorAll('.menu-item, .user-category, .contractor-service, .provider-category');
    
    menuItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        item.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        item.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
}

// Handle mobile orientation changes
function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
        // Small delay to let orientation change complete
        setTimeout(() => {
            // Recalculate any layout-dependent elements
            adjustLayoutForOrientation();
        }, 100);
    });
}

// Adjust layout based on orientation
function adjustLayoutForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const container = document.querySelector('.container');
    
    if (isLandscape && window.innerWidth <= 767) {
        // Landscape mobile - adjust spacing
        if (container) {
            container.style.padding = '0 0.5rem';
        }
    } else if (!isLandscape && window.innerWidth <= 767) {
        // Portrait mobile - restore normal spacing
        if (container) {
            container.style.padding = '0 1rem';
        }
    }
}

// Enhance mobile navigation
function enhanceMobileNavigation() {
    // Add swipe gestures for navigation (if supported)
    if ('ontouchstart' in window) {
        addSwipeSupport();
    }
    
    // Improve mobile menu accessibility
    improveMobileAccessibility();
}

// Add swipe support for mobile navigation
function addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        handleSwipe();
    });
    
    function handleSwipe() {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const minSwipeDistance = 50;
        
        // Horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - could be used for navigation
                console.log('Swipe left detected');
            } else {
                // Swipe right - could be used for back navigation
                console.log('Swipe right detected');
            }
        }
    }
}

// Improve mobile accessibility
function improveMobileAccessibility() {
    // Add better focus management for mobile
    const focusableElements = document.querySelectorAll('button, input, a, .menu-item, .user-category, .contractor-service, .provider-category');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            // Ensure element is visible on mobile
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

// Main Menu Functionality
function initializeMainMenu() {
    // Users Menu - jobseekers, workers, specialists and contractors
    const usersMenu = document.getElementById('usersMenu');
    if (usersMenu) {
        usersMenu.addEventListener('click', () => {
            // Always redirect to login page with intended destination
            localStorage.setItem('intendedDestination', 'users');
            window.location.href = 'pages/login.html?destination=users';
        });
    }
    
    // Contractors Menu - contractor-specific services
    const contractorsMenu = document.getElementById('contractorsMenu');
    if (contractorsMenu) {
        contractorsMenu.addEventListener('click', () => {
            // Always redirect to login page with intended destination
            localStorage.setItem('intendedDestination', 'contractors');
            window.location.href = 'pages/login.html?destination=contractors';
        });
    }
    
    // Service Providers Menu - providers
    const providersMenu = document.getElementById('providersMenu');
    if (providersMenu) {
        providersMenu.addEventListener('click', () => {
            // Always redirect to login page with intended destination
            localStorage.setItem('intendedDestination', 'providers');
            window.location.href = 'pages/login.html?destination=providers';
        });
    }
    
    // Check if user is already logged in and show appropriate UI
    checkInitialAuthState();
}

// Check initial authentication state
function checkInitialAuthState() {
    // Check if user is logged in using SimpleAuth
    if (window.simpleAuth && window.simpleAuth.currentUser) {
        console.log('✅ User already logged in:', window.simpleAuth.currentUser.email);
        // Update UI to show user profile
        window.simpleAuth.updateUIForLoggedInUser(window.simpleAuth.currentUser);
    }
}

// Navigation function
function navigateToSection(section) {
    console.log(`🚀 Navigating to ${section} section`);
    
    // Check if user is authenticated using SimpleAuth
    if (window.simpleAuth && window.simpleAuth.isLoggedIn()) {
        // User is logged in, proceed to section
        console.log('✅ User authenticated, proceeding to section');
        proceedToSection(section);
    } else {
        // User is not logged in, redirect to login page
        console.log('❌ User not authenticated, redirecting to login page');
        localStorage.setItem('intendedDestination', section);
        window.location.href = `pages/login.html?destination=${section}`;
    }
}

// Show login prompt for specific section (deprecated - now redirects to login page)
function showLoginPrompt(section) {
    console.log('⚠️ showLoginPrompt is deprecated, redirecting to login page');
    localStorage.setItem('intendedDestination', section);
    window.location.href = `pages/login.html?destination=${section}`;
}

// Get Persian section name
function getSectionName(section) {
    const sectionNames = {
        'users': 'Users',
        'contractors': 'Contractors',
        'providers': 'Providers'
    };
    return sectionNames[section] || section;
}

// Proceed to section after authentication
function proceedToSection(section) {
    console.log(`🎯 Proceeding to section: ${section}`);
    
    // Navigate directly to the selected section
    switch(section) {
        case 'users':
            console.log('👥 Navigating to users page');
            window.location.href = 'pages/users.html';
            break;
        case 'contractors':
            console.log('🏗️ Navigating to contractors page');
            window.location.href = 'pages/contractors.html';
            break;
        case 'providers':
            console.log('🤝 Navigating to providers page');
            window.location.href = 'pages/providers.html';
            break;
        default:
            console.log('❓ Unknown section:', section);
            // Go back to main page
            window.location.href = 'index.html';
    }
}

// These functions are now deprecated - navigation is handled directly in proceedToSection

// Go back to main menu
function goBackToMain() {
    location.reload(); // Simple way to go back for now
}

// Show loading message
function showLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide loading message
function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Placeholder functions for future implementation
function showUserCategory(category) {
    console.log('Showing user category:', category);
    // Will be implemented when building specific pages
}

function showContractorService(service) {
    console.log('Showing contractor service:', service);
    // Will be implemented when building specific pages
}

function showProviderCategory(category) {
    console.log('Showing provider category:', category);
    // Will be implemented when building specific pages
}

// Mobile-specific utility functions
function isMobileDevice() {
    return window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getMobileBreakpoint() {
    if (window.innerWidth <= 480) return 'xs';
    if (window.innerWidth <= 767) return 'sm';
    if (window.innerWidth <= 1023) return 'md';
    return 'lg';
}

// Add mobile-specific event listeners
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        adjustLayoutForOrientation();
    }, 250);
});

// Add mobile-specific CSS classes
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile detection classes to body
    const body = document.body;
    if (isMobileDevice()) {
        body.classList.add('mobile-device');
        body.classList.add(`breakpoint-${getMobileBreakpoint()}`);
    }
    
    // Update classes on resize
    window.addEventListener('resize', function() {
        body.className = body.className.replace(/breakpoint-\w+/g, '');
        body.classList.add(`breakpoint-${getMobileBreakpoint()}`);
    });
});
