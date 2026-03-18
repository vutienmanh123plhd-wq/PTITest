# API Design - Online Exam System

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Exams Table
```sql
CREATE TABLE exams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('practice', 'midterm', 'final') NOT NULL,
  status ENUM('available', 'scheduled', 'closed') DEFAULT 'available',
  duration INT NOT NULL, -- in minutes
  start_time DATETIME,
  end_time DATETIME,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id INT NOT NULL,
  question TEXT NOT NULL,
  question_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);
```

### Options Table
```sql
CREATE TABLE options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  option_order INT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
```

### Results Table
```sql
CREATE TABLE results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  exam_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);
```

### Answers Table
```sql
CREATE TABLE answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  result_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT,
  correct_option_id INT,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (selected_option_id) REFERENCES options(id),
  FOREIGN KEY (correct_option_id) REFERENCES options(id)
);
```

---

## API Endpoints

### 1. Authentication APIs

#### POST /api/auth/register
- **Description**: Register new user account
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "confirm_password": "string",
    "full_name": "string"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "student"
    }
  }
  ```

#### POST /api/auth/login
- **Description**: User login
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "number",
      "username": "string",
      "role": "student"
    }
  }
  ```

#### POST /api/auth/logout
- **Description**: User logout
- **Headers**: Authorization: Bearer {token}
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### 2. Student - Exam APIs

#### GET /api/exams
- **Description**: Get all available exams
- **Query Params**: 
  - `search` (optional): Search by exam name
  - `type` (optional): Filter by type (practice, midterm, final)
  - `status` (optional): Filter by status
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "number",
        "name": "string",
        "description": "string",
        "type": "string",
        "status": "string",
        "duration": "number",
        "total_questions": "number",
        "start_time": "datetime or null",
        "end_time": "datetime or null"
      }
    ]
  }
  ```

#### GET /api/exams/:id
- **Description**: Get exam details with questions
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "name": "string",
      "description": "string",
      "type": "string",
      "duration": "number",
      "total_questions": "number",
      "questions": [
        {
          "id": "number",
          "question": "string",
          "question_order": "number",
          "options": [
            {
              "id": "number",
              "option_text": "string",
              "option_order": "number"
            }
          ]
        }
      ]
    }
  }
  ```

#### POST /api/exams/:id/submit
- **Description**: Submit exam answers
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "question_id": "number",
        "selected_option_id": "number"
      }
    ]
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "result_id": "number",
      "score": "decimal",
      "correct_answers": "number",
      "total_questions": "number"
    }
  }
  ```

---

### 3. Student - Results APIs

#### GET /api/results
- **Description**: Get user's exam results
- **Headers**: Authorization: Bearer {token}
- **Query Params**:
  - `exam_id` (optional): Filter by exam
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "number",
        "exam_id": "number",
        "exam_name": "string",
        "score": "decimal",
        "correct_answers": "number",
        "total_questions": "number",
        "submitted_at": "datetime"
      }
    ]
  }
  ```

#### GET /api/results/:resultId
- **Description**: Get detailed result of a specific exam
- **Headers**: Authorization: Bearer {token}
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "exam_id": "number",
      "exam_name": "string",
      "score": "decimal",
      "correct_answers": "number",
      "total_questions": "number",
      "submitted_at": "datetime",
      "answers": [
        {
          "id": "number",
          "question_id": "number",
          "question_text": "string",
          "selected_option_id": "number",
          "selected_option_text": "string",
          "correct_option_id": "number",
          "correct_option_text": "string",
          "is_correct": "boolean"
        }
      ]
    }
  }
  ```

---

### 4. Admin - Authentication APIs

#### POST /api/admin/login
- **Description**: Admin login
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "admin": {
      "id": "number",
      "username": "string",
      "role": "admin"
    }
  }
  ```

---

### 5. Admin - Dashboard APIs

#### GET /api/admin/dashboard
- **Description**: Get dashboard statistics
- **Headers**: Authorization: Bearer {admin_token}
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "total_users": "number",
      "total_exams": "number",
      "total_submissions": "number",
      "average_score": "decimal",
      "recent_submissions": [
        {
          "user_id": "number",
          "username": "string",
          "exam_name": "string",
          "score": "decimal",
          "submitted_at": "datetime"
        }
      ]
    }
  }
  ```

---

### 6. Admin - User Management APIs

#### GET /api/admin/users
- **Description**: Get all users
- **Headers**: Authorization: Bearer {admin_token}
- **Query Params**:
  - `search` (optional): Search by username or email
  - `page` (optional): Pagination
  - `limit` (optional): Items per page
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "number",
        "username": "string",
        "email": "string",
        "full_name": "string",
        "created_at": "datetime"
      }
    ]
  }
  ```

#### POST /api/admin/users
- **Description**: Create new user
- **Headers**: Authorization: Bearer {admin_token}
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "full_name": "string"
  }
  ```
- **Response** (201): User object

#### PUT /api/admin/users/:id
- **Description**: Update user
- **Headers**: Authorization: Bearer {admin_token}
- **Request Body**: User fields to update
- **Response** (200): Updated user object

#### DELETE /api/admin/users/:id
- **Description**: Delete user
- **Headers**: Authorization: Bearer {admin_token}
- **Response** (200): Success message

---

### 7. Admin - Exam Management APIs

#### POST /api/admin/exams
- **Description**: Create new exam
- **Headers**: Authorization: Bearer {admin_token}
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "type": "string",
    "status": "string",
    "duration": "number",
    "start_time": "datetime or null",
    "end_time": "datetime or null",
    "questions": [
      {
        "question": "string",
        "options": [
          {
            "option_text": "string",
            "is_correct": "boolean"
          }
        ]
      }
    ]
  }
  ```
- **Response** (201): Exam object with questions

#### PUT /api/admin/exams/:id
- **Description**: Update exam
- **Headers**: Authorization: Bearer {admin_token}
- **Request Body**: Exam fields to update
- **Response** (200): Updated exam object

#### DELETE /api/admin/exams/:id
- **Description**: Delete exam
- **Headers**: Authorization: Bearer {admin_token}
- **Response** (200): Success message

#### POST /api/admin/exams/:id/import
- **Description**: Import exam questions from Excel file
- **Headers**: Authorization: Bearer {admin_token}
- **Content-Type**: multipart/form-data
- **Request Body**: 
  - `file`: Excel file with format (Question | Option A | Option B | Option C | Option D | Correct Answer)
- **Response** (200): Imported exam with questions

---

### 8. Admin - Statistics APIs

#### GET /api/admin/statistics
- **Description**: Get comprehensive statistics
- **Headers**: Authorization: Bearer {admin_token}
- **Query Params**:
  - `exam_id` (optional): Filter by exam
  - `date_from` (optional): Filter from date
  - `date_to` (optional): Filter to date
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "total_submissions": "number",
      "completion_rate": "decimal",
      "average_score": "decimal",
      "score_distribution": {
        "0-20": "number",
        "21-40": "number",
        "41-60": "number",
        "61-80": "number",
        "81-100": "number"
      },
      "exam_statistics": [
        {
          "exam_id": "number",
          "exam_name": "string",
          "total_participants": "number",
          "average_score": "decimal",
          "completion_rate": "decimal"
        }
      ]
    }
  }
  ```

#### GET /api/admin/statistics/export
- **Description**: Export statistics to PDF or Excel
- **Headers**: Authorization: Bearer {admin_token}
- **Query Params**:
  - `format`: 'pdf' or 'excel'
  - `exam_id` (optional)
- **Response**: File download

---

### 9. Admin - Student Results APIs

#### GET /api/admin/results/students
- **Description**: Get all students' results
- **Headers**: Authorization: Bearer {admin_token}
- **Query Params**:
  - `search`: Search by username or student ID
  - `exam_id` (optional)
  - `page` (optional)
  - `limit` (optional)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "user_id": "number",
        "username": "string",
        "full_name": "string",
        "exam_id": "number",
        "exam_name": "string",
        "score": "decimal",
        "correct_answers": "number",
        "total_questions": "number",
        "submitted_at": "datetime"
      }
    ]
  }
  ```

#### GET /api/admin/results/student/:userId
- **Description**: Get specific student's all results
- **Headers**: Authorization: Bearer {admin_token}
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "user_id": "number",
      "username": "string",
      "full_name": "string",
      "email": "string",
      "results": [
        {
          "exam_id": "number",
          "exam_name": "string",
          "score": "decimal",
          "correct_answers": "number",
          "total_questions": "number",
          "submitted_at": "datetime"
        }
      ]
    }
  }
  ```

#### GET /api/admin/results/:resultId
- **Description**: Get detailed result for admin review
- **Headers**: Authorization: Bearer {admin_token}
- **Response** (200): Same as student detailed result

#### GET /api/admin/results/:resultId/export
- **Description**: Export student result to PDF
- **Headers**: Authorization: Bearer {admin_token}
- **Response**: PDF file download

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "data": null
}
```

## Authentication
- Use JWT tokens for authentication
- Token should be sent in Authorization header: `Bearer {token}`
- Token expiration: 24 hours for students, configurable for admin
