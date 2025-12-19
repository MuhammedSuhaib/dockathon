# Auth Redesign Specification

## Overview
This specification outlines the redesign of the authentication flow to include personalization questions and improved UI/UX.

## Goals
- Add personalization questions (QNA) to the signup page
- Redirect users to specific documentation page after signup
- Replace navbar signup/signin buttons with user profile when authenticated
- Re-theme auth pages to match the site's design

## Components

### 1. Signup Page (signup.tsx)
- Include personalization questions after form fields
- Redirect to: http://localhost:3000/SpecKit-Plus/docs/module-01-robotic-nervous-system/intro after successful signup
- Match styling from index.tsx

### 2. Signin Page (signin.tsx)
- Match styling from index.tsx
- Redirect to same documentation page after successful signin

### 3. AuthComponent (AuthComponent.jsx)
- Show signup/signin buttons when not authenticated
- Show user profile circle with name when authenticated
- Include signout button in user profile dropdown/menu
- Hide signup/signin buttons when user is logged in

### 4. Personalization Questions
- Software Background: Beginner/Intermediate/Advanced
- Hardware Access: RTX-enabled PC/Jetson/Robot hardware/Simulation only
- Learning Goal: Learn fundamentals/Build simulated humanoids/Deploy AI on real robots/Research

## Flow
1. User clicks signup/signin in navbar
2. User completes authentication flow
3. User is redirected to documentation page
4. Navbar shows user profile instead of auth buttons
5. User can signout from profile menu

## Technical Details
- Use existing authClient for authentication
- Use existing session management
- Redirect URL: http://localhost:3000/SpecKit-Plus/docs/module-01-robotic-nervous-system/intro