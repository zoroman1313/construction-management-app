// Login Page Script - Construction Management App
// اسکریپت صفحه لاگین - اپلیکیشن مدیریت ساختمان

class LoginPageManager {
    constructor() {
        this.intendedDestination = this.getIntendedDestination();
        // OTP and verification state
        this.emailOtp = null;
        this.smsOtp = null;
        this.emailVerified = false;
        this.phoneVerified = false;
        this.emailTimer = null;
        this.smsTimer = null;
        this.init();
    }

    init() {
        console.log('🔐 Login page manager initialized');
        this.setupEventListeners();
        this.setupRegisterEnhancements();
        this.checkAuthState();
        this.updateUI();
    }

    setupEventListeners() {
        // Switch between login and register forms
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToRegister();
            });
        }
        
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Google Sign-In buttons
        const googleSignIn = document.getElementById('googleSignIn');
        const googleSignInRegister = document.getElementById('googleSignInRegister');
        
        if (googleSignIn) {
            googleSignIn.addEventListener('click', () => this.handleGoogleSignIn());
        }
        
        if (googleSignInRegister) {
            googleSignInRegister.addEventListener('click', () => this.handleGoogleSignIn());
        }
    }

    switchToRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }

    switchToLogin() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            // Use the global SimpleAuth instance
            if (window.simpleAuth) {
                const success = await window.simpleAuth.login(email, password);
                if (success) {
                    this.redirectAfterLogin();
                } else {
                    this.showMessage('ایمیل یا رمز عبور اشتباه است', 'error');
                }
            } else {
                this.showMessage('خطا در سیستم احراز هویت', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('خطا در ورود به سیستم', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        
        // Extra profile fields
        const extra = {
            country: (document.getElementById('country')||{}).value,
            postalCode: (document.getElementById('postalCode')||{}).value,
            city: (document.getElementById('city')||{}).value,
            province: (document.getElementById('province')||{}).value,
            addressLine: (document.getElementById('addressLine')||{}).value,
            emailVerified: this.emailVerified,
            phoneVerified: this.phoneVerified,
        };
        
        // Basic validations
        if (!this.emailVerified) { this.showMessage('ایمیل تایید نشده است', 'error'); return; }
        if (!this.phoneVerified) { this.showMessage('شماره تلفن تایید نشده است', 'error'); return; }
        const acceptTerms = document.getElementById('acceptTerms');
        if (acceptTerms && !acceptTerms.checked) { this.showMessage('پذیرش شرایط اجباری است', 'error'); return; }
        
        try {
            // Use the global SimpleAuth instance
            if (window.simpleAuth) {
                const success = await window.simpleAuth.register(name, email, phone, password, extra);
                if (success) {
                    this.showMessage('ثبت‌نام با موفقیت انجام شد! حالا وارد شوید', 'success');
                    this.switchToLogin();
                    // Clear register form
                    e.target.reset();
                } else {
                    this.showMessage('خطا در ثبت‌نام', 'error');
                }
            } else {
                this.showMessage('خطا در سیستم احراز هویت', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showMessage('خطا در ثبت‌نام', 'error');
        }
    }

    async handleGoogleSignIn() {
        try {
            // Use the global SimpleAuth instance
            if (window.simpleAuth) {
                const success = await window.simpleAuth.googleSignIn();
                if (success) {
                    this.redirectAfterLogin();
                } else {
                    this.showMessage('خطا در ورود با Google', 'error');
                }
            } else {
                this.showMessage('خطا در سیستم احراز هویت', 'error');
            }
        } catch (error) {
            console.error('Google Sign-In error:', error);
            this.showMessage('خطا در ورود با Google', 'error');
        }
    }

    // ===== Register enhancements (OTP, address autocomplete) =====
    setupRegisterEnhancements() {
        const emailBtn = document.getElementById('sendEmailOtp');
        const smsBtn   = document.getElementById('sendSmsOtp');
        const emailInp = document.getElementById('emailOtpInput');
        const smsInp   = document.getElementById('smsOtpInput');

        const postal   = document.getElementById('postalCode');
        const sugg     = document.getElementById('postalSuggestions');
        const city     = document.getElementById('city');
        const prov     = document.getElementById('province');
        const country  = document.getElementById('country');

        if (emailBtn) emailBtn.addEventListener('click', () => this.sendEmailCode(emailBtn));
        if (smsBtn)   smsBtn.addEventListener('click', () => this.sendSmsCode(smsBtn));

        if (emailInp) emailInp.addEventListener('input', () => this.checkEmailOtp());
        if (smsInp)   smsInp.addEventListener('input', () => this.checkSmsOtp());

        if (postal) {
            const debounced = this.debounce(async () => {
                const q = postal.value.trim();
                if (!sugg) return;
                if (q.length < 3) { sugg.classList.remove('show'); return; }
                const results = await this.getLocationSuggestions(q, country ? country.value : 'IR');
                this.renderSuggestions(sugg, results, (item) => {
                    postal.value = item.postal || q;
                    if (city) city.value = item.city || '';
                    if (prov) prov.value = item.province || '';
                    sugg.classList.remove('show');
                });
            }, 300);
            postal.addEventListener('input', debounced);
            document.addEventListener('click', (e)=>{ if(sugg && !sugg.contains(e.target) && e.target!==postal) sugg.classList.remove('show'); });
        }
    }

    sendEmailCode(btn) {
        const email = (document.getElementById('registerEmail')||{}).value?.trim();
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!email || !emailRegex.test(email)) { this.showMessage('ایمیل معتبر نیست', 'error'); return; }
        this.emailOtp = String(Math.floor(100000 + Math.random() * 900000));
        this.emailVerified = false;
        this.updateBadge('emailVerifyStatus', 'در انتظار کد', 'error');
        this.showMessage('کد تایید ایمیل ارسال شد (شبیه‌سازی)', 'success');
        this.startCountdown(btn, 60);
        console.log('Email OTP (sim):', this.emailOtp);
    }

    sendSmsCode(btn) {
        const phone = (document.getElementById('registerPhone')||{}).value?.trim();
        if (!phone || phone.length < 9) { this.showMessage('شماره معتبر نیست', 'error'); return; }
        this.smsOtp = String(Math.floor(100000 + Math.random() * 900000));
        this.phoneVerified = false;
        this.updateBadge('smsVerifyStatus', 'در انتظار کد', 'error');
        this.showMessage('کد تایید پیامک ارسال شد (شبیه‌سازی)', 'success');
        this.startCountdown(btn, 60);
        console.log('SMS OTP (sim):', this.smsOtp);
    }

    checkEmailOtp() {
        const val = (document.getElementById('emailOtpInput')||{}).value?.trim();
        if (val && val.length === 6 && val === this.emailOtp) {
            this.emailVerified = true;
            this.updateBadge('emailVerifyStatus', 'تایید شد', 'success');
        }
    }

    checkSmsOtp() {
        const val = (document.getElementById('smsOtpInput')||{}).value?.trim();
        if (val && val.length === 6 && val === this.smsOtp) {
            this.phoneVerified = true;
            this.updateBadge('smsVerifyStatus', 'تایید شد', 'success');
        }
    }

    updateBadge(id, text, type) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
        el.classList.remove('success','error');
        if (type) el.classList.add(type);
    }

    startCountdown(btn, sec) {
        if (!btn) return;
        btn.disabled = true;
        const original = btn.textContent;
        let s = sec;
        const t = setInterval(() => {
            btn.textContent = `ارسال دوباره (${s--})`;
            if (s < 0) {
                clearInterval(t);
                btn.textContent = original;
                btn.disabled = false;
            }
        }, 1000);
    }

    debounce(fn, delay) {
        let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), delay); };
    }

    async getLocationSuggestions(query, country='IR') {
        const q = query.toLowerCase();
        const local = [
            {postal:'CM1', city:'Chelmsford', province:'Essex', country:'GB', tokens:['cm','chel','cm1','essex']},
            {postal:'CM2', city:'Chelmsford', province:'Essex', country:'GB', tokens:['cm','chel','cm2','essex']},
            {postal:'10139', city:'Tehran', province:'Tehran', country:'IR', tokens:['teh','tehran','تهران','101','10139']},
            {postal:'71949', city:'Shiraz', province:'Fars', country:'IR', tokens:['shi','shiraz','شیراز','719']},
        ];
        let results = local.filter(x => x.country===country && x.tokens.some(t=>t.startsWith(q))).slice(0,10);
        if (results.length===0 && country==='GB' && q.length>=3) {
            try {
                const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete?limit=8`);
                const data = await res.json();
                if (data && data.result) {
                    results = data.result.map(pc => ({ postal: pc, city:'', province:'', country:'GB' }));
                }
            } catch(e) { /* offline safe */ }
        }
        return results;
    }

    renderSuggestions(ul, items, onPick) {
        if (!ul) return;
        ul.innerHTML = '';
        if (!items || items.length===0) { ul.classList.remove('show'); return; }
        items.forEach(it => {
            const li = document.createElement('li');
            const left = document.createElement('span');
            const right = document.createElement('span');
            left.textContent = it.postal || '';
            right.textContent = [it.city, it.province].filter(Boolean).join(' • ');
            li.appendChild(left); li.appendChild(right);
            li.addEventListener('click', ()=>onPick(it));
            ul.appendChild(li);
        });
        ul.classList.add('show');
    }

    checkAuthState() {
        // If user is already logged in, redirect them
        if (window.simpleAuth && window.simpleAuth.isLoggedIn()) {
            this.redirectAfterLogin();
        }
    }

    getIntendedDestination() {
        // Get destination from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const destination = urlParams.get('destination') || 
                          localStorage.getItem('intendedDestination') || 
                          'index';
        
        console.log('🎯 Intended destination:', destination);
        return destination;
    }

    redirectAfterLogin() {
        console.log('✅ Login successful, redirecting to:', this.intendedDestination);
        
        // Clear intended destination
        localStorage.removeItem('intendedDestination');
        
        // Redirect based on destination
        switch (this.intendedDestination) {
            case 'users':
                window.location.href = 'users.html';
                break;
            case 'contractors':
                window.location.href = 'contractors.html';
                break;
            case 'providers':
                window.location.href = 'providers.html';
                break;
            default:
                // Go back to main page
                window.location.href = '../index.html';
        }
    }

    updateUI() {
        // Show intended destination if available
        if (this.intendedDestination && this.intendedDestination !== 'index') {
            const subtitle = document.querySelector('.login-subtitle');
            if (subtitle) {
                const destinationNames = {
                    'users': 'کاربران',
                    'contractors': 'پیمانکاران',
                    'providers': 'ارایه دهندگان'
                };
                const destinationName = destinationNames[this.intendedDestination] || 'خدمات';
                subtitle.textContent = `برای دسترسی به بخش ${destinationName}، ابتدا وارد شوید`;
            }
        }
    }

    showMessage(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `message message-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.loginPageManager = new LoginPageManager();
});

console.log('🔐 Login page script loaded!');
