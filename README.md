# 🏗️ Construction Management System

A modern, responsive web app for managing construction projects.

## ✨ Features

- 🎨 **Clean, minimal design** - Simple UI without confusion
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🔧 **Icon-first** - Extensive use of icons instead of long texts
- 🎯 **User-friendly** - Suitable for all skill levels
- 🚀 **Fast and lightweight** - Quick load times and optimized performance

## 🎨 Color Palette

- **Warm orange** (#ff8c42) - Primary color and helmet
- **Bright yellow** (#ffd700) - Warnings and safety
- **Sky blue** (#87ceeb) - Sky color
- **Green** (#32cd32) - Safety and completion

## 📁 Project Structure

```
Accounting/
├── index.html          # Main page
├── css/
│   └── style.css      # Main styles
├── js/
│   ├── script.js      # Common code and navigation
│   ├── auth.js        # SimpleAuth (no external plugins)
│   ├── users.js       # Users page logic
│   ├── contractors.js # Contractors page logic
│   └── login-page.js  # Standalone login page logic
├── pages/             # Inner pages (users/contractors/providers/login)
└── images/            # Images and icons
```

## 🚀 How to run

1. Open `index.html` in your browser
2. Or use a local server:
   ```bash
   cd /Users/shahradmeyghani/Desktop/Ali/countractor/Accounting
   python3 -m http.server 8001
   # or
   npx serve .
   ```

## 🛠️ Technologies

- **HTML5**, **CSS3**, **JavaScript ES6+**
- **Font Awesome** for icons
- No Firebase or other external plugin dependencies

## 🔐 Authentication (SimpleAuth)

- Store user in `localStorage`
- Sign in, Register, Logout
- Simulated Google Sign-In (no external service)
- Auto-redirect to intended destination after login (`intendedDestination`)

The main class `SimpleAuth` is implemented in `js/auth.js` and is available via `window.simpleAuth`.

## 📄 Authentication pages

- `pages/login.html` standalone login/register page with simulated OTP for email and SMS
- Navigation from main page menus to this page with a specific destination (users/contractors/providers)

## 🧭 Navigation

- Clicking main page cards → if not signed in, redirect to `pages/login.html`
- After successful login, redirect to the destination page

## 📞 Support

For questions and suggestions, please contact the development team.

---

Built with ❤️ for the construction industry

## 🔗 Repository

- GitHub: `https://github.com/zoroman1313/jobbaazar`

## ⚙️ CI

This repo includes a lightweight GitHub Actions workflow that:

- Installs dependencies for the Next app in `next/`
- Runs `npm run lint`
- Builds the app with `npm run build`

The workflow runs on pushes to `main` and on pull requests.

## ▶️ Develop the Next app

```
cd next
npm install
npm run dev
```
