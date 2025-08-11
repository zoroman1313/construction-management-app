// Users Management System - Construction Management App
// Users management system - Construction Management App

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
                name: 'Ali Ahmadi',
                phone: '09123456789',
                category: 'jobseekers',
                skills: 'General laborer, digging',
                experience: 2,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Mohammad Rezaei',
                phone: '09187654321',
                category: 'workers',
                skills: 'Plastering, cement work',
                experience: 5,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Hassan Karimi',
                phone: '09111223344',
                category: 'specialists',
                skills: 'Civil engineer, structural design',
                experience: 8,
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Reza Noori',
                phone: '09155667788',
                category: 'contractors',
                skills: 'Project management, contracting',
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
            'jobseekers': 'Jobseekers',
            'workers': 'Workers',
            'specialists': 'Specialists',
            'contractors': 'Contractors'
        };

        const categoryName = categoryNames[category] || category;
        
        main.innerHTML = `
            <div class="page-header">
                <button class="back-btn" onclick="usersManager.goBackToUsers()">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <h1 class="page-title">${categoryName}</h1>
            </div>
            
            <div class="category-stats">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <span class="stat-number">${users.length}</span>
                    <span class="stat-label">Total ${categoryName}</span>
                </div>
            </div>
            
            <div class="users-list">
                ${users.length > 0 ? this.renderUsersList(users) : this.renderEmptyState(categoryName)}
            </div>
            
            <div class="action-buttons">
                <button class="add-btn" onclick="usersManager.showAddUserForm()">
                    <i class="fas fa-plus"></i>
                    <span>Add new ${categoryName.slice(0, -1)}</span>
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
                            ${user.experience} years experience
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
                <h3>No ${categoryName.slice(0, -1)} found</h3>
                <p>You have not added any ${categoryName.slice(0, -1)} yet</p>
                <button class="add-btn" onclick="usersManager.showAddUserForm()">
                    <i class="fas fa-plus"></i>
                    <span>Add the first ${categoryName.slice(0, -1)}</span>
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
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        // Add user
        this.users.push(userData);
        localStorage.setItem('constructionUsers', JSON.stringify(this.users));
        
        this.showMessage('User added successfully! 🎉', 'success');
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
        this.showMessage(`Edit user ${user.name} - This feature will be added soon`, 'info');
    }

    // 🗑️ Delete user
    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            this.users = this.users.filter(u => u.id !== userId);
            localStorage.setItem('constructionUsers', JSON.stringify(this.users));
            
            this.showMessage('User deleted successfully', 'success');
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
