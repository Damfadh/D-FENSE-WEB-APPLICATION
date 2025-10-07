# 🚀 D-FENSE Quick Start Guide

## 🎯 Cara Cepat Mulai Menggunakan D-FENSE

### 📦 Prerequisites
- Node.js v16 atau lebih baru
- npm atau yarn
- PostgreSQL (optional - untuk full stack mode)

---

## 🏃 3 Langkah Cepat

### 1️⃣ Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2️⃣ Pilih Mode

#### Mode A: 📱 Local Storage (Paling Mudah)
```bash
# Langsung jalankan frontend
npm start

# Aplikasi akan buka di http://localhost:3000
# Login dengan: demo@dfense.id / DemoUser1
```

#### Mode B: 🌐 Full Stack (Dengan Database)
```bash
# 1. Setup database PostgreSQL
createdb dfense_db

# 2. Setup environment variables
cd backend
cp .env.example .env
# Edit .env dengan database credentials Anda

# 3. Jalankan backend
npm start
# Backend running di http://localhost:3001

# 4. Di terminal baru, jalankan frontend
cd ..
npm start
# Frontend running di http://localhost:3000
```

### 3️⃣ Login & Explore

```
✅ Buka http://localhost:3000
✅ Login dengan demo account:
   Email: demo@dfense.id
   Password: DemoUser1

✅ Explore fitur:
   - Dashboard dengan statistics
   - Daily activity tracker
   - Assessment history
   - Start new assessment
   - View 3-day program
```

---

## 🎨 Features Overview

### Dashboard
- **User Profile** - Avatar, stats, account info
- **Statistics** - Total assessments, average score, streak, improvement rate
- **Daily Tracker** - 7-day activity calendar
- **Assessment History** - Detailed list dengan scores
- **Quick Actions** - Start assessment, view progress

### Assessment
- **15 Questions** - Comprehensive metabolic screening
- **SNP Integration** - Genetic profile support (6 SNPs)
- **Risk Scoring** - 60% genetic + 40% lifestyle
- **Instant Results** - Detailed risk analysis

### Program
- **3-Day Program** - Personalized recommendations
- **Todo Lists** - Nutrition, activity, monitoring
- **Progress Tracking** - Checkbox completion
- **Recap Summary** - Achievement review

---

## 🔐 Demo Accounts

### Account 1: Demo User
```
Email: demo@dfense.id
Password: DemoUser1
```
- Pre-configured dengan sample data
- Untuk testing fitur

### Create New Account
```
1. Click "Daftar Akun"
2. Fill form:
   - Nama: Min 2 chars
   - Email: Valid format
   - Password: Min 8 chars, uppercase, lowercase, number
3. Accept terms
4. Click "DAFTAR SEKARANG"
```

---

## 🛠️ Development Mode

### Hot Reload Development
```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Backend (optional)
cd backend
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dfense_db

# JWT Secrets (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Server
PORT=3001
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 🧪 Testing

### Quick Test
```bash
# 1. Login dengan demo account
# 2. Check dashboard loads dengan statistics ✅
# 3. Click "Mulai Assessment Baru" ✅
# 4. Complete questionnaire ✅
# 5. View results ✅
# 6. Start 3-day program ✅
# 7. Check todo items ✅
# 8. View progress tracker ✅
```

### Security Test
```bash
# 1. Try invalid login 6 times (should be rate limited)
# 2. Try XSS in registration (<script>alert('xss')</script>)
# 3. Try weak password (password123)
# 4. Check security headers in Network tab
```

### NPM Audit
```bash
# Check for vulnerabilities
npm audit

# Fix if needed
npm audit fix
```

---

## 📱 User Flow

```
Landing Page
    ↓
[Login / Sign Up]
    ↓
Dashboard (New!) ✨
├─ Statistics
├─ Daily Tracker
├─ Assessment History
└─ Quick Actions
    ↓
[Start Assessment]
    ↓
User Info Form
├─ Demographics
└─ Genetic Profile (6 SNPs)
    ↓
Questionnaire
├─ 15 Questions
└─ Validated Answers
    ↓
Results
├─ Risk Score
├─ Recommendations
└─ [Start Program]
    ↓
3-Day Program
├─ Day 1 Tasks
├─ Day 2 Tasks
└─ Day 3 Tasks
    ↓
[Complete & View Recap]
    ↓
Back to Dashboard
```

---

## ⚙️ Configuration

### Change API Endpoint
```typescript
// /config.ts
const apiBaseUrl = 'http://your-api-url.com/api';
```

### Change Branding Colors
```css
/* /styles/globals.css */
--color-primary: #DC143C;  /* Main red */
--color-secondary: #F75270; /* Pink */
--color-accent: #F7CAC9;   /* Light pink */
--color-background: #FDEBD0; /* Cream */
```

### Adjust Rate Limiting
```javascript
// /backend/server.js
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Adjust this number
});
```

---

## 🐛 Troubleshooting

### Error: "Backend not available"
**Solution:**
- Aplikasi otomatis switch ke local storage mode
- Atau start backend dengan `cd backend && npm start`

### Error: "Cannot connect to database"
**Solution:**
```bash
# Check PostgreSQL running
pg_isready

# Create database
createdb dfense_db

# Check .env configuration
cat backend/.env
```

### Error: "Rate limit exceeded"
**Solution:**
- Wait 15 minutes
- Atau restart backend server

### Error: "Invalid token"
**Solution:**
```javascript
// Clear localStorage
localStorage.clear();
// Login again
```

### Assessment history not showing
**Solution:**
```javascript
// Check localStorage
console.log(localStorage.getItem('dfense_assessments_' + user.email));
```

---

## 📚 Documentation

- **Security:** `/SECURITY.md` - Comprehensive security guide
- **Testing:** `/TESTING_SECURITY.md` - Security testing procedures
- **Changelog:** `/CHANGELOG.md` - Version history
- **Update Summary:** `/UPDATE_SUMMARY.md` - Latest changes
- **Backend Setup:** `/BACKEND_SETUP.md` - Detailed backend guide

---

## 🎓 Learn More

### React
- [React Documentation](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://jwt.io/introduction)

### Node.js
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Quick navigation (planned)
- `Ctrl/Cmd + /` - Help menu (planned)

### Best Practices
1. **Always logout** after testing
2. **Use strong passwords** (8+ chars, mixed case, numbers)
3. **Regular backups** untuk production
4. **Monitor logs** untuk security events
5. **Update dependencies** regularly

### Performance
- Dashboard statistics cached untuk 5 menit
- Assessment history loaded progressively
- Images lazy loaded
- API requests debounced

---

## 🚨 Important Notes

### Security
- ⚠️ Demo mode menggunakan localStorage (NOT for production)
- ⚠️ JWT tokens di localStorage (vulnerable to XSS)
- ✅ Production: Use HttpOnly cookies (see SECURITY.md)
- ✅ Always use HTTPS di production

### Data
- LocalStorage data specific per browser
- Clear cache = data hilang (local mode)
- Backend mode = data persisted di database
- Backup database regularly

### Compatibility
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Tested on Node.js v16+
- PostgreSQL 12+

---

## 🆘 Get Help

### Support Channels
- **Email:** support@dfense.id
- **Documentation:** This repo
- **Issues:** GitHub Issues

### Common Questions

**Q: Lupa password?**
A: Klik "Lupa Password?" di login page (need email setup)

**Q: Data hilang setelah refresh?**
A: Local mode = data di localStorage. Use backend mode untuk persistence.

**Q: Bagaimana cara export data?**
A: Click "Export Data" di Progress Tracker (planned feature)

**Q: Apakah data aman?**
A: Yes, dengan catatan:
- Password di-hash dengan bcrypt
- Input disanitasi
- Rate limiting active
- Security headers enabled
- See SECURITY.md untuk details

---

## ✅ Success Checklist

Aplikasi berjalan dengan baik jika:

- [x] Frontend buka di http://localhost:3000
- [x] Bisa login dengan demo account
- [x] Dashboard menampilkan statistics
- [x] Daily tracker showing activity
- [x] Bisa start assessment baru
- [x] Results page tampil dengan scores
- [x] 3-day program accessible
- [x] Todo items checkable
- [x] Progress tracker showing data
- [x] No console errors

---

**Happy Coding! 🎉**

Jika ada pertanyaan atau menemukan bug, jangan ragu untuk membuat issue atau kontak tim development.

---

**Version:** 2.0  
**Last Updated:** 7 Oktober 2025  
**Status:** Production Ready ✅
