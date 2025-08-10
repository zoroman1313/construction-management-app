# Authentication Flow - سیستم احراز هویت

## Overview - خلاصه

This document explains how the authentication system works in the Construction Management application.

این سند توضیح می‌دهد که سیستم احراز هویت در اپلیکیشن مدیریت ساختمان چگونه کار می‌کند.

## User Flow - جریان کاربری

### 1. Initial State - حالت اولیه
- User visits the main page with three character options
- کاربر صفحه اصلی را با سه گزینه شخصیت مشاهده می‌کند
- Login button is visible in the header
- دکمه ورود در بالای صفحه قابل مشاهده است

### 2. Character Selection - انتخاب شخصیت
- User clicks on one of three options:
- کاربر روی یکی از سه گزینه کلیک می‌کند:
  - 👥 **Users** (کاربران) - Job seekers, workers, specialists, contractors
  - 🏗️ **Contractors** (پیمانکاران) - Reports, estimates, project management
  - 🤝 **Providers** (ارایه دهندگان) - Services, materials, equipment

### 3. Authentication Check - بررسی احراز هویت
- If user is **NOT logged in**:
- اگر کاربر **وارد نشده باشد**:
  - Login modal appears with message about which section they're trying to access
  - پنجره ورود با پیام درباره بخش مورد نظر ظاهر می‌شود
  - User must login to proceed
  - کاربر باید وارد شود تا ادامه دهد

- If user is **already logged in**:
- اگر کاربر **قبلاً وارد شده باشد**:
  - User is taken directly to the selected section
  - کاربر مستقیماً به بخش انتخاب شده هدایت می‌شود

### 4. After Login - بعد از ورود
- User's name and photo (if available) are displayed in the header
- نام و عکس کاربر (در صورت وجود) در بالای صفحه نمایش داده می‌شود
- Login button is replaced with user profile
- دکمه ورود با پروفایل کاربر جایگزین می‌شود
- User is automatically redirected to the section they wanted to access
- کاربر به طور خودکار به بخش مورد نظرش هدایت می‌شود

### 5. User Profile Display - نمایش پروفایل کاربر
- **Name**: Displayed prominently
- **نام**: به طور برجسته نمایش داده می‌شود
- **Photo**: User's profile photo or default avatar
- **عکس**: عکس پروفایل کاربر یا آواتار پیش‌فرض
- **Logout Button**: Red button to sign out
- **دکمه خروج**: دکمه قرمز برای خروج از سیستم

## Technical Implementation - پیاده‌سازی فنی

### Key Functions - توابع کلیدی

1. **`navigateToSection(section)`** - Checks auth status before navigation
2. **`showLoginForSection(section)`** - Shows login modal for specific section
3. **`updateUIForLoggedInUser(user)`** - Updates header to show user profile
4. **`navigateToPendingSection()`** - Redirects user after successful login

### Authentication States - حالت‌های احراز هویت

- **Not Authenticated**: Shows login button, redirects to login on section access
- **Authenticated**: Shows user profile, allows direct section access
- **Pending Section**: Remembers which section user wanted to access

### Error Handling - مدیریت خطا

- Firebase configuration errors are displayed prominently
- Login/registration errors show Persian error messages
- Network errors are handled gracefully
- Fallback mechanisms for when Firebase is unavailable

## Mobile Responsiveness - پاسخگویی موبایل

- User profile adapts to small screens
- Login modal is optimized for touch devices
- Responsive design for all screen sizes
- Touch-friendly buttons and inputs

## Security Features - ویژگی‌های امنیتی

- Email verification required for new accounts
- Password strength validation
- Secure Firebase authentication
- Session management
- Automatic logout on page refresh (if needed)

## Future Enhancements - بهبودهای آینده

- Phone number verification
- Two-factor authentication
- Social login providers (Facebook, Twitter)
- Password reset functionality
- User role management
- Session timeout settings

## Troubleshooting - عیب‌یابی

### Common Issues - مشکلات رایج

1. **Firebase not loading**: Check internet connection and Firebase configuration
2. **Login not working**: Verify email/password or try Google sign-in
3. **Profile not showing**: Check browser console for errors
4. **Section not accessible**: Ensure user is properly authenticated

### Debug Information - اطلاعات عیب‌یابی

- Check browser console for detailed logs
- Verify Firebase configuration in `js/firebase-config.js`
- Ensure all required scripts are loaded
- Check network tab for failed requests

---

*Last updated: December 2024*
*آخرین به‌روزرسانی: دسامبر ۲۰۲۴*
