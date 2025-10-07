# GenFitID - Nutrigenomics Metabolic Risk Screening System

GenFitID adalah sistem skrining risiko metabolik berbasis nutrigenomik yang dirancang khusus untuk masyarakat Indonesia, terutama di daerah 3T (Tertinggal, Terdepan, Terluar).

## 🎯 Fitur Utama

### Frontend (Web Application)
- **Sistem Autentikasi Lengkap**: Sign up, sign in, forgot password, dan user dashboard
- **Skrining Risiko Metabolik**: 15 pertanyaan berbasis validasi klinis internasional
- **Profil Genetik SNP**: Analisis 6 varian genetik kunci
- **Program 3 Hari**: Rekomendasi personal berdasarkan tingkat risiko dan lokasi
- **Dashboard Pengguna**: Riwayat assessment, progress tracking, dan reminder

### Backend (Node.js + PostgreSQL)
- **RESTful API**: Endpoint lengkap untuk autentikasi dan data management
- **Keamanan Tingkat Militer**: JWT tokens, bcrypt hashing, rate limiting
- **Database Terstruktur**: PostgreSQL dengan skema yang optimal
- **Validasi Komprehensif**: Input validation di client dan server

## 🚀 Quick Start

### ⚡ **Mode Cepat** (Recommended untuk demo/testing)

```bash
npm install
npm start
```

✅ **Semua fitur berfungsi sempurna dengan localStorage!**
- Authentication system aktif
- Data tersimpan di browser  
- Assessment dan program 3 hari berjalan normal
- Demo account: `demo@genfitid.com` / `DemoUser1`

### 🌐 **Mode Full Stack** (Dengan backend database)

```bash
# Terminal 1: Start backend
npm run mock-backend

# Terminal 2: Start frontend  
npm start
```

**Atau jalankan bersamaan:**
```bash
npm run dev
```

### 📋 Prerequisites (Hanya untuk production deployment)
- Node.js >= 16.0.0
- PostgreSQL >= 12 (untuk production)
- npm atau yarn

### 3. Setup Database

Buat database PostgreSQL dan jalankan:

```sql
CREATE DATABASE genfitid_db;
```

Server akan otomatis membuat tabel yang diperlukan saat startup.

## 📁 Struktur Proyek

```
genfitid/
├── backend/                    # Node.js API Server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example          # Environment template
├── components/
│   ├── auth/                  # Authentication components
│   │   ├── AuthContext.tsx    # Auth state management
│   │   ├── SignInForm.tsx     # Login form
│   │   ├── SignUpForm.tsx     # Registration form
│   │   ├── ForgotPasswordForm.tsx
│   │   └── UserDashboard.tsx  # User dashboard
│   ├── ui/                    # Reusable UI components
│   ├── GenFitLanding.tsx      # Landing page
│   ├── MetabolicQuestionnaire.tsx
│   ├── RiskResults.tsx
│   └── ThreeDayProgram.tsx
├── App.tsx                    # Main app component
└── styles/globals.css         # Global styles
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/reset-password` - Request password reset

### Assessments
- `POST /api/assessments` - Save assessment result
- `GET /api/assessments` - Get user assessments

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/genfitid_db
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
PORT=3001
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🛡️ Fitur Keamanan

- **Password Hashing**: bcrypt dengan salt rounds 12
- **JWT Authentication**: Access token (1h) + Refresh token (7d)
- **Rate Limiting**: Maksimal 5 login attempts per 15 menit
- **Input Validation**: Comprehensive validation di client dan server
- **CORS Protection**: Configured untuk production
- **Helmet.js**: Security headers
- **SQL Injection Protection**: Parameterized queries

## 📊 Sistem Scoring

### Komponen Skor
- **Genetik (60%)**:  Berdasarkan 6 SNP variants (rs9939609, rs7903146, rs1801282, rs662799, rs5219, rs2943641)
- **Lifestyle (40%)**: Berdasarkan 15 pertanyaan tervalidasi (FINDRISC, WHO-STEPS, dll)

### Kategori Risiko
- **Rendah**: 0-20 poin
- **Sedang**: 21-39 poin  
- **Tinggi**: ≥40 poin

## 🎨 Design System

Menggunakan postmodern aesthetic dengan:
- **Warna Utama**: #DC143C (Crimson), #F75270 (Pink), #F7CAC9 (Light Pink), #FDEBD0 (Cream)
- **Typography**: Mixed weights dan sizes untuk visual hierarchy
- **Layout**: Asymmetrical dengan geometric shapes
- **Gradients**: Eye-catching gradients di seluruh aplikasi

## 📱 Mobile Responsiveness

Aplikasi fully responsive dengan:
- Mobile-first design approach
- Touch-friendly interactions
- Optimized untuk layar kecil
- Progressive Web App capabilities

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Push code ke GitHub
2. Connect repository di Railway/Render
3. Set environment variables
4. Deploy

### Database (Supabase/Neon)
1. Buat project baru
2. Copy connection string
3. Update DATABASE_URL di environment

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
npm test
```

## 📈 Roadmap

- [ ] Email verification system
- [ ] Push notifications untuk reminders
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration dengan wearable devices
- [ ] Multi-language support
- [ ] Telemedicine integration

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@genfitid.com
- WhatsApp: +62-XXX-XXXX-XXXX
- Documentation: https://docs.genfitid.com

## 🏥 Medical Disclaimer

GenFitID adalah alat skrining dan tidak menggantikan konsultasi medis profesional. Selalu konsultasikan dengan tenaga kesehatan untuk diagnosis dan treatment yang tepat.

---

**Dibuat dengan ❤️ oleh Tim GenFitID untuk kesehatan metabolik masyarakat Indonesia**