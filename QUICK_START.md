# PTIT Exam System - Quick Start Guide

## 🚀 How to Access the System

### Method 1: Student Access
1. Open your browser and go to: `f:/CODE/Code/Web/PTITest/user/login.html`
2. Use credentials:
   - **Username**: `student`
   - **Password**: `student123`
3. Click "Đăng Nhập" (Login)
4. You'll be taken to the dashboard

### Method 2: Via Index Page
1. Open `f:/CODE/Code/Web/PTITest/index.html` in browser
2. Choose "Student" role
3. Login with credentials above

### Method 3: Register New Account
1. Go to `f:/CODE/Code/Web/PTITest/user/register.html`
2. Fill in registration form:
   - Username: 3-20 characters (letters, numbers, underscore)
   - Email: Valid email address
   - Password: At least 6 characters
   - Confirm password: Must match
3. Accept terms and conditions
4. Click "Đăng Ký" (Register)
5. Login with your new account

---

## 📱 What You Can Do

### On the Dashboard (Main Page)
- ✓ See list of available exams
- ✓ Search exams by name (search box at top)
- ✓ Filter by status using tabs (All, Opened, Closed)
- ✓ View recent exam results
- ✓ Click "Vào thi" to start an exam
- ✓ Click exam status buttons for more info

### In an Exam
- ✓ Read question and choose an answer (A, B, C, or D)
- ✓ See timer counting down (top right on sidebar)
- ✓ Click question numbers to jump to specific question
- ✓ Click "Previous" / "Next" buttons to navigate
- ✓ See which questions you've answered (green) and missed (red)
- ✓ Click "NỘP BÀI" to submit your answers

### After Submit (Results Page)
- ✓ See your score out of 10
- ✓ View your percentage and grade
- ✓ Read personalized feedback
- ✓ See all questions with your answers
- ✓ Compare your answers with correct answers
- ✓ Review answers in detail
- ✓ Print your results
- ✓ Take the exam again (if score < 50%)
- ✓ Return to dashboard

---

## 🎓 Available Exams to Take

### 1. Exam 1: Web Programming (45 minutes)
- 20 questions on HTML, CSS, JavaScript
- Topics: Web basics, DOM, events, responsive design
- **Start exam**: Click "Vào thi" on first exam card

### 2. Exam 2: Database (60 minutes)
- 30 questions on SQL and databases
- Topics: SELECT, JOIN, transactions, normalization
- **Start exam**: Click "Vào thi" on second exam card

### 3. Exam 3: OOP (90 minutes)
- 25 questions on Object-Oriented Programming
- Topics: Classes, inheritance, polymorphism
- **Start exam**: Click "Vào thi" on third exam card

---

## ⏱️ Timer Information

- Timer starts when you enter exam
- Shows remaining time in format: MM:SS
- **Red warning**: When less than 5 minutes remain (blinks)
- **Auto-submit**: When time reaches 00:00, exam automatically submits
- **Sidebar timer**: Always visible on right side

---

## 📊 Understanding Your Score

### Score Calculation
- Score = (Correct Answers / Total Questions) × 10
- Example: 15/20 correct = (15/20) × 10 = 7.5

### Grade Assignment
| Percentage | Grade | Status |
|-----------|-------|--------|
| 90-100% | A+ | Excellent |
| 80-89% | A | Very Good |
| 70-79% | B | Good |
| 60-69% | C | Pass |
| 50-59% | D | Fair |
| 0-49% | F | Fail |

### Passing Score
- **Minimum to pass**: 50% (5.0 out of 10)
- If you score below 50%, you can retake the exam

---

## 🔧 Troubleshooting

### "Login not working"
- Verify username and password are correct
- Username: `student` (12 characters lowercase)
- Password: `student123` (exact match, case-sensitive)
- Check browser console for errors (F12)

### "Timer not showing"
- Check if JavaScript is enabled
- Try refreshing the page
- Try a different browser

### "Exam won't submit"
- Ensure you're logged in
- Check internet connection
- Try refreshing and restarting

### "Results not showing"
- Check if exam was properly submitted
- Look for result in "Recent Results" table on dashboard
- Results are stored in browser localStorage

### "Can't register"
- Username must be 3-20 characters
- Password must be at least 6 characters
- Email must be valid format
- Password and confirm must match

---

## 💡 Tips for Using the System

### Before Taking an Exam
1. ✓ Make sure you have enough time
2. ✓ Close other applications that might distract you
3. ✓ Ensure stable internet/power
4. ✓ Clear your browser cache if having issues

### During an Exam
1. ✓ Read each question carefully
2. ✓ Use question number buttons to navigate
3. ✓ Watch the timer - don't run out of time!
4. ✓ You can skip questions and come back to them
5. ✓ Click on option to select your answer

### After an Exam
1. ✓ Review your results carefully
2. ✓ Look at wrong answers and learn from them
3. ✓ Read the feedback and recommendations
4. ✓ Take the exam again to improve your score
5. ✓ Print for reference

---

## 🆘 Admin Access

If you need to access admin features:
1. Go to `f:/CODE/Code/Web/PTITest/admin/login.html`
2. Use admin credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You can then access the admin dashboard

---

## 📲 Mobile Usage

The system works on mobile devices:
1. Open the URL on your phone browser
2. All features work the same way
3. Layout automatically adjusts for mobile
4. Touch-friendly buttons and menus

---

## 🗂️ File Locations

If you need to directly access files:
- **Student Login**: `Web/PTITest/user/login.html`
- **Dashboard**: `Web/PTITest/user/main.html`
- **Exams**: `Web/PTITest/user/exam.html`
- **Results**: `Web/PTITest/user/results.html`
- **Registration**: `Web/PTITest/user/register.html`

---

## ❓ Frequently Asked Questions

**Q: Can I use the same account on multiple devices?**
- A: Yes, as long as you use the same login credentials

**Q: What happens if I close the browser during an exam?**
- A: Your session will end. You'll need to login again and retake the exam

**Q: Can I see other students' results?**
- A: No, each account shows only their own results

**Q: Is there a time limit to submit the exam after it ends?**
- A: No, you must submit while time remains or it auto-submits at 00:00

**Q: Can I edit my answers after submitting?**
- A: No, submission is final. You can only retake the exam

**Q: Where are my results stored?**
- A: In your browser's localStorage (local computer only)

**Q: Can I print my certificate?**
- A: You can print the results page with your score

---

## 🎯 Getting Started in 3 Steps

1. **Login**: Open `user/login.html` → Enter demo credentials
2. **Choose Exam**: Click "Vào thi" on any exam card
3. **Take Test**: Answer questions and click "NỘP BÀI"
4. **View Results**: See your score and review answers

---

**Happy Studying! 📚**

For more information, see `IMPLEMENTATION_GUIDE.md`
