Authorization: Bearer <Clerk JWT>
              ↓
         Verify JWT
              ↓
      Extract Clerk user ID
              ↓
       DB lookup by clerkUserId
          ↙          ↘
       exists       doesn't exist
          ↓             ↓
      get user       create user
          ↘             ↙
              ↓
       return user state