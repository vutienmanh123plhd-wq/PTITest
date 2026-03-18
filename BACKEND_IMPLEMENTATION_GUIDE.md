# Backend Implementation Guide - PTIT Quiz System

## 📌 Overview

This guide provides step-by-step instructions for implementing and integrating the Node.js/Express backend with the existing frontend for the PTIT Online Quiz System.

## ✅ What's Already Implemented

### 1. **Project Structure**
- ✅ Complete folder hierarchy created
- ✅ Configuration files set up
- ✅ Middleware layer implemented
- ✅ Controllers for all business logic
- ✅ Routes for all API endpoints
- ✅ Database connection pooling configured

### 2. **API Architecture**
- ✅ RESTful API design with 31+ endpoints
- ✅ JWT authentication and authorization
- ✅ Request validation with Joi
- ✅ Global error handling
- ✅ CORS support

### 3. **Database**
- ✅ MySQL schema designed with 7 tables
- ✅ Relationships properly configured
- ✅ Auto-initialization script created
- ✅ Sample data seeding ready

### 4. **Features Implemented**

#### Student Features:
- ✅ User registration and login
- ✅ View available exams
- ✅ Get exam with all questions and options
- ✅ Submit exam with automatic scoring
- ✅ View exam results history
- ✅ View detailed results with answers

#### Admin Features:
- ✅ Admin authentication
- ✅ User management (CRUD operations)
- ✅ Exam management (CRUD operations)
- ✅ Excel file import for exam questions
- ✅ Dashboard statistics
- ✅ Comprehensive statistics with filtering
- ✅ PDF/Excel report export
- ✅ Student results tracking
- ✅ Individual student result export

## 🚀 Setup Instructions

### Phase 1: Environment Setup (Week 1)

#### Step 1: Install Node.js and Dependencies
```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install
```

#### Step 2: Setup MySQL Database
```bash
# Create database
mysql -u root -p
> CREATE DATABASE IF NOT EXISTS pti_quiz_system;
> EXIT;

# Or use your MySQL GUI tool to create the database
```

#### Step 3: Configure Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
# Important: Change DB_PASSWORD to your MySQL password
```

#### Step 4: Initialize Database
```bash
# Create tables and default admin account
npm run migrate

# You should see:
# - Database tables created successfully
# - Default admin account created (admin/admin123)
# - Sample exam created
```

#### Step 5: Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Server should start on http://localhost:5000
```

#### Step 6: Test Health Check
```bash
# In another terminal
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Phase 2: Integration with Frontend (Week 1-2)

#### Step 1: Add Backend URL Configuration
Update frontend JavaScript files to use backend API:

**frontend/js/main.js**
```javascript
// Add at the top
const API_BASE_URL = 'http://localhost:5000/api';

// For CORS in development
const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  }
};

// Add authorization header after login
function setAuthToken(token) {
  if (token) {
    API_CONFIG.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete API_CONFIG.headers['Authorization'];
  }
}
```

#### Step 2: Update Login Form
**user/login.html** - Connect to backend:
```javascript
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthToken(data.token);
      window.location.href = '/user/main.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
  }
});
```

#### Step 3: Update Registration Form
**user/register.html** - Connect to backend:
```javascript
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    confirm_password: document.getElementById('confirmPassword').value,
    full_name: document.getElementById('fullName').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Registration successful! Please login.');
      window.location.href = '/user/login.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed');
  }
});
```

#### Step 4: Update Exam List
**user/main.html** - Fetch exams from backend:
```javascript
async function loadExams() {
  try {
    const response = await fetch(`${API_BASE_URL}/exams`, {
      headers: API_CONFIG.headers
    });

    const data = await response.json();

    if (data.success) {
      const examList = document.getElementById('examList');
      examList.innerHTML = data.data.map(exam => `
        <div class="exam-card">
          <h3>${exam.name}</h3>
          <p>${exam.description}</p>
          <p>Duration: ${exam.duration} minutes | Questions: ${exam.total_questions}</p>
          <button onclick="startExam(${exam.id})">Start Exam</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading exams:', error);
  }
}

loadExams();
```

#### Step 5: Update Exam Taking
**user/exam.html** - Submit answers to backend:
```javascript
async function submitExam() {
  const answers = [];
  
  // Collect all answers
  document.querySelectorAll('.question').forEach(questionEl => {
    const questionId = questionEl.dataset.questionId;
    const selectedOption = questionEl.querySelector('input[type="radio"]:checked');
    
    answers.push({
      question_id: parseInt(questionId),
      selected_option_id: selectedOption ? parseInt(selectedOption.value) : null
    });
  });

  try {
    const response = await fetch(`${API_BASE_URL}/exams/${currentExamId}/submit`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ answers })
    });

    const data = await response.json();

    if (data.success) {
      // Store result ID and redirect
      localStorage.setItem('lastResultId', data.data.result_id);
      window.location.href = `/user/results.html?resultId=${data.data.result_id}`;
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Failed to submit exam');
  }
}
```

#### Step 6: Update Results Display
**user/results.html** - Show results from backend:
```javascript
async function loadResults() {
  const resultId = new URLSearchParams(window.location.search).get('resultId');

  try {
    const response = await fetch(`${API_BASE_URL}/results/${resultId}`, {
      headers: {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const result = data.data;
      
      document.getElementById('examName').textContent = result.exam_name;
      document.getElementById('score').textContent = `${result.score}/100`;
      document.getElementById('correct').textContent = 
        `${result.correct_answers}/${result.total_questions}`;

      // Display answer details
      const answersList = document.getElementById('answersList');
      answersList.innerHTML = result.answers.map((answer, index) => `
        <div class="answer-detail ${answer.is_correct ? 'correct' : 'incorrect'}">
          <h4>Question ${index + 1}: ${answer.question_text}</h4>
          <p>Your answer: ${answer.selected_option_text || 'Not answered'}</p>
          <p>Correct answer: ${answer.correct_option_text}</p>
          <p>${answer.is_correct ? '✓ Correct' : '✗ Wrong'}</p>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading results:', error);
  }
}

loadResults();
```

### Phase 3: Admin Interface Integration (Week 2-3)

#### Step 1: Update Admin Login
**admin/login.html**:
```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      window.location.href = '/admin/dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Login failed');
  }
});
```

#### Step 2: Admin Dashboard Statistics
**admin/dashboard.html**:
```javascript
async function loadDashboard() {
  const adminToken = localStorage.getItem('adminToken');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/statistics/dashboard`, {
      headers: {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const stats = data.data;
      document.getElementById('totalUsers').textContent = stats.total_users;
      document.getElementById('totalExams').textContent = stats.total_exams;
      document.getElementById('totalSubmissions').textContent = stats.total_submissions;
      document.getElementById('avgScore').textContent = stats.average_score.toFixed(2);

      // Display recent submissions
      const recentList = document.getElementById('recentSubmissions');
      recentList.innerHTML = stats.recent_submissions.map(sub => `
        <tr>
          <td>${sub.username}</td>
          <td>${sub.exam_name}</td>
          <td>${sub.score.toFixed(2)}</td>
          <td>${new Date(sub.submitted_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

loadDashboard();
```

## 🔄 Implementation Approaches

### Approach 1: Manual Implementation

**Advantages:**
- Full control and understanding of code
- Perfect for learning
- Can optimize for specific needs

**Steps:**
1. Study the API_DESIGN.md documentation
2. Manually write JavaScript functions for each API call
3. Add fetch calls to each frontend form/button
4. Test each endpoint with Postman first
5. Handle errors and edge cases

**Time Estimate:** 3-4 weeks

### Approach 2: AI-Assisted Implementation

**Advantages:**
- Faster development
- Less repetitive code
- Can generate boilerplate quickly

**Steps:**
1. Use Claude/ChatGPT to generate integration code
2. Provide API_DESIGN.md as context
3. Ask for specific features (e.g., "Generate code to integrate exam submission")
4. Review and test generated code
5. Refine based on actual API responses

**Prompt Example:**
```
I have a Node.js/Express backend API with these endpoints:
- POST /api/auth/login
- GET /api/exams
- POST /api/exams/:id/submit
- GET /api/results

Generate JavaScript code to integrate these into my HTML frontend with proper error handling.
API base URL: http://localhost:5000/api
```

**Time Estimate:** 1-2 weeks

## 📋 Testing Checklist

### Phase 1: Backend Testing
- [ ] Server starts without errors
- [ ] Database tables created successfully
- [ ] Admin account created
- [ ] Health check endpoint responds
- [ ] All 31+ endpoints accessible
- [ ] JWT token generation works
- [ ] Error handling returns proper responses

### Phase 2: Integration Testing
- [ ] Student can register
- [ ] Student can login
- [ ] Student can view exams
- [ ] Student can start exam
- [ ] Student can submit exam
- [ ] Results are calculated correctly
- [ ] Student can view results

### Phase 3: Admin Testing
- [ ] Admin can login
- [ ] Admin can view users
- [ ] Admin can create exam
- [ ] Admin can upload exam from Excel
- [ ] Admin can view statistics
- [ ] Admin can export reports
- [ ] Admin can view student results

## 🔒 Security Considerations

### Before Production:

1. **Change Default Credentials**
   ```bash
   # In admin login or database directly
   UPDATE users SET password = HASH('new_secure_password') WHERE username = 'admin'
   ```

2. **Update JWT Secret**
   ```env
   JWT_SECRET=generate_a_long_secure_random_string_here
   ```

3. **Enable HTTPS**
   - Use nginx or Apache with SSL certificates
   - Update CORS_ORIGIN to use https://

4. **Add Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

5. **Input Validation**
   - Already implemented with Joi
   - Ensure all user inputs are validated

6. **Database Backups**
   - Setup automated MySQL backups
   - Store backups securely

## 📊 Database Maintenance

### Regular Tasks:

```bash
# Backup database
mysqldump -u root -p pti_quiz_system > backup.sql

# Restore from backup
mysql -u root -p pti_quiz_system < backup.sql

# Optimize tables
mysqlcheck -u root -p --optimize pti_quiz_system
```

## 🐛 Troubleshooting

### Common Issues:

**Issue: Cannot connect to database**
- Check MySQL is running
- Verify credentials in .env
- Ensure database name matches

**Issue: CORS error in browser**
- Update CORS_ORIGIN in .env
- Check frontend URL matches CORS_ORIGIN
- For development, use `http://localhost:3000`

**Issue: Token expires too quickly**
- Increase JWT_EXPIRATION in .env
- Default is 24h for students, 7d for admin

**Issue: File upload fails**
- Check MAX_FILE_SIZE in .env
- Ensure UPLOAD_DIR folder exists and is writable
- Multer size limit is 5MB by default

## 📝 Next Steps

1. **Week 1:**
   - Setup environment ✓
   - Test backend with Postman ✓
   - Begin frontend integration

2. **Week 2:**
   - Complete student features integration
   - Test user workflows
   - Demo to team

3. **Week 3:**
   - Complete admin features
   - Performance optimization
   - Security hardening

4. **Week 4:**
   - Final testing
   - Documentation
   - Deployment preparation

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Guide](https://jwt.io/introduction)
- [Postman Documentation](https://learning.postman.com/)

## 🤝 Team Collaboration

### GitHub Workflow:
```bash
# Clone the repository
git clone <your-repo-url>

# Create a feature branch
git checkout -b feature/backend-integration

# Make changes and commits
git add .
git commit -m "Feature: Integrate login API"

# Push to GitHub
git push origin feature/backend-integration

# Create Pull Request for review
```

### Code Style:
- Use consistent indentation (2 spaces)
- Follow camelCase for variables
- Add comments for complex logic
- Write meaningful commit messages

## ✅ Completion Criteria

Project completion requires:
- [x] Backend server fully functional
- [x] All API endpoints implemented
- [x] Database schema created
- [x] Frontend-backend integration complete
- [ ] All features tested and working
- [ ] Documentation complete
- [ ] Code deployed to production
- [ ] Team demo completed

---

**Questions?** Refer to API_DESIGN.md or README.md in the backend folder.
