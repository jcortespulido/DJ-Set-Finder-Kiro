# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `set-finder` (or your preferred name)
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

## 2. Enable Firebase Services

### 2.1 Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (e.g., `us-central1`)
5. Click "Enable"

### 2.2 Enable Firebase Authentication

1. Go to "Build" > "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

Optional: Enable Google provider for social login

### 2.3 Enable Firebase Storage

1. Go to "Build" > "Storage"
2. Click "Get started"
3. Select "Start in production mode"
4. Use the same location as Firestore
5. Click "Done"

### 2.4 Enable Firebase Hosting

1. Go to "Build" > "Hosting"
2. Click "Get started"
3. Follow the setup wizard (we'll deploy later)

## 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname: "Set Finder Web"
5. Copy the `firebaseConfig` object
6. Create a `.env` file in the project root (copy from `.env.example`)
7. Fill in the values from the config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. Install Firebase CLI

```bash
npm install -g firebase-tools
```

## 5. Login to Firebase

```bash
firebase login
```

## 6. Initialize Firebase in Project

```bash
firebase init
```

Select:
- Firestore
- Functions
- Hosting
- Storage

Use existing project and select your project.

## 7. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 8. Create First Admin User

After deploying Cloud Functions, you'll need to manually set the first admin user:

1. Create a user through the app's registration
2. Go to Firebase Console > Authentication > Users
3. Copy the user's UID
4. Go to Firestore Database
5. Find the user document in the `users` collection
6. Update the `role` field to `"admin"`
7. Use Firebase CLI to set custom claim:

```bash
firebase functions:shell
```

Then in the shell:
```javascript
admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true })
```

## 9. Deploy Functions (after implementing them)

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 10. Deploy Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Notes

- Keep your `.env` file secure and never commit it to version control
- The `.env.example` file is provided as a template
- Firebase Free Tier (Spark Plan) is sufficient for MVP
- Upgrade to Blaze Plan (pay-as-you-go) when you need Cloud Functions with external API calls
