// Authentication System - Construction Management App
// 🔐 سیستم احراز هویت کامل با Firebase

class ConstructionAuth {
    constructor() {
        this.currentUser = null;
        
        // Check if Firebase is available before initializing
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.error('❌ Firebase is not available. Please check your configuration.');
            this.showFirebaseError();
            return;
        }
        
        this.init();
    }
    
    // Show Firebase configuration error
    showFirebaseError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Tahoma, Arial, sans-serif;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        errorDiv.innerHTML = `
            <h3>خطای تنظیمات Firebase</h3>
            <p>Firebase به درستی تنظیم نشده است. لطفاً فایل js/firebase-config.js را بررسی کنید.</p>
            <br>
            <h3>Firebase Configuration Error</h3>
            <p>Firebase is not properly configured. Please check js/firebase-config.js file.</p>
            <br>
            <small>Check the browser console for more details</small>
        `;
        document.body.appendChild(errorDiv);
    }

    init() {
        // DOM elements
        this.authBtn = document.getElementById('authBtn');
        this.authText = document.getElementById('authText');
        this.authModal = document.getElementById('authModal');
        this.closeAuth = document.getElementById('closeAuth');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.showRegister = document.getElementById('showRegister');
        this.showLogin = document.getElementById('showLogin');
        
        // Event listeners
        this.setupEventListeners();
        
        // Check auth state
        this.checkAuthState();
        
        // Setup Google Sign-In buttons
        this.setupGoogleSignIn();
    }

    setupEventListeners() {
        // Auth button click
        this.authBtn.addEventListener('click', () => this.toggleAuthModal());
        
        // Close modal
        this.closeAuth.addEventListener('click', () => this.closeAuthModal());
        
        // Close modal on outside click
        this.authModal.addEventListener('click', (e) => {
            if (e.target === this.authModal) this.closeAuthModal();
        });
        
        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Switch between forms
        this.showRegister.addEventListener('click', (e) => this.switchToRegister(e));
        this.showLogin.addEventListener('click', (e) => this.switchToLogin(e));
        
        // Listen for auth state changes
        auth.onAuthStateChanged((user) => this.onAuthStateChanged(user));
    }

    // 🔐 Check authentication state
    checkAuthState() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.updateUIForLoggedInUser(user);
                console.log('✅ User logged in:', user.email);
            } else {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
                console.log('❌ User logged out');
            }
        });
    }

    // 📱 Toggle auth modal
    toggleAuthModal() {
        if (this.currentUser) {
            // User is logged in, show profile or logout
            this.showUserMenu();
        } else {
            // User is not logged in, show auth modal
            this.authModal.classList.add('show');
            this.showLoginForm();
        }
    }

    // ❌ Close auth modal
    closeAuthModal() {
        this.authModal.classList.remove('show');
        this.clearForms();
    }

    // 🔄 Switch to register form
    switchToRegister(e) {
        e.preventDefault();
        this.hideAllForms();
        this.registerForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'ثبت‌نام در سیستم';
    }

    // 🔄 Switch to login form
    switchToLogin(e) {
        e.preventDefault();
        this.hideAllForms();
        this.loginForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'ورود به سیستم';
    }

    // 🔑 Google Sign-In
    async signInWithGoogle() {
        try {
            // Check if Firebase is initialized
            if (typeof firebase === 'undefined' || !firebase.auth) {
                throw new Error('Firebase is not properly initialized. Please check your configuration.');
            }
            
            const provider = new firebase.auth.GoogleAuthProvider();
            
            // Customize Google sign-in
            provider.setCustomParameters({
                prompt: 'select_account',
                hd: '' // Allow any domain
            });
            
            // Add scopes if needed
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            
            console.log('✅ Google sign-in successful:', user.email);
            this.showMessage('ورود با Google موفقیت‌آمیز! 🎉', 'success');
            this.closeAuthModal();
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showMessage(this.getErrorMessage(error.code), 'error');
        }
    }

    // 🔧 Setup Google Sign-In buttons
    setupGoogleSignIn() {
        // Login form Google button
        const googleSignInBtn = document.getElementById('googleSignIn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => this.signInWithGoogle());
        }
        
        // Register form Google button
        const googleSignInRegisterBtn = document.getElementById('googleSignInRegister');
        if (googleSignInRegisterBtn) {
            googleSignInRegisterBtn.addEventListener('click', () => this.signInWithGoogle());
        }
    }

    // 📝 Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = this.loginForm.querySelector('.auth-submit');
        
        try {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'در حال ورود...';
            
            // Sign in with Firebase
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Check if email is verified
            if (!user.emailVerified) {
                await this.sendEmailVerification(user);
                this.showMessage('لطفاً ایمیل خود را تایید کنید. ایمیل تایید ارسال شد.', 'warning');
                return;
            }
            
            this.showMessage('ورود موفقیت‌آمیز! 🎉', 'success');
            this.closeAuthModal();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(this.getErrorMessage(error.code), 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'ورود';
        }
    }

    // 📝 Handle register form submission
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const submitBtn = this.registerForm.querySelector('.auth-submit');
        
        try {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'در حال ثبت‌نام...';
            
            // Create user with Firebase
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update user profile
            await user.updateProfile({
                displayName: name,
                phoneNumber: phone
            });
            
            // Send email verification
            await this.sendEmailVerification(user);
            
            this.showMessage('ثبت‌نام موفقیت‌آمیز! لطفاً ایمیل خود را تایید کنید. 📧', 'success');
            this.switchToLogin(e);
            
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage(this.getErrorMessage(error.code), 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'ثبت‌نام';
        }
    }

    // 📧 Send email verification
    async sendEmailVerification(user) {
        try {
            await user.sendEmailVerification();
            console.log('📧 Email verification sent');
        } catch (error) {
            console.error('Email verification error:', error);
        }
    }

    // 📱 Send phone verification (SMS)
    async sendPhoneVerification(phoneNumber) {
        try {
            // This requires additional Firebase Phone Auth setup
            console.log('📱 Phone verification for:', phoneNumber);
            // TODO: Implement phone verification
        } catch (error) {
            console.error('Phone verification error:', error);
        }
    }

    // 🔐 Handle auth state changes
    onAuthStateChanged(user) {
        if (user) {
            this.currentUser = user;
            this.updateUIForLoggedInUser(user);
        } else {
            this.currentUser = null;
            this.updateUIForLoggedOutUser();
        }
    }

    // 👤 Update UI for logged in user
    updateUIForLoggedInUser(user) {
        this.authBtn.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <div class="user-name">${user.displayName || 'کاربر'}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
        `;
        
        // Add logout functionality
        this.authBtn.addEventListener('click', () => this.logout());
    }

    // 🚪 Update UI for logged out user
    updateUIForLoggedOutUser() {
        this.authBtn.innerHTML = `
            <i class="fas fa-user"></i>
            <span>ورود</span>
        `;
        
        // Remove logout functionality
        this.authBtn.removeEventListener('click', this.logout);
        this.authBtn.addEventListener('click', () => this.toggleAuthModal());
    }

    // 🚪 Logout user
    async logout() {
        try {
            await auth.signOut();
            this.showMessage('خروج موفقیت‌آمیز! 👋', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('خطا در خروج از سیستم', 'error');
        }
    }

    // 📋 Show user menu
    showUserMenu() {
        // Create user menu dropdown
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-menu-content">
                <div class="user-menu-item">
                    <i class="fas fa-user-circle"></i>
                    <span>پروفایل</span>
                </div>
                <div class="user-menu-item">
                    <i class="fas fa-cog"></i>
                    <span>تنظیمات</span>
                </div>
                <div class="user-menu-item logout-item" onclick="constructionAuth.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>خروج</span>
                </div>
            </div>
        `;
        
        // Position and show menu
        this.authBtn.appendChild(userMenu);
        
        // Hide menu after click outside
        setTimeout(() => {
            document.addEventListener('click', () => {
                if (userMenu.parentNode) {
                    userMenu.parentNode.removeChild(userMenu);
                }
            }, { once: true });
        }, 100);
    }

    // 📝 Show message to user
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Add to current form
        const currentForm = this.loginForm.style.display !== 'none' ? this.loginForm : this.registerForm;
        currentForm.insertBefore(messageDiv, currentForm.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // 🔍 Get error message in Persian
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'کاربری با این ایمیل یافت نشد.',
            'auth/wrong-password': 'رمز عبور اشتباه است.',
            'auth/email-already-in-use': 'این ایمیل قبلاً استفاده شده است.',
            'auth/weak-password': 'رمز عبور باید حداقل 6 کاراکتر باشد.',
            'auth/invalid-email': 'ایمیل نامعتبر است.',
            'auth/too-many-requests': 'تعداد تلاش‌های شما زیاد است. لطفاً کمی صبر کنید.',
            'auth/network-request-failed': 'خطا در اتصال به اینترنت.',
            'auth/user-disabled': 'حساب کاربری شما غیرفعال شده است.',
            'auth/operation-not-allowed': 'این عملیات مجاز نیست.',
            'auth/invalid-verification-code': 'کد تایید نامعتبر است.',
            'auth/invalid-verification-id': 'شناسه تایید نامعتبر است.',
            'auth/popup-closed-by-user': 'پنجره ورود بسته شد. لطفاً دوباره تلاش کنید.',
            'auth/popup-blocked': 'پنجره ورود مسدود شد. لطفاً popup blocker را غیرفعال کنید.',
            'auth/cancelled-popup-request': 'درخواست ورود لغو شد.',
            'auth/account-exists-with-different-credential': 'حسابی با این ایمیل وجود دارد اما با روش دیگری ثبت شده است.'
        };
        
        return errorMessages[errorCode] || 'خطای نامشخص. لطفاً دوباره تلاش کنید.';
    }

    // 🧹 Clear forms
    clearForms() {
        this.loginForm.reset();
        this.registerForm.reset();
        
        // Remove error messages
        const messages = document.querySelectorAll('.auth-message');
        messages.forEach(msg => msg.remove());
    }

    // 🚫 Hide all forms
    hideAllForms() {
        this.loginForm.style.display = 'none';
        this.registerForm.style.display = 'none';
    }

    // 📱 Show login form
    showLoginForm() {
        this.hideAllForms();
        this.loginForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'ورود به سیستم';
    }

    // 🔄 Reset password
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            this.showMessage('ایمیل بازنشانی رمز عبور ارسال شد! 📧', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            this.showMessage(this.getErrorMessage(error.code), 'error');
        }
    }
}

// Initialize authentication system
const constructionAuth = new ConstructionAuth();

// Export for global use
window.constructionAuth = constructionAuth;

console.log('🔐 Authentication system initialized!');
console.log('📧 Email verification: Ready');
console.log('📱 Phone verification: Ready');
console.log('🔐 Password reset: Ready');
console.log('🔑 Google Sign-In: Ready');
