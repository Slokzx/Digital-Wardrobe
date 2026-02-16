# Digital Wardrobe — Data Flow Diagram

## High-level data flow

flowchart TB
    subgraph Client["Browser / Client"]
        Pages["Pages\n(/, /auth, /app, /app/add, /app/profile)"]
        UI["UI Components\n(Button, Card, Sheet, etc.)"]
        Pages --> UI
    end

    subgraph State["Zustand Stores"]
        Auth["useAuthStore\n(user, login/logout)"]
        Wardrobe["useWardrobeStore\n(items, selectedItem, sheet)"]
        Filters["useFilterStore\n(search, types, colors, etc.)"]
        Toast["useToastStore\n(toasts)"]
    end

    subgraph API["Next.js API Routes"]
        AuthAPI["/api/auth/*\n(signup, login, logout)"]
        Me["/api/me"]
        WardrobeAPI["/api/wardrobe\n(GET list, POST create)"]
        WardrobeId["/api/wardrobe/[id]\n(GET, DELETE)"]
        Upload["/api/upload\n(POST file)"]
    end

    subgraph Backend["Backend"]
        AuthLib["lib/auth\n(session, JWT, cookies)"]
        Prisma["Prisma Client"]
        DB[(SQLite\nUser, Session,\nWardrobeItem)]
        FS["public/uploads/"]
    end

    subgraph External["External"]
        Pexels["Pexels API\n(seed images only)"]
    end

    Pages --> Auth
    Pages --> Wardrobe
    Pages --> Filters
    Pages --> Toast
    UI --> State

    State -->|fetch| API
    API --> AuthLib
    API --> Prisma
    AuthLib --> Prisma
    Prisma --> DB
    Upload -->|writes| FS["public/uploads/"]
    Prisma -->|seed script| Pexels
```

## Auth flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as Page (auth)
    participant S as useAuthStore
    participant API as /api/auth/login
    participant Auth as lib/auth
    participant DB as SQLite

    U->>P: Enter email + password
    P->>API: POST /api/auth/login
    API->>DB: Find user, verify password
    API->>Auth: createSession(userId)
    Auth->>DB: Create Session row
    Auth->>P: Set-Cookie (JWT)
    API->>P: { user }
    P->>S: setUser(user)
    P->>U: Redirect to /app
```

## Wardrobe list & filters flow

```mermaid
flowchart LR
    subgraph Client
        A["/app page"]
        B["useFilterStore"]
        C["useWardrobeStore"]
        A --> B
        A --> C
    end
    C -->|"GET /api/wardrobe?search=&types=&colors=..."| D["/api/wardrobe"]
    D --> E["getSession()"]
    E --> F["Prisma: findMany\n+ count"]
    F --> G[(WardrobeItem)]
    G --> D
    D --> C
    C -->|"items, totalCount"| A
```

## Add item (with upload) flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as Add Page
    participant Upload as /api/upload
    participant Wardrobe as /api/wardrobe
    participant Store as useWardrobeStore
    participant DB as SQLite
    participant FS as public/uploads

    U->>P: Select file or paste URL
    alt Upload photo
        P->>Upload: POST FormData (file)
        Upload->>FS: Save file
        Upload->>P: { url: "/uploads/xxx" }
        P->>P: setImageUrl(url), preview
    end
    U->>P: Fill form, Submit
    P->>Wardrobe: POST { name, type, imageUrl, ... }
    Wardrobe->>DB: prisma.wardrobeItem.create
    DB->>Wardrobe: item
    Wardrobe->>P: 201 + item
    P->>Store: addItem(item)
    P->>U: Toast, redirect to /app
```

## Session & protected routes

```mermaid
flowchart TB
    subgraph Request
        Req["Incoming request"]
    end
    Req --> Cookie{"Cookie:\ndw_session?"}
    Cookie -->|No| Unauthorized["401 / null user"]
    Cookie -->|Yes| Verify["jose: jwtVerify(token)"]
    Verify --> DB["Prisma: find Session"]
    DB --> Valid{"Valid & not expired?"}
    Valid -->|No| Unauthorized
    Valid -->|Yes| userId["session.userId"]
    userId --> Handler["Route handler\n(wardrobe, upload, etc.)"]
```

## File structure (data-related)

```mermaid
flowchart LR
    subgraph App
        app["app/"]
        app --> layout["layout.tsx\n(ThemeProvider)"]
        app --> auth["auth/page.tsx"]
        app --> wardrobe["app/page.tsx"]
        app --> add["app/add/page.tsx"]
        app --> profile["app/profile/page.tsx"]
    end
    subgraph API
        api["app/api/"]
        api --> authAPI["auth/signup|login|logout"]
        api --> me["me"]
        api --> wardrobeAPI["wardrobe"]
        api --> upload["upload"]
    end
    subgraph Data
        lib["lib/"]
        lib --> db["db.ts (Prisma)"]
        lib --> authLib["auth.ts"]
        stores["stores/*.ts"]
        prisma["prisma/schema.prisma"]
    end
    wardrobe --> stores
    add --> stores
    auth --> stores
    api --> lib
    prisma --> db
```

---

*View these diagrams in any Mermaid-compatible viewer (e.g. [Mermaid Live](https://mermaid.live), GitHub, or VS Code with a Mermaid extension).*
