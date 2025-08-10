// Firebase Configuration - Construction Management App
// 🔥 این فایل را با اطلاعات پروژه Firebase خود پر کنید

// Firebase configuration object
const firebaseConfig = {
    // 🔑 این مقادیر را از کنسول Firebase کپی کنید
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check if configuration is properly set
function validateFirebaseConfig() {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => 
        !firebaseConfig[field] || 
        firebaseConfig[field].includes('YOUR_') || 
        firebaseConfig[field] === ''
    );
    
    if (missingFields.length > 0) {
        console.error('❌ Firebase configuration incomplete!');
        console.error('Missing or invalid fields:', missingFields);
        console.error('Please update js/firebase-config.js with your actual Firebase credentials');
        
        // Show user-friendly error message
        showFirebaseError();
        return false;
    }
    
    return true;
}

// Show Firebase configuration error
function showFirebaseError() {
    // Remove existing error if any
    const existingError = document.querySelector('.firebase-error-banner');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'firebase-error-banner';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 10000;
        font-family: Tahoma, Arial, sans-serif;
        max-width: 450px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        border: 2px solid #ff6666;
        direction: rtl;
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-left: 10px;"></i>
            <strong style="font-size: 18px;">خطای تنظیمات Firebase</strong>
        </div>
        <p style="margin: 0 0 15px 0; line-height: 1.5;">
            لطفاً فایل js/firebase-config.js را با اطلاعات واقعی Firebase خود به‌روزرسانی کنید.
        </p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <strong>مراحل تنظیم:</strong><br>
            1️⃣ به <a href="https://console.firebase.google.com" target="_blank" style="color: #ffcc00; text-decoration: none;">Firebase Console</a> بروید<br>
            2️⃣ پروژه جدید ایجاد کنید<br>
            3️⃣ Authentication > Sign-in method را فعال کنید<br>
            4️⃣ کدهای config را کپی کنید
        </div>
        <small style="opacity: 0.8;">
            Please update js/firebase-config.js with your actual Firebase credentials
        </small>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove error after 15 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 15000);
}

// Initialize Firebase only if configuration is valid
if (validateFirebaseConfig()) {
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Get Auth instance and expose globally
        const auth = firebase.auth();
        window.auth = auth; // Make auth globally available
        
        console.log('🔥 Firebase initialized successfully!');
        console.log('📧 Email verification: Enabled');
        console.log('📱 Phone verification: Enabled');
        console.log('🔐 Password reset: Enabled');
        
        // Remove error banner if it exists
        const existingError = document.querySelector('.firebase-error-banner');
        if (existingError) {
            existingError.remove();
        }
        
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        showFirebaseError();
    }
} else {
    console.error('❌ Firebase not initialized due to configuration errors');
}

// 🔧 راهنمای تنظیم Firebase:
// 1. به https://console.firebase.google.com بروید
// 2. پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
// 3. Authentication > Sign-in method را باز کنید
// 4. Email/Password و Phone را فعال کنید
// 5. در Project Settings > General > Your apps > Web app
// 6. کدهای بالا را کپی کنید

// 📱 تنظیمات برای انگلستان:
// - Phone verification: فعال
// - Email verification: فعال  
// - Password reset: فعال
// - User management: فعال

// 🌍 زبان‌های پشتیبانی شده:
// - انگلیسی (پیش‌فرض)
// - فارسی (قابل تنظیم)
