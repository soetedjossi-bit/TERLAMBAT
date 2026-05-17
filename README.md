# 📚 Sistem Presensi Siswa Terlambat

**Aplikasi web elegan untuk mencatat dan mengelola presensi siswa yang terlambat dengan integrasi Google Sheet.**

🌐 **Live Demo**: https://soetedjossi-bit.github.io/TERLAMBAT

---

## ✨ Fitur Utama

### 1. **Dashboard Interaktif**
- ⏰ Digital clock real-time yang selalu update
- 📊 4 kartu statistik: Hadir Tepat Waktu, Terlambat, Tidak Hadir, Total
- 📝 Form input presensi yang user-friendly dengan validasi
- 📌 Daftar presensi terbaru (live update)

### 2. **Tab Riwayat (History)**
- 🔍 Filter lengkap: berdasarkan Kelas, Status, dan Tanggal
- 📊 Tabel data lengkap dengan 10 kolom informasi
- 🗑️ Opsi hapus data individual
- 📥 Export ke Excel (.csv)

### 3. **Tab Laporan (Reports)**
- 📈 **Pie Chart**: Visualisasi Status Presensi Hari Ini
- 📊 **Line Chart**: Tren Terlambat 7 Hari Terakhir
- 📋 **Ringkasan Statistik**:
  - Total Presensi Minggu Ini
  - Total Terlambat Minggu Ini
  - Rata-rata Durasi Terlambat
  - Siswa Paling Sering Terlambat
- 💾 **Export Multiple Format**:
  - 📄 PDF Report
  - 📊 CSV Data
  - 💾 JSON Backup

### 4. **Tab Pengaturan (Settings)**
- 👤 **Sistem Login & Logout**
  - Multi-user support
  - Session management
  - Profile avatar dengan initial nama
- 🔗 **Integrasi Google Sheet**
  - Setup URL Google Apps Script
  - Configuration Sheet ID
  - Sync otomatis data
- 🏫 **Pengaturan Sekolah**
  - Nama sekolah
  - Jam masuk
  - Batas waktu terlambat
- 💾 **Manajemen Data**
  - Import data dari JSON
  - Backup data otomatis
  - Hapus semua data dengan konfirmasi

### 5. **Smart Features**
- ✅ Auto-detect terlambat berdasarkan jam sekolah
- 📱 Responsive design (mobile-friendly)
- 💾 Offline-first dengan localStorage
- ☁️ Cloud sync dengan Google Sheet
- 🎨 Modern UI dengan Glassmorphism design
- 🔐 Secure login system

---

## 🚀 Cara Menggunakan

### **Quick Start**

1. **Buka Aplikasi**
   ```
   https://soetedjossi-bit.github.io/TERLAMBAT
   ```

2. **Login**
   - Email: `admin@presensi.com`
   - Password: `admin123`
   - Atau gunakan kredensial Anda sendiri

3. **Input Presensi**
   - Isi form di Dashboard
   - Klik tombol "Catat Presensi"
   - Data otomatis tersimpan dan muncul di daftar

4. **Lihat Laporan**
   - Klik tab "Laporan"
   - Lihat grafik dan statistik
   - Export ke berbagai format

---

## 🛠️ Setup Google Sheet Integration

### **Langkah 1: Buat Google Sheet**

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "Presensi Siswa"
3. Buat sheet dengan nama "Presensi"
4. Tambahkan header di baris pertama:
   ```
   A: Tanggal
   B: Timestamp
   C: Nama Siswa
   D: Kelas
   E: NISN
   F: Waktu Tiba
   G: Status
   H: Durasi Terlambat
   I: Catatan
   ```

### **Langkah 2: Setup Google Apps Script**

1. Buka Google Sheet yang sudah dibuat
2. Klik **Extensions** → **Apps Script**
3. Hapus kode default dan ganti dengan:

```javascript
const SHEET_ID = 'YOUR_SHEET_ID'; // Copy dari URL sheet
const SHEET_NAME = 'Presensi';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addAttendance') {
      addAttendance(data.data);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data berhasil disimpan'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'getAttendance') {
      const attendance = getAttendance();
      return ContentService.createTextOutput(JSON.stringify(attendance))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addAttendance(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  sheet.appendRow([
    data.date,
    data.timestamp,
    data.studentName,
    data.studentClass,
    data.nisn || '',
    data.arrivalTime,
    data.status,
    data.duration || '',
    data.notes || ''
  ]);
}

function getAttendance() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const result = [];
  for (let i = 1; i < data.length; i++) {
    result.push({
      date: data[i][0],
      timestamp: data[i][1],
      studentName: data[i][2],
      studentClass: data[i][3],
      nisn: data[i][4],
      arrivalTime: data[i][5],
      status: data[i][6],
      duration: data[i][7],
      notes: data[i][8]
    });
  }
  
  return result;
}
```

4. Ganti `YOUR_SHEET_ID` dengan ID dari URL Google Sheet Anda
5. Klik **Deploy** → **New Deployment**
6. Pilih type: **Web app**
7. Execute as: Akun Anda
8. Who has access: **Anyone**
9. Klik **Deploy** dan copy URL deployment

### **Langkah 3: Configure Aplikasi**

1. Buka aplikasi: https://soetedjossi-bit.github.io/TERLAMBAT
2. Login dengan kredensial Anda
3. Klik tab **Pengaturan**
4. Isi:
   - **URL Google Apps Script**: Paste URL dari step 9
   - **Google Sheet ID**: Copy dari URL Google Sheet
5. Klik **Simpan Pengaturan**

✅ **Google Sheet Integration selesai!**

---

## 📁 Struktur File

```
TERLAMBAT/
├── index.html                 # UI utama dengan 4 tabs
├── css/
│   └── style.css             # Styling elegan (Glassmorphism)
├── js/
│   ├── main.js               # Logic utama & tab management
│   ├── auth.js               # Login/Logout system
│   ├── api.js                # Google Sheet integration
│   ├── charts.js             # Charts & Analytics
│   └── export.js             # Export PDF/CSV/Excel
├── README.md                 # Dokumentasi ini
└── SETUP.md                  # Panduan setup Google Sheet
```

---

## 🎨 Design Features

✨ **Modern Glassmorphism Design**
- Background gradient (purple - indigo)
- Semi-transparent cards dengan blur effect
- Smooth animations & transitions
- Responsive design untuk semua ukuran layar
- Dark mode compatible

---

## 🔐 Keamanan

### **Demo Credentials** (untuk development)
```
Email: admin@presensi.com
Password: admin123
```

⚠️ **PENTING**: Ganti credentials ini dengan yang Anda inginkan!

untuk mengubah password, edit file `js/auth.js`:
```javascript
const DEFAULT_CREDENTIALS = {
    email: 'admin@sekolah.com',
    password: 'password_baru_anda',
    name: 'Administrator Sekolah'
};
```

---

## 💾 Data Storage

### **Local Storage** (Default)
- Data disimpan di browser (offline-first)
- Tidak perlu internet untuk input data
- Automatic sync saat online

### **Google Sheet** (Optional)
- Cloud backup otomatis
- Data aman dan terorganisir
- Bisa diakses dari mana saja
- Support collaborative editing

---

## 📊 Data Analytics

### **Dashboard Statistics**
- Hadir Tepat Waktu (hari ini)
- Terlambat (hari ini)
- Tidak Hadir (hari ini)
- Total Presensi (hari ini)

### **Reports & Charts**
- Pie Chart: Status Presensi
- Line Chart: Tren 7 Hari
- Summary Statistics:
  - Total mingguan
  - Rata-rata durasi terlambat
  - Top student terlambat

---

## 📥 Export Formats

### **Supported Export**
- 📄 **PDF Report** - Laporan profesional
- 📊 **CSV/Excel** - Data spreadsheet
- 💾 **JSON Backup** - Backup lengkap
- 📧 **Email** - Coming soon

---

## 🌐 Deployment

Aplikasi sudah di-deploy ke GitHub Pages:
```
https://soetedjossi-bit.github.io/TERLAMBAT
```

### **Deploy ke Hosting Lain**

1. Download/clone repository
2. Upload semua file ke hosting
3. Pastikan `index.html` bisa diakses
4. Setup Google Sheet integration (optional)

---

## ⚙️ Konfigurasi

### **Pengaturan Sekolah**
Bisa dikonfigurasi di tab **Pengaturan**:
- Nama Sekolah
- Jam Masuk (default: 07:00)
- Batas Terlambat dalam menit (default: 10)

### **Pengaturan Google Sheet**
- URL Google Apps Script
- Sheet ID untuk auto-sync

---

## 🐛 Troubleshooting

### **Data tidak tersimpan ke Google Sheet**
✓ Pastikan:
- URL Google Apps Script sudah benar
- Sheet ID sudah benar
- Google Apps Script sudah di-deploy
- Akses "Anyone" sudah aktif

### **Login tidak bisa**
✓ Pastikan:
- Email dan password sudah benar
- Browser tidak memblokir localStorage
- Cookie dan storage tidak dihapus

### **Aplikasi tidak responsive**
✓ Coba:
- Clear browser cache
- Refresh halaman (F5)
- Gunakan browser terbaru

---

## 📱 Browser Support

✅ **Supported:**
- Chrome/Chromium (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

---

## 🤝 Kontribusi

Kami welcome pull requests! Untuk perubahan besar, silakan buka issue terlebih dahulu.

---

## 📄 License

MIT License - Feel free to use ini aplikasi untuk keperluan Anda.

---

## 👨‍💻 Developer

**Dibuat dengan ❤️ oleh**: soetedjossi-bit

**Tech Stack:**
- HTML5
- CSS3 (Glassmorphism)
- Vanilla JavaScript
- Chart.js (Analytics)
- Google Apps Script (Integration)

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buka **Issues** di repository ini.

---

**Happy Tracking! 🎉**
