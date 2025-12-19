# Signup Flow Specification

## Overview
This specification describes the complete signup flow that integrates Docusaurus frontend with Next.js authentication and stores user data in Neon database.

## Components
- Docusaurus frontend with auth buttons in navbar
- Next.js app with Better Auth integration
- FastAPI backend with Neon database
- User background form (personalize.tsx)

## Flow
1. User clicks "Sign Up" button in Docusaurus navbar
2. Modal popup appears with signup form and personalization questions
3. User fills in name, email, password and selects background information
4. Better Auth creates user account in Next.js app
5. User background data is sent to FastAPI backend
6. Data is stored in Neon database in user_profiles table
7. User is redirected to home page

## Technical Details
- Auth client connects to Next.js auth server (port 3000)
- User background endpoint: POST /api/user-background
- Database table: user_profiles with fields for software_background, hardware_access, learning_goal

## Data Flow
- Docusaurus → Next.js Auth → FastAPI → Neon DB
- User data: {user_id, software, hardware, goal} stored in user_profiles table