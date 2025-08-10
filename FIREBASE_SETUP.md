# 🔥 راهنمای تنظیم Firebase - سیستم مدیریت ساختمان

## 📋 مراحل تنظیم Firebase

### 1️⃣ ایجاد پروژه Firebase
1. به [Firebase Console](https://console.firebase.google.com) بروید
2. روی "Create a project" کلیک کنید
3. نام پروژه را وارد کنید (مثل: `construction-management`)
4. Google Analytics را فعال کنید (اختیاری)
5. روی "Create project" کلیک کنید

### 2️⃣ فعال‌سازی Authentication
1. در منوی سمت چپ، روی "Authentication" کلیک کنید
2. روی "Get started" کلیک کنید
3. در تب "Sign-in method"، موارد زیر را فعال کنید:
   - ✅ **Email/Password** - برای ورود با ایمیل
   - ✅ **Google** - برای ورود با Google
   - ✅ **Phone** - برای ورود با شماره تلفن

### 3️⃣ تنظیم Google Sign-In
1. روی "Google" کلیک کنید
2. "Enable" را انتخاب کنید
3. نام پروژه و ایمیل پشتیبانی را وارد کنید
4. روی "Save" کلیک کنید

### 4️⃣ دریافت کدهای پیکربندی
1. در منوی سمت چپ، روی "Project settings" کلیک کنید
2. در تب "General"، به بخش "Your apps" بروید
3. روی آیکون وب (</>) کلیک کنید
4. نام اپلیکیشن را وارد کنید (مثل: `construction-web`)
5. "Register app" را کلیک کنید
6. کدهای پیکربندی را کپی کنید

### 5️⃣ به‌روزرسانی فایل پیکربندی
فایل `js/firebase-config.js` را باز کنید و مقادیر زیر را جایگزین کنید:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // کد API واقعی شما
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## 🌍 Firebase Setup Guide (English)

### 1️⃣ Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name (e.g., `construction-management`)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2️⃣ Enable Authentication
1. In the left menu, click "Authentication"
2. Click "Get started"
3. In "Sign-in method" tab, enable:
   - ✅ **Email/Password** - for email login
   - ✅ **Google** - for Google sign-in
   - ✅ **Phone** - for phone number login

### 3️⃣ Configure Google Sign-In
1. Click on "Google"
2. Select "Enable"
3. Enter project name and support email
4. Click "Save"

### 4️⃣ Get Configuration Code
1. In the left menu, click "Project settings"
2. In "General" tab, go to "Your apps" section
3. Click the web icon (</>)
4. Enter app name (e.g., `construction-web`)
5. Click "Register app"
6. Copy the configuration codes

### 5️⃣ Update Configuration File
Open `js/firebase-config.js` and replace the values:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // Your actual API key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## ✅ تست کردن تنظیمات

بعد از به‌روزرسانی فایل:
1. صفحه را refresh کنید
2. پیام خطا باید ناپدید شود
3. در کنسول مرورگر پیام "Firebase initialized successfully" را ببینید
4. دکمه‌های ورود و ثبت‌نام کار کنند

## 🚨 مشکلات رایج

### خطای "Firebase: No Firebase App '[DEFAULT]' has been created"
- فایل `firebase-config.js` را بررسی کنید
- مطمئن شوید که کدهای واقعی Firebase را وارد کرده‌اید

### خطای "auth is not defined"
- فایل‌های JavaScript به ترتیب درست load می‌شوند
- Firebase قبل از `auth.js` initialize می‌شود

### خطای CORS
- در Firebase Console، دامنه‌های مجاز را اضافه کنید
- `localhost:8001` را به Authorized domains اضافه کنید

## 📱 تنظیمات امنیتی

1. **API Key Restrictions**: در Google Cloud Console، API key را محدود کنید
2. **Domain Restrictions**: فقط دامنه‌های مجاز را در Firebase تنظیم کنید
3. **Authentication Rules**: قوانین امنیتی مناسب برای Authentication تنظیم کنید

## 🆘 پشتیبانی

اگر مشکلی دارید:
1. کنسول مرورگر را بررسی کنید
2. خطاهای Firebase را در کنسول Firebase بررسی کنید
3. مطمئن شوید که تمام مراحل بالا را انجام داده‌اید
