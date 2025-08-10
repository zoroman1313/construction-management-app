// Users Management System - Construction Management App
// سیستم مدیریت کاربران - اپلیکیشن مدیریت ساختمان

class UsersManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('constructionUsers')) || [];
        this.currentCategory = null;
        this.init();
    }

    init() {
        console.log('👥 Users management system initialized');
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load and display user counts
        this.updateUserCounts();
        
        // Load user categories
        this.loadUserCategories();
    }

    initializeEventListeners() {
        // User category clicks
        const userCategories = document.querySelectorAll('.user-category');
        userCategories.forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryType = e.currentTarget.dataset.category;
                this.showUserCategory(categoryType);
            });
        });

        // Add user form submission
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => this.handleAddUser(e));
        }

        // Modal close events
        const addUserModal = document.getElementById('addUserModal');
        if (addUserModal) {
            addUserModal.addEventListener('click', (e) => {
                if (e.target === addUserModal) {
                    this.closeAddUserModal();
                }
            });
        }
    }

    // 📊 Update user counts for each category
    updateUserCounts() {
        const categories = ['jobseekers', 'workers', 'specialists', 'contractors'];
        
        categories.forEach(category => {
            const count = this.users.filter(user => user.category === category).length;
            const countElement = document.getElementById(`${category}Count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    // 📁 Load user categories from localStorage
    loadUserCategories() {
        // Add some sample users if none exist
        if (this.users.length === 0) {
            this.addSampleUsers();
        }
    }

    // 📝 Add sample users for demonstration
    addSampleUsers() {
        const sampleUsers = [
            {
                id: '1',
                name: 'علی احمدی',
                phone: '09123456789',
                category: 'jobseekers',
                skills: 'کارگر ساده، بیل‌زنی',
                experience: 2,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'محمد رضایی',
                phone: '09187654321',
                category: 'workers',
                skills: 'سیمان‌کاری، گچ‌کاری',
                experience: 5,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'حسن کریمی',
                phone: '09111223344',
                category: 'specialists',
                skills: 'مهندس عمران، طراحی سازه',
                experience: 8,
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'رضا نوری',
                phone: '09155667788',
                category: 'contractors',
                skills: 'مدیریت پروژه، پیمانکاری',
                experience: 12,
                createdAt: new Date().toISOString()
            }
        ];

        this.users = sampleUsers;
        localStorage.setItem('constructionUsers', JSON.stringify(this.users));
        this.updateUserCounts();
    }

    // 👥 Show specific user category
    showUserCategory(category) {
        this.currentCategory = category;
        const categoryUsers = this.users.filter(user => user.category === category);
        
        // Create category page content
        this.createCategoryPage(category, categoryUsers);
    }

    // 📄 Create category page
    createCategoryPage(category, users) {
        const main = document.querySelector('.main .container');
        const categoryNames = {
            'jobseekers': 'کارجویان',
            'workers': 'کارگران',
            'specialists': 'متخصصین',
            'contractors': 'پیمانکاران'
        };

        const categoryName = categoryNames[category] || category;
        
        main.innerHTML = `
            <div class="page-header">
                <button class="back-btn" onclick="usersManager.goBackToUsers()">
                    <i class="fas fa-arrow-right"></i>
                    <span>بازگشت</span>
                </button>
                <h1 class="page-title">${categoryName}</h1>
            </div>
            
            <div class="category-stats">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <span class="stat-number">${users.length}</span>
                    <span class="stat-label">کل ${categoryName}</span>
                </div>
            </div>
            
            <div class="users-list">
                ${users.length > 0 ? this.renderUsersList(users) : this.renderEmptyState(categoryName)}
            </div>
            
            <div class="action-buttons">
                <button class="add-btn" onclick="usersManager.showAddUserForm()">
                    <i class="fas fa-plus"></i>
                    <span>افزودن ${categoryName.slice(0, -1)} جدید</span>
                </button>
            </div>
        `;
    }

    // 📋 Render users list
    renderUsersList(users) {
        return `
            <div class="users-grid">
                ${users.map(user => this.renderUserCard(user)).join('')}
            </div>
        `;
    }

    // 🃏 Render individual user card
    renderUserCard(user) {
        const categoryIcons = {
            'jobseekers': 'fas fa-search',
            'workers': 'fas fa-hammer',
            'specialists': 'fas fa-user-tie',
            'contractors': 'fas fa-hard-hat'
        };

        const icon = categoryIcons[user.category] || 'fas fa-user';
        
        return `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-card-header">
                    <div class="user-avatar">
                        <i class="${icon}"></i>
                    </div>
                    <div class="user-actions">
                        <button class="action-btn edit-btn" onclick="usersManager.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="usersManager.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="user-card-body">
                    <h3 class="user-name">${user.name}</h3>
                    <p class="user-phone">
                        <i class="fas fa-phone"></i>
                        ${user.phone}
                    </p>
                    ${user.skills ? `
                        <p class="user-skills">
                            <i class="fas fa-tools"></i>
                            ${user.skills}
                        </p>
                    ` : ''}
                    ${user.experience ? `
                        <p class="user-experience">
                            <i class="fas fa-clock"></i>
                            ${user.experience} سال تجربه
                        </p>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // 📭 Render empty state
    renderEmptyState(categoryName) {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>هیچ ${categoryName.slice(0, -1)}ی یافت نشد</h3>
                <p>هنوز ${categoryName.slice(0, -1)}ی اضافه نکرده‌اید</p>
                <button class="add-btn" onclick="usersManager.showAddUserForm()">
                    <i class="fas fa-plus"></i>
                    <span>افزودن اولین ${categoryName.slice(0, -1)}</span>
                </button>
            </div>
        `;
    }

    // ➕ Show add user form
    showAddUserForm() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Pre-select category if we're in a specific category
            if (this.currentCategory) {
                const categorySelect = document.getElementById('userCategory');
                if (categorySelect) {
                    categorySelect.value = this.currentCategory;
                }
            }
        }
    }

    // ❌ Close add user modal
    closeAddUserModal() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('addUserForm').reset();
        }
    }

    // 📝 Handle add user form submission
    handleAddUser(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            id: Date.now().toString(),
            name: document.getElementById('userName').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            category: document.getElementById('userCategory').value,
            skills: document.getElementById('userSkills').value.trim(),
            experience: parseInt(document.getElementById('userExperience').value) || 0,
            createdAt: new Date().toISOString()
        };

        // Validation
        if (!userData.name || !userData.phone || !userData.category) {
            this.showMessage('لطفاً تمام فیلدهای ضروری را پر کنید', 'error');
            return;
        }

        // Add user
        this.users.push(userData);
        localStorage.setItem('constructionUsers', JSON.stringify(this.users));
        
        this.showMessage('کاربر با موفقیت اضافه شد! 🎉', 'success');
        this.closeAddUserModal();
        
        // Update UI
        this.updateUserCounts();
        
        // If we're in a category view, refresh it
        if (this.currentCategory) {
            this.showUserCategory(this.currentCategory);
        }
    }

    // ✏️ Edit user
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // For now, just show a message
        this.showMessage(`ویرایش کاربر ${user.name} - این قابلیت به زودی اضافه خواهد شد`, 'info');
    }

    // 🗑️ Delete user
    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`آیا مطمئن هستید که می‌خواهید ${user.name} را حذف کنید؟`)) {
            this.users = this.users.filter(u => u.id !== userId);
            localStorage.setItem('constructionUsers', JSON.stringify(this.users));
            
            this.showMessage('کاربر با موفقیت حذف شد', 'success');
            this.updateUserCounts();
            
            // If we're in a category view, refresh it
            if (this.currentCategory) {
                this.showUserCategory(this.currentCategory);
            }
        }
    }

    // 🔙 Go back to users main page
    goBackToUsers() {
        window.location.reload();
    }

    // 💬 Show message to user
    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Add to page
        document.body.appendChild(messageDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
function goBack() {
    window.history.back();
}

function showAddUserForm() {
    if (window.usersManager) {
        window.usersManager.showAddUserForm();
    }
}

function closeAddUserModal() {
    if (window.usersManager) {
        window.usersManager.closeAddUserModal();
    }
}

// Initialize users manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.usersManager = new UsersManager();
});

console.log('👥 Users management system loaded!');
