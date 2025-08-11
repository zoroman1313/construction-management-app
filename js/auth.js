// Simple Authentication System - Construction Management App
// Simple authentication system without Firebase

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
        
        // Google Sign-In
        this.setupGoogleSignIn();
        this.updateGoogleStatus();
        
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

    // 🔑 Google Sign-In (GIS if configured; otherwise simulated)
    async signInWithGoogle() {
        try {
            const clientId = window.APP_CONFIG && window.APP_CONFIG.googleClientId;
            if (clientId && window.google && window.google.accounts && window.google.accounts.id) {
                const credential = await this.getGoogleCredentialViaGis(clientId);
                if (!credential) throw new Error('no_credential');
                const profile = this.parseJwt(credential);
                const user = {
                    id: profile.sub,
                    email: profile.email,
                    displayName: profile.name || profile.email,
                    photoURL: profile.picture || null,
                    provider: 'google'
                };
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.showMessage('Signed in with Google! 🎉', 'success');
                this.updateUIForLoggedInUser(user);
                this.closeAuthModal();
                return;
            } else if (window.APP_CONFIG && window.APP_CONFIG.enableGoogleSimulated) {
                const mockUser = {
                    id: 'google_' + Date.now(),
                    email: 'user@gmail.com',
                    displayName: 'Google User',
                    photoURL: null,
                    provider: 'google'
                };
                this.currentUser = mockUser;
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                this.showMessage('Signed in with Google (demo)', 'success');
                this.updateUIForLoggedInUser(mockUser);
                this.closeAuthModal();
            } else {
                this.showMessage('Google sign-in not configured. Set googleClientId in js/config.js or enable simulation temporarily.', 'error');
                this.updateGoogleStatus();
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showMessage('Google sign-in error', 'error');
        }
    }

    getGoogleCredentialViaGis(clientId) {
        return new Promise((resolve, reject) => {
            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        if (response && response.credential) resolve(response.credential);
                    }
                });
                window.google.accounts.id.prompt((notification) => {
                    if (notification && (notification.isNotDisplayed() || notification.isSkippedMoment())) {
                        // Attempt again quickly
                        window.google.accounts.id.prompt();
                    }
                });
                setTimeout(() => resolve(null), 7000);
            } catch (e) { reject(e); }
        });
    }

    updateGoogleStatus() {
        const statusEls = document.querySelectorAll('.google-status');
        const clientId = window.APP_CONFIG && window.APP_CONFIG.googleClientId;
        const sim = window.APP_CONFIG && !!window.APP_CONFIG.enableGoogleSimulated;
        const googleLoaded = !!(window.google && window.google.accounts && window.google.accounts.id);
        let msg = '';
        if (clientId) {
            msg = googleLoaded ? 'Google is ready' : 'Loading Google...';
        } else if (sim) {
            msg = 'Demo mode is enabled (no real connection)';
        } else {
            msg = 'Google is not configured (empty clientId)';
        }
        statusEls.forEach(el => { el.textContent = msg; });
    }

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch { return {}; }
    }

    // 📝 Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            
            // Find user
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                this.showMessage('Signed in successfully! 🎉', 'success');
                this.updateUIForLoggedInUser(user);
                this.closeAuthModal();
            } else {
                this.showMessage('Incorrect email or password', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Sign-in error', 'error');
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
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        const submitBtn = this.registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            // Validation
            if (password.length < 6) {
                this.showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Check if user already exists
            if (this.users.find(u => u.email === email)) {
                this.showMessage('This email is already used', 'error');
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
            
            this.showMessage('Registration successful! 🎉', 'success');
            this.switchToLogin(e);
            
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage('Registration error', 'error');
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
        document.getElementById('authTitle').textContent = 'Register';
        this.showRegister.style.display = 'none';
        this.showLogin.style.display = 'block';
    }

    switchToLogin(e) {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Sign in';
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
                userAvatar.alt = user.displayName || 'Profile photo';
            } else {
                userAvatar.src = 'images/default-avatar.svg';
                userAvatar.alt = 'Profile photo';
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
            
            this.showMessage('Signed out! 👋', 'success');
            
            // Reload page to return to main menu
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Sign-out error', 'error');
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
