# Authentication Flow

## Overview

This document explains how the “simple, no-plugin” authentication system works in the Construction Management app.

## User Flow

### 1. Initial State
- User sees the main page with three options
- Sign-in button is shown in the header

### 2. Section selection
- 👥 Users
- 🏗️ Contractors
- 🤝 Providers

### 3. Authentication check
- If the user is not signed in → redirect to `pages/login.html` with destination param (e.g., `?destination=users`)
- If already signed in → go directly to the destination page

### 4. After sign-in
- User name and avatar are shown in the header
- Sign-in button is replaced with user profile
- Logout button is enabled

## Technical Implementation

- `SimpleAuth` class in `js/auth.js`
- Store current user in `localStorage` key `currentUser`
- Users list in `localStorage` key `users`
- Simple global API: `window.simpleAuth`
  - `login(email, password)`
  - `register(name, email, phone, password, extra)`
  - `googleSignIn()` (simulated if GIS not configured)
  - `isLoggedIn()` and `getCurrentUser()`
  - `logout()`

## Error Handling

- Clear error messages for login/register
- Enforce minimum password length
- Check duplicate email on register
- Lightweight auto-dismissing toasts

## Mobile

- Forms and buttons optimized for touch
- Internal pages follow the same header/profile pattern

## Security Notes

- Demo-only, no backend in this version
- For production, add server-side and password hashing

## Troubleshooting

- Sign-in not working: check email/password or register a new user
- Not redirected after sign-in: clear `localStorage` and try again
- Profile not shown: check browser console for JavaScript errors

---

Last updated: 2025-08
