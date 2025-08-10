// Construction Management App - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    console.log('سیستم مدیریت ساختمان آماده است! 🏗️');
    
    // Initialize the app
    initApp();
});

function initApp() {
    // Add click events to menu items
    setupMenuInteractions();
    
    // Add navigation functionality
    setupNavigation();
    
    // Add animations
    addAnimations();
}

function setupMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Add click animation
            this.classList.add('bounce');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.classList.remove('bounce');
            }, 600);
            
            // Handle different menu items
            handleMenuClick(index);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function handleMenuClick(index) {
    const menuActions = [
        { name: 'پروژه جدید', icon: '🏗️', action: 'createProject' },
        { name: 'کارهای روزانه', icon: '📋', action: 'dailyTasks' },
        { name: 'کارگران', icon: '👷‍♂️', action: 'workers' },
        { name: 'مصالح', icon: '🚛', action: 'materials' },
        { name: 'گزارش', icon: '📊', action: 'reports' },
        { name: 'تنظیمات', icon: '⚙️', action: 'settings' }
    ];
    
    const selectedAction = menuActions[index];
    
    console.log(`انتخاب شد: ${selectedAction.name} ${selectedAction.icon}`);
    
    // Show notification
    showNotification(`${selectedAction.name} انتخاب شد!`, 'success');
    
    // TODO: Navigate to specific page or show modal
    // For now, just log the action
    console.log(`Action: ${selectedAction.action}`);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const navActions = ['home', 'tasks', 'users', 'tools'];
            const action = navActions[index];
            
            console.log(`Navigation: ${action}`);
            showNotification(`منوی ${action} انتخاب شد!`, 'info');
        });
    });
}

function addAnimations() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main');
    mainContent.classList.add('fade-in');
    
    // Add staggered animation to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || '#3498db';
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('fa-IR').format(date);
}

function formatNumber(number) {
    return new Intl.NumberFormat('fa-IR').format(number);
}

// Export functions for use in other modules
window.ConstructionApp = {
    showNotification,
    formatDate,
    formatNumber,
    handleMenuClick
};
