// Main Application Script - Construction Management System
// اسکریپت اصلی اپلیکیشن - سیستم مدیریت ساختمان

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ سیستم مدیریت ساختمان آماده است');
    
    // Initialize main menu functionality
    initializeMainMenu();
    
    // Initialize authentication system
    if (typeof ConstructionAuth !== 'undefined') {
        new ConstructionAuth();
    }
});

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
}

// Navigation function
function navigateToSection(section) {
    console.log(`🚀 Navigating to ${section} section`);
    
    // Show loading state
    showLoadingMessage();
    
    // Simulate navigation (will be replaced with actual page navigation)
    setTimeout(() => {
        hideLoadingMessage();
        
        switch(section) {
            case 'users':
                showUsersSection();
                break;
            case 'contractors':
                showContractorsSection();
                break;
            case 'providers':
                showProvidersSection();
                break;
            default:
                console.log('Unknown section:', section);
        }
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
