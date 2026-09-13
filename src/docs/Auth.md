main.tsx
│
├── ClerkProvider
│
└── BrowserRouter
      │
      └── App.tsx
           │
           ├── /                  → AuthPage
           │
           ├── /sso-callback      → SSOCallbackPage
           │                           ↓
           │                      /auth-resolver
           │
           ├── /auth-resolver     → AuthResolver
           │                           ↓
           │                       Backend API
           │                         ↙       ↘
           │                 /onboarding   /dashboard
           │
           ├── /onboarding
           │
           └── /dashboard