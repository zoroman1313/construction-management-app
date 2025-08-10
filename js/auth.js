// Simple Authentication System - Construction Management App
// 🔐 سیستم احراز هویت ساده بدون Firebase

class SimpleAuth {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.pendingSection = null;
        this.init();
    }

    init() {
        // DOM elements
        this.authModal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.showLogin = document.getElementById('showLogin');
        this.showRegister = document.getElementById('showRegister');
        this.closeAuth = document.getElementById('closeAuth');

        // Event listeners
        if (this.closeAuth) {
            this.closeAuth.addEventListener('click', () => this.closeAuthModal());
        }
        if (this.showRegister) {
            this.showRegister.addEventListener('click', (e) => this.switchToRegister(e));
        }
        if (this.showLogin) {
            this.showLogin.addEventListener('click', (e) => this.switchToLogin(e));
        }
        
        // Google Sign-In buttons (simulated)
        this.setupGoogleSignIn();
        
        // Check auth state
        this.checkAuthState();
    }

    // 🔐 Check authentication state
    checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser(this.currentUser);
        } else {
            this.updateUIForLoggedOutUser();
        }
    }

    // 🔑 Simulated Google Sign-In
    async signInWithGoogle() {
        try {
            // Simulate Google sign-in
            const mockUser = {
                id: 'google_' + Date.now(),
                email: 'user@gmail.com',
                displayName: 'کاربر Google',
                photoURL: null,
                provider: 'google'
            };
            
            this.currentUser = mockUser;
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            this.showMessage('ورود با Google موفقیت‌آمیز! 🎉', 'success');
            this.updateUIForLoggedInUser(mockUser);
            this.closeAuthModal();
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showMessage('خطا در ورود با Google', 'error');
        }
    }

    // 📝 Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!email || !password) {
            this.showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }
        
        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'در حال ورود...';
            
            // Find user
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                this.showMessage('ورود موفقیت‌آمیز! 🎉', 'success');
                this.updateUIForLoggedInUser(user);
                this.closeAuthModal();
            } else {
                this.showMessage('ایمیل یا رمز عبور اشتباه است', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('خطا در ورود', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // 📝 Handle register form submission
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        
        if (!name || !email || !phone || !password) {
            this.showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }
        
        const submitBtn = this.registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'در حال ثبت‌نام...';
            
            // Validation
            if (password.length < 6) {
                this.showMessage('رمز عبور باید حداقل 6 کاراکتر باشد', 'error');
                return;
            }
            
            // Check if user already exists
            if (this.users.find(u => u.email === email)) {
                this.showMessage('این ایمیل قبلاً استفاده شده است', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email: email,
                displayName: name,
                phone: phone,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            // Add to users array
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.showMessage('ثبت‌نام موفقیت‌آمیز! 🎉', 'success');
            this.switchToLogin(e);
            
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage('خطا در ثبت‌نام', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // ===== Programmatic API used by login-page.js =====
    async login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) return false;
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUIForLoggedInUser(user);
        return true;
    }

    async register(name, email, phone, password, extra = {}) {
        if (this.users.find(u => u.email === email)) return false;
        const newUser = {
            id: Date.now().toString(),
            displayName: name,
            email, phone, password,
            profile: extra,
            createdAt: new Date().toISOString(),
        };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }

    async googleSignIn() {
        await this.signInWithGoogle();
        return true;
    }

    // 🔄 Switch between login and register forms
    switchToRegister(e) {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'ثبت‌نام در سیستم';
        this.showRegister.style.display = 'none';
        this.showLogin.style.display = 'block';
    }

    switchToLogin(e) {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'ورود به سیستم';
        this.showLogin.style.display = 'none';
        this.showRegister.style.display = 'block';
    }

    // 🚪 Open authentication modal
    openAuthModal() {
        this.authModal.style.display = 'flex';
        // Reset forms
        this.loginForm.reset();
        this.registerForm.reset();
    }

    // 🚪 Close authentication modal
    closeAuthModal() {
        this.authModal.style.display = 'none';
        // Reset forms
        this.loginForm.reset();
        this.registerForm.reset();
    }

    // 🔐 Setup Google Sign-In buttons
    setupGoogleSignIn() {
        const googleBtns = document.querySelectorAll('.google-signin-btn');
        googleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.signInWithGoogle());
        });
    }

    // 📱 Update UI for logged-in user
    updateUIForLoggedInUser(user) {
        // Hide auth section and show user profile
        const authSection = document.getElementById('authSection');
        const userProfile = document.getElementById('userProfile');
        
        if (authSection) authSection.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        
        // Update user info
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName && user.displayName) {
            userName.textContent = user.displayName;
        }
        
        // Update avatar
        if (userAvatar) {
            if (user.photoURL) {
                userAvatar.src = user.photoURL;
                userAvatar.alt = user.displayName || 'عکس پروفایل';
            } else {
                userAvatar.src = 'images/default-avatar.svg';
                userAvatar.alt = 'عکس پروفایل';
            }
        }
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Add event listeners to forms
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // 📱 Update UI for logged-out user
    updateUIForLoggedOutUser() {
        // Show auth section and hide user profile
        const authSection = document.getElementById('authSection');
        const userProfile = document.getElementById('userProfile');
        
        if (authSection) authSection.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
        
        // Add auth button functionality
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.openAuthModal());
        }
    }

    // 🚪 Logout user
    async logout() {
        try {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            
            this.showMessage('خروج موفقیت‌آمیز! 👋', 'success');
            
            // Reload page to return to main menu
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('خطا در خروج', 'error');
        }
    }

    // 🔍 Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // 👤 Get current user
    getCurrentUser() {
        return this.currentUser;
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

// Initialize authentication system
const simpleAuth = new SimpleAuth();

// Export for global use
window.simpleAuth = simpleAuth;

console.log('🔐 Simple authentication system initialized!');
console.log('📧 Local storage authentication: Ready');
console.log('🔑 Google Sign-In (simulated): Ready');
console.log('📱 No Firebase required: Ready');
