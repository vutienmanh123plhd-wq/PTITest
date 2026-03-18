# PTIT Quiz System - Complete Project Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PTIT ONLINE QUIZ SYSTEM                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬──────────────────────────────────┐
│         FRONTEND (HTML/CSS/JS)       │     BACKEND (Node.js/Express)   │
├──────────────────────────────────────┼──────────────────────────────────┤
│                                      │                                  │
│  STUDENT PORTAL                      │  Student APIs                    │
│  ├── Login/Register                  │  ├── POST /auth/register ✓       │
│  ├── Browse Exams                    │  ├── POST /auth/login ✓          │
│  ├── Take Exam                       │  ├── GET /exams ✓               │
│  ├── View Results                    │  ├── GET /exams/:id ✓           │
│  └── Review Answers                  │  ├── POST /exams/:id/submit ✓   │
│                                      │  ├── GET /results ✓             │
│  ADMIN PORTAL                        │  └── GET /results/:id ✓         │
│  ├── Admin Login                     │                                  │
│  ├── User Management                 │  Admin APIs                      │
│  ├── Exam Management                 │  ├── POST /admin/auth/login ✓   │
│  ├── View Statistics                 │  ├── GET /admin/users ✓         │
│  ├── Export Reports                  │  ├── POST /admin/users ✓        │
│  └── Monitor Results                 │  ├── PUT /admin/users/:id ✓     │
│                                      │  ├── DELETE /admin/users/:id ✓  │
│     [static files in root]           │  ├── POST /admin/exams ✓        │
│                                      │  ├── PUT /admin/exams/:id ✓     │
│                                      │  ├── DELETE /admin/exams/:id ✓  │
│                                      │  ├── POST /admin/exams/:id/import ✓
│                                      │  ├── GET /admin/statistics/* ✓  │
│                                      │  ├── GET /admin/results ✓       │
│                                      │  └── GET /admin/results/* ✓     │
│                                      │                                  │
└──────────────────────────────────────┴──────────────────────────────────┘
                                       │
                           ┌───────────▼────────────┐
                           │  Express Server        │
                           │  (Port: 5000)         │
                           │                       │
                           │ Routes → Controllers  │
                           │ Middleware → DB       │
                           └───────────┬────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │      MySQL Database                │
                    │  ├── users (student & admin)       │
                    │  ├── exams                         │
                    │  ├── questions                     │
                    │  ├── options                       │
                    │  ├── results                       │
                    │  └── answers                       │
                    └───────────────────────────────────┘
```

## 📁 Directory Tree

```
PTITest/
├── API_DESIGN.md                          ✓ (API specification)
├── BACKEND_IMPLEMENTATION_GUIDE.md        ✓ (Integration guide)
├── BACKEND_SUMMARY.md                     ✓ (Project summary)
├── SETUP_CHECKLIST.md                     ✓ (Testing checklist)
├── QUICK_START.md                           (Frontend guide)
├── README.md                                (Project overview)
├── index.html                               (Landing page)
├── 
├── admin/                                   (Admin interface)
│   ├── dashboard.html
│   ├── login.html
│   ├── admin.css
│   └── admin.js
│
├── user/                                    (Student interface)
│   ├── login.html
│   ├── register.html
│   ├── main.html
│   ├── exam.html
│   └── results.html
│
├── css/                                     (Stylesheets)
│   ├── style.css
│   └── admin.css
│
├── js/                                      (Frontend scripts)
│   ├── main.js
│   ├── exam.js
│   ├── results.js
│   ├── exam-data.js
│   ├── validation.js
│   └── admin.js
│
├── images/                                  (Assets)
│
└── backend/                                 ✓ NEWLY CREATED
    ├── .env.example                         ✓ (Configuration template)
    ├── .env                                 ✓ (Local config - not in git)
    ├── .gitignore                           ✓ (Git ignore rules)
    ├── server.js                            ✓ (Main Express app)
    ├── package.json                         ✓ (Dependencies)
    ├── README.md                            ✓ (Backend docs)
    ├── POSTMAN_COLLECTION.json              ✓ (API testing)
    │
    ├── config/                              ✓ (Configuration)
    │   └── database.js                      ✓ (MySQL connection)
    │
    ├── middleware/                          ✓ (Express middleware)
    │   ├── auth.js                          ✓ (JWT authentication)
    │   ├── errorHandler.js                  ✓ (Error handling)
    │   └── validation.js                    ✓ (Request validation)
    │
    ├── controllers/                         ✓ (Business logic)
    │   ├── auth.controller.js               ✓ (Student auth)
    │   ├── exam.controller.js               ✓ (Exam logic)
    │   ├── result.controller.js             ✓ (Results logic)
    │   └── admin/                           ✓ (Admin controllers)
    │       ├── auth.controller.js           ✓
    │       ├── user.controller.js           ✓
    │       ├── exam.controller.js           ✓
    │       ├── statistics.controller.js     ✓
    │       └── result.controller.js         ✓
    │
    ├── routes/                              ✓ (API routes)
    │   ├── auth.routes.js                   ✓
    │   ├── exam.routes.js                   ✓
    │   ├── result.routes.js                 ✓
    │   └── admin/                           ✓
    │       ├── auth.routes.js               ✓
    │       ├── user.routes.js               ✓
    │       ├── exam.routes.js               ✓
    │       ├── statistics.routes.js         ✓
    │       └── result.routes.js             ✓
    │
    ├── scripts/                             ✓ (Utility scripts)
    │   └── initializeDatabase.js            ✓ (DB initialization)
    │
    └── uploads/                             ✓ (File uploads directory)
        └── .gitkeep
```

## 🔄 Data Flow Diagram

### Student Taking Exam Flow:
```
┌─────────────────┐
│  Student Login  │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────┐
    │ POST /auth/login        │
    │ Body: username,password │
    └────────┬────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ AuthController.login()       │
    │ - Hash password check        │
    │ - Generate JWT token         │
    └────────┬─────────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │ Return JWT token        │
    │ Store in localStorage   │
    └────────┬────────────────┘
             │
             ▼
    ┌──────────────────┐
    │ View Exam List   │
    │  (Frontend)      │
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────────┐
    │ GET /exams          │
    │ No auth required    │
    └────────┬────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ ExamController.getAllExams │
    │ Return exam list           │
    └────────┬───────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Student Selects Exam│
    │ GET /exams/:id      │
    └────────┬────────────┘
             │
             ▼
    ┌───────────────────────────────────┐
    │ ExamController.getExamById        │
    │ - Get questions                   │
    │ - Get options for each question   │
    │ Return exam with details          │
    └────────┬────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Take Exam (Frontend)     │
    │ Timer runs               │
    │ Select answers           │
    │ Submit answers           │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ POST /exams/:id/submit       │
    │ Body: answers array          │
    │ Auth: Bearer token           │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ ExamController.submitExam        │
    │ - Validate answers               │
    │ - Calculate score                │
    │ - Save result record             │
    │ - Save individual answers        │
    └────────┬──────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Return Score & Result ID │
    │ Redirect to Results Page │
    └────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │ GET /results/:resultId               │
    │ Auth: Bearer token                   │
    │ Return detailed results with answers │
    └──────────────────────────────────────┘
```

## 📊 Database ER Diagram

```
┌────────────────────┐
│      users         │
├────────────────────┤
│ id (PK)            │ 🔑
│ username (UNIQUE)  │
│ email (UNIQUE)     │
│ password (HASH)    │
│ full_name          │
│ role (student/     │
│       admin)       │
│ created_at         │
└─────────┬──────────┘
          │
          │ (1:N)
          │
  ┌───────▼──────────┐
  │      results     │
  ├──────────────────┤
  │ id (PK)          │
  │ user_id (FK)     │◄─────┐
  │ exam_id (FK)     │◄──┐  │
  │ score            │   │  │
  │ correct_answers  │   │  │
  │ total_questions  │   │  │
  │ submitted_at     │   │  │
  └────────┬─────────┘   │  │
           │             │  │
           │ (1:N)       │  │
           │             │  │
    ┌──────▼──────────┐  │  │
    │     answers     │  │  │
    ├─────────────────┤  │  │
    │ id (PK)         │  │  │
    │ result_id (FK)  │──┘  │
    │ question_id(FK) │──┐  │
    │ selected_opt_id │  │  │
    │ correct_opt_id  │  │  │
    │ is_correct      │  │  │
    └─────────────────┘  │  │
                         │  │
        ┌────────────────┘  │
        │                   │
  ┌─────▼──────────┐  ┌──────▼──────────┐
  │    exams       │  │    questions    │
  ├────────────────┤  ├─────────────────┤
  │ id (PK)        │  │ id (PK)         │
  │ name           │  │ exam_id (FK)    │◄────┐
  │ description    │  │ question        │     │
  │ type           │  │ question_order  │     │
  │ status         │  └──────┬──────────┘     │
  │ duration       │         │ (1:N)          │
  │ total_questions│         │                │
  └────────────────┘   ┌─────▼──────────┐    │
                       │     options    │    │
                       ├────────────────┤    │
                       │ id (PK)        │    │
                       │ question_id(FK)├────┘
                       │ option_text    │
                       │ option_order   │
                       │ is_correct     │
                       └────────────────┘
```

## 🔐 Authentication Flow

```
Frontend Request
      │
      ▼
┌─────────────────────────────────┐
│ 1. User sends credentials       │
│    (username & password)        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ 2. POST /auth/login             │
│    (No auth header needed)      │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 3. AuthController validates      │
│    - Check user exists           │
│    - Hash password comparison    │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 4. Generate JWT Token            │
│    - User ID, username, role     │
│    - Expiration: 24h (student)   │
│    - Signed with JWT_SECRET      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 5. Return token to frontend      │
│    - Store in localStorage       │
│    - Add to Authorization header │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 6. Subsequent requests           │
│    Header:                       │
│    Authorization: Bearer {token} │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 7. authMiddleware verifies token │
│    - Decode token                │
│    - Check expiration            │
│    - Attach user to request      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ 8. Continue to controller        │
│    req.user contains:            │
│    { id, username, role }        │
└──────────────────────────────────┘
```

## 📈 API Response Pattern

```
Success Response (2xx)
{
  "success": true,
  "message": "Operation successful",
  "data": {
    ...resource object or array...
  }
}

Error Response (4xx/5xx)
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "data": null,
  "details": [...]  // Optional
}

Paginated Response
{
  "success": true,
  "data": [...items...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│              (Frontend: HTML/CSS/JS)                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
        ┌────────────────────────────┐
        │   Web Server (Nginx)       │
        │   - Proxy requests         │
        │   - SSL/HTTPS              │
        │   - Static files           │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Node.js Express App       │
        │  (Process Manager: PM2)    │
        │  - Multiple instances      │
        │  - Auto-restart on crash   │
        │  - Load balancing          │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   MySQL Database           │
        │  - Master-Slave replication│
        │  - Automated backups       │
        │  - Connection pooling      │
        └────────────────────────────┘
```

---

**Architecture Created:** March 18, 2026
**Status:** ✅ Complete and documented
**Ready for:** Testing, Integration, Deployment
