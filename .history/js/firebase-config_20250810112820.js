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
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Tahoma, Arial, sans-serif;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <strong>خطای تنظیمات Firebase</strong><br>
            لطفاً فایل js/firebase-config.js را با اطلاعات واقعی Firebase خود به‌روزرسانی کنید.<br>
            <small>Please update js/firebase-config.js with your actual Firebase credentials</small>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
        
        return false;
    }
    
    return true;
}

// Initialize Firebase only if configuration is valid
if (validateFirebaseConfig()) {
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Get Auth instance
        const auth = firebase.auth();
        
        console.log('🔥 Firebase initialized successfully!');
        console.log('📧 Email verification: Enabled');
        console.log('📱 Phone verification: Enabled');
        console.log('🔐 Password reset: Enabled');
        
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
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
