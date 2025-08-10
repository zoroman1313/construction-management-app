// Main Application Script - Construction Management System
// اسکریپت اصلی اپلیکیشن - سیستم مدیریت ساختمان

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ سیستم مدیریت ساختمان آماده است');
    
    // Initialize main menu functionality
    initializeMainMenu();
    
    // Initialize authentication system
    if (typeof ConstructionAuth !== 'undefined') {
        try {
            new ConstructionAuth();
        } catch (error) {
            console.error('❌ Error initializing authentication:', error);
        }
    } else {
        console.warn('⚠️ ConstructionAuth class not found. Make sure auth.js is loaded.');
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
    // Users Menu - کارجویان، کارگران، متخصصین و پیمانکاران
    const usersMenu = document.getElementById('usersMenu');
    if (usersMenu) {
        usersMenu.addEventListener('click', () => {
            navigateToSection('users');
        });
    }
    
    // Contractors Menu - خدمات مخصوص پیمانکاران
    const contractorsMenu = document.getElementById('contractorsMenu');
    if (contractorsMenu) {
        contractorsMenu.addEventListener('click', () => {
            navigateToSection('contractors');
        });
    }
    
    // Service Providers Menu - ارایه دهندگان خدمات
    const providersMenu = document.getElementById('providersMenu');
    if (providersMenu) {
        providersMenu.addEventListener('click', () => {
            navigateToSection('providers');
        });
    }
    
    // Check if user is already logged in and show appropriate UI
    checkInitialAuthState();
}

// Check initial authentication state
function checkInitialAuthState() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            console.log('✅ User already logged in:', currentUser.email);
            // Update UI to show user profile
            if (window.constructionAuth) {
                window.constructionAuth.updateUIForLoggedInUser(currentUser);
            }
        }
    }
}

// Navigation function
function navigateToSection(section) {
    console.log(`🚀 Navigating to ${section} section`);
    
    // Check if user is authenticated
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const currentUser = firebase.auth().currentUser;
        
        if (!currentUser) {
            // User is not logged in, show login modal
            console.log('❌ User not authenticated, showing login modal');
            if (window.constructionAuth) {
                console.log('🔐 Using constructionAuth for login');
                window.constructionAuth.showLoginForSection(section);
            } else {
                // Fallback: show simple login prompt
                console.log('⚠️ constructionAuth not available, showing fallback login prompt');
                showLoginPrompt(section);
            }
            return;
        } else {
            // User is logged in, proceed to section
            console.log('✅ User authenticated, proceeding to section');
            proceedToSection(section);
        }
    } else {
        // Firebase not available, proceed without auth check
        console.log('⚠️ Firebase not available, proceeding without auth check');
        proceedToSection(section);
    }
}

// Show login prompt for specific section
function showLoginPrompt(section) {
    const message = `برای دسترسی به بخش "${getSectionName(section)}" ابتدا باید وارد شوید.`;
    console.log('📝 Showing login prompt:', message);
    alert(message);
    
    // Try to show auth modal if available
    if (window.constructionAuth) {
        console.log('🔐 Attempting to show auth modal');
        window.constructionAuth.toggleAuthModal();
    } else {
        console.log('❌ constructionAuth not available for modal display');
    }
}

// Get Persian section name
function getSectionName(section) {
    const sectionNames = {
        'users': 'کاربران',
        'contractors': 'پیمانکاران',
        'providers': 'ارایه دهندگان'
    };
    return sectionNames[section] || section;
}

// Proceed to section after authentication
function proceedToSection(section) {
    console.log(`🎯 Proceeding to section: ${section}`);
    
    // Show loading state
    showLoadingMessage();
    
    // Simulate navigation (will be replaced with actual page navigation)
    setTimeout(() => {
        hideLoadingMessage();
        
        switch(section) {
            case 'users':
                console.log('👥 Showing users section');
                showUsersSection();
                break;
            case 'contractors':
                console.log('🏗️ Showing contractors section');
                showContractorsSection();
                break;
            case 'providers':
                console.log('🤝 Showing providers section');
                showProvidersSection();
                break;
            default:
                console.log('❓ Unknown section:', section);
        }
        
        // Reinitialize mobile enhancements for new content
        setTimeout(() => {
            initializeMobileEnhancements();
        }, 100);
    }, 1000);
}

// Show Users Section
function showUsersSection() {
    const mainContent = document.querySelector('.main .container');
    mainContent.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="goBackToMain()">
                <i class="fas fa-arrow-right"></i>
                بازگشت
            </button>
            <h1 class="section-title">مدیریت کاربران</h1>
            <p class="section-subtitle">کارجویان، کارگران، متخصصین و پیمانکاران</p>
        </div>
        
        <div class="users-grid">
            <div class="user-category" onclick="showUserCategory('jobseekers')">
                <div class="category-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>کارجویان</h3>
                <p>کسانی که دنبال کار می‌گردند</p>
            </div>
            
            <div class="user-category" onclick="showUserCategory('workers')">
                <div class="category-icon">
                    <i class="fas fa-user-hard-hat"></i>
                </div>
                <h3>کارگران</h3>
                <p>کارگران ساده و متخصص</p>
            </div>
            
            <div class="user-category" onclick="showUserCategory('contractors')">
                <div class="category-icon">
                    <i class="fas fa-hard-hat"></i>
                </div>
                <h3>پیمانکاران</h3>
                <p>پیمانکاران و شرکت‌های ساختمانی</p>
            </div>
        </div>
    `;
}

// Show Contractors Section
function showContractorsSection() {
    const mainContent = document.querySelector('.main .container');
    mainContent.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="goBackToMain()">
                <i class="fas fa-arrow-right"></i>
                بازگشت
            </button>
            <h1 class="section-title">خدمات پیمانکاران</h1>
            <p class="section-subtitle">گزارش، برآورد، پروژه‌های جدید و در حال اجرا</p>
        </div>
        
        <div class="contractors-grid">
            <div class="contractor-service" onclick="showContractorService('reports')">
                <div class="service-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3>گزارش‌ها</h3>
                <p>گزارش‌های مالی و پیشرفت پروژه</p>
            </div>
            
            <div class="contractor-service" onclick="showContractorService('estimates')">
                <div class="service-icon">
                    <i class="fas fa-calculator"></i>
                </div>
                <h3>برآورد پروژه</h3>
                <p>محاسبه هزینه و زمان پروژه</p>
            </div>
            
            <div class="contractor-service" onclick="showContractorService('projects')">
                <div class="service-icon">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <h3>مدیریت پروژه</h3>
                <p>پروژه‌های جدید و در حال اجرا</p>
            </div>
        </div>
    `;
}

// Show Providers Section
function showProvidersSection() {
    const mainContent = document.querySelector('.main .container');
    mainContent.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="goBackToMain()">
                <i class="fas fa-arrow-right"></i>
                بازگشت
            </button>
            <h1 class="section-title">ارایه دهندگان</h1>
            <p class="section-subtitle">کسانی که کار یا جنسی دارند و دنبال خریدار یا نیرو می‌گردند</p>
        </div>
        
        <div class="providers-grid">
            <div class="provider-category" onclick="showProviderCategory('services')">
                <div class="category-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <h3>خدمات</h3>
                <p>ارایه خدمات ساختمانی</p>
            </div>
            
            <div class="provider-category" onclick="showProviderCategory('materials')">
                <div class="category-icon">
                    <i class="fas fa-truck"></i>
                </div>
                <h3>مصالح</h3>
                <p>فروش مصالح ساختمانی</p>
            </div>
            
            <div class="provider-category" onclick="showProviderCategory('equipment')">
                <div class="category-icon">
                    <i class="fas fa-cogs"></i>
                </div>
                <h3>تجهیزات</h3>
                <p>اجاره و فروش تجهیزات</p>
            </div>
        </div>
    `;
}

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
            <p>در حال بارگذاری...</p>
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
