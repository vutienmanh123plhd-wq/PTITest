# Backend Setup & Integration Checklist

## Phase 1: Environment Setup ✅

### Prerequisites
- [ ] Node.js installed (v14 or higher)
- [ ] MySQL installed and running
- [ ] Git configured
- [ ] Code editor (VS Code, IntelliJ, etc.)

### Backend Installation
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with database credentials
- [ ] Create MySQL database: `CREATE DATABASE pti_quiz_system;`
- [ ] Run `npm run migrate`
- [ ] Verify admin account created
- [ ] Run `npm run dev` and test health endpoint

### Verification Tests
- [ ] `http://localhost:5000/api/health` returns {"success":true}
- [ ] Database tables created (use MySQL client to verify)
- [ ] Sample exam with questions exists
- [ ] No console errors on server startup

---

## Phase 2: API Testing with Postman 📮

### Postman Setup
- [ ] Download Postman
- [ ] Import `POSTMAN_COLLECTION.json` from backend folder
- [ ] Create environment with:
  - [ ] `base_url` = http://localhost:5000/api
  - [ ] `student_token` = (will be filled after login)
  - [ ] `admin_token` = (will be filled after login)

### Student Authentication Tests
- [ ] **Register student**
  - Request: POST /auth/register
  - Body: { username, email, password, confirm_password, full_name }
  - Expected: 201 with user object

- [ ] **Login student**
  - Request: POST /auth/login
  - Body: { username, password }
  - Expected: 200 with token
  - Action: Copy token to student_token env var

### Student Exam Tests
- [ ] **Get all exams**
  - Request: GET /exams
  - Expected: 200 with array of exams

- [ ] **Get exam by ID**
  - Request: GET /exams/1
  - Expected: 200 with exam object including questions and options

- [ ] **Submit exam**
  - Request: POST /exams/1/submit
  - Auth: Bearer {{student_token}}
  - Body: { answers: [{question_id, selected_option_id}, ...] }
  - Expected: 200 with score and result_id

### Student Results Tests
- [ ] **Get user results**
  - Request: GET /results
  - Auth: Bearer {{student_token}}
  - Expected: 200 with array of previous results

- [ ] **Get result details**
  - Request: GET /results/{{result_id}}
  - Auth: Bearer {{student_token}}
  - Expected: 200 with detailed answers and scoring

### Admin Authentication Tests
- [ ] **Admin login**
  - Request: POST /admin/auth/login
  - Body: { username: "admin", password: "admin123" }
  - Expected: 200 with token
  - Action: Copy token to admin_token env var

### Admin User Management Tests
- [ ] **List all users**
  - Request: GET /admin/users
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with user array and pagination

- [ ] **Create user**
  - Request: POST /admin/users
  - Auth: Bearer {{admin_token}}
  - Body: { username, email, password, full_name }
  - Expected: 201 with created user

- [ ] **Update user**
  - Request: PUT /admin/users/{{user_id}}
  - Auth: Bearer {{admin_token}}
  - Body: { full_name: "Updated Name" }
  - Expected: 200 with updated user

- [ ] **Delete user**
  - Request: DELETE /admin/users/{{user_id}}
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with success message

### Admin Exam Management Tests
- [ ] **Create exam**
  - Request: POST /admin/exams
  - Auth: Bearer {{admin_token}}
  - Body: { name, description, type, status, duration, total_questions, questions: [...] }
  - Expected: 201 with exam object

- [ ] **Update exam**
  - Request: PUT /admin/exams/1
  - Auth: Bearer {{admin_token}}
  - Body: { name: "Updated Exam Name" }
  - Expected: 200 with updated exam

- [ ] **Delete exam**
  - Request: DELETE /admin/exams/1
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with success message

### Admin Statistics Tests
- [ ] **Dashboard statistics**
  - Request: GET /admin/statistics/dashboard
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with overall statistics

- [ ] **Comprehensive statistics**
  - Request: GET /admin/statistics/comprehensive
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with detailed statistics and score distribution

- [ ] **Export statistics**
  - Request: GET /admin/statistics/export?format=excel
  - Auth: Bearer {{admin_token}}
  - Expected: Excel file download

### Admin Results Tests
- [ ] **View all results**
  - Request: GET /admin/results
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with all submission results

- [ ] **View student results**
  - Request: GET /admin/results/student/{{user_id}}
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with student's all results

- [ ] **View result details**
  - Request: GET /admin/results/detail/{{result_id}}
  - Auth: Bearer {{admin_token}}
  - Expected: 200 with detailed answers

- [ ] **Export result to PDF**
  - Request: GET /admin/results/export/{{result_id}}
  - Auth: Bearer {{admin_token}}
  - Expected: PDF file download

---

## Phase 3: Frontend Integration 🔗

### Frontend Directory Setup
- [ ] Frontend files already in place under `/user/` and `/admin/`
- [ ] CSS files updated with styling
- [ ] HTML forms created

### Student Frontend Integration
- [ ] **Update js/main.js**
  - [ ] Define `const API_BASE_URL = 'http://localhost:5000/api'`
  - [ ] Create `setAuthToken()` function
  - [ ] Create reusable fetch wrapper

- [ ] **Integrate login page (user/login.html)**
  - [ ] Add form submit event listener
  - [ ] Call `/api/auth/login`
  - [ ] Store token in localStorage
  - [ ] Redirect to main page
  - [ ] Test form submission

- [ ] **Integrate register page (user/register.html)**
  - [ ] Add form submit event listener
  - [ ] Validate form data on client
  - [ ] Call `/api/auth/register`
  - [ ] Handle success/error responses
  - [ ] Redirect to login after success
  - [ ] Test form submission

- [ ] **Integrate exam list page (user/main.html)**
  - [ ] Load exams on page load
  - [ ] Display exam list with API data
  - [ ] Add search/filter functionality
  - [ ] Add button to start exam
  - [ ] Handle loading state

- [ ] **Integrate exam page (user/exam.html)**
  - [ ] Load exam questions on page load
  - [ ] Display timer
  - [ ] Collect user answers
  - [ ] Handle submit button
  - [ ] Call `/api/exams/:id/submit`
  - [ ] Redirect to results page

- [ ] **Integrate results page (user/results.html)**
  - [ ] Load result by ID from API
  - [ ] Display score and statistics
  - [ ] Show answer review with correct/incorrect indicators
  - [ ] Add export to PDF button
  - [ ] Test results display

### Admin Frontend Integration
- [ ] **Update admin auth**
  - [ ] Create admin login (admin/login.html)
  - [ ] Call `/api/admin/auth/login`
  - [ ] Store admin token
  - [ ] Redirect to dashboard

- [ ] **Admin dashboard (admin/dashboard.html)**
  - [ ] Load statistics on page load
  - [ ] Display summary stats (users, exams, submissions, avg score)
  - [ ] Show recent submissions list
  - [ ] Add navigation to other admin pages

- [ ] **User management (admin/users.html)**
  - [ ] Load users with pagination
  - [ ] Implement search
  - [ ] Add create user form
  - [ ] Implement edit user modal
  - [ ] Add delete user with confirmation
  - [ ] Test all CRUD operations

- [ ] **Exam management (admin/exams.html)**
  - [ ] Load exams list
  - [ ] Create exam form with question builder
  - [ ] Upload Excel file option
  - [ ] Edit exam
  - [ ] Delete exam
  - [ ] Test all operations

- [ ] **Statistics page (admin/statistics.html)**
  - [ ] Load comprehensive statistics
  - [ ] Display score distribution chart
  - [ ] Show exam-wise statistics
  - [ ] Add export to PDF/Excel
  - [ ] Test exports

- [ ] **Student results view (admin/results.html)**
  - [ ] Search/list all results
  - [ ] View individual student results
  - [ ] Show detailed answer review
  - [ ] Export result to PDF
  - [ ] Test result viewing

---

## Phase 4: Testing & Validation ✅

### Functionality Testing
- [ ] User can register successfully
- [ ] User can login successfully
- [ ] User receives JWT token
- [ ] User can view exams
- [ ] User can start and complete exam
- [ ] User answers are submitted correctly
- [ ] Exam is scored correctly
- [ ] User can view results
- [ ] Admin can login
- [ ] Admin can manage users
- [ ] Admin can manage exams
- [ ] Admin can view statistics
- [ ] Admin can export reports

### Error Handling
- [ ] Invalid credentials show error
- [ ] Duplicate username blocked
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] Missing required fields show validation error
- [ ] Database errors handled gracefully
- [ ] Network errors handled gracefully

### Security Testing
- [ ] Passwords hashed in database
- [ ] JWT tokens expire properly
- [ ] Admin endpoints require admin role
- [ ] Student endpoints require authentication
- [ ] SQL injection prevented (via parameterized queries)
- [ ] XSS attacks prevented

### Performance Testing
- [ ] Login response < 500ms
- [ ] Exam load response < 1s
- [ ] Submit exam response < 2s
- [ ] Results display < 1s
- [ ] No memory leaks detected
- [ ] Database queries optimized

---

## Phase 5: Deployment Preparation 🚀

### Security Hardening
- [ ] Change default admin password
- [ ] Update JWT_SECRET to secure value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Enable request logging
- [ ] Setup error monitoring

### Database Preparation
- [ ] Backup production database
- [ ] Setup automated backups
- [ ] Configure database user permissions
- [ ] Test backup restoration
- [ ] Optimize indexes
- [ ] Setup database monitoring

### Server Preparation
- [ ] Choose hosting provider
- [ ] Configure server firewall
- [ ] Setup SSL certificates
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Setup PM2 or similar for process management
- [ ] Configure auto-restart on crash

### Monitoring & Logging
- [ ] Setup error tracking (Sentry, etc)
- [ ] Configure log aggregation
- [ ] Setup performance monitoring
- [ ] Configure alerts for critical issues
- [ ] Setup uptime monitoring

---

## Phase 6: Production Deployment 🚀

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Users trained
- [ ] Support team ready
- [ ] Rollback plan documented
- [ ] Deploy to staging first
- [ ] Staging tests passed
- [ ] Deploy to production
- [ ] Verify all features working
- [ ] Monitor for issues
- [ ] Document any issues

---

## Notes & Comments

Use this section to track issues, questions, or notes:

```
Date: ___________
Issue: _________________________________
Status: ________________________________
Resolution: _____________________________

Date: ___________
Issue: _________________________________
Status: ________________________________
Resolution: _____________________________
```

---

## Team Sign-Off

- [ ] Backend developer: __________ Date: __________
- [ ] Frontend developer: __________ Date: __________
- [ ] QA tester: __________ Date: __________
- [ ] Project manager: __________ Date: __________

---

**Last Updated:** March 18, 2026
**Status:** Ready for Implementation
**Estimated Timeline:** 4 weeks
