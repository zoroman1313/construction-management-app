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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Auth instance
const auth = firebase.auth();

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

console.log('🔥 Firebase initialized successfully!');
console.log('📧 Email verification: Enabled');
console.log('📱 Phone verification: Enabled');
console.log('🔐 Password reset: Enabled');
