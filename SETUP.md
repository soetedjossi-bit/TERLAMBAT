# 📚 Setup Panduan Lengkap - Aplikasi Presensi Siswa

## Table of Contents
1. [Instalasi & Setup](#instalasi--setup)
2. [Google Sheet Integration](#google-sheet-integration)
3. [Customization](#customization)
4. [Deployment](#deployment)
5. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Instalasi & Setup

### **Metode 1: Direct Access (Recommended)**

Tinggal buka link dan langsung bisa digunakan:
```
https://soetedjossi-bit.github.io/TERLAMBAT
```

✅ **Keuntungan:**
- Tidak perlu install
- Always up-to-date
- Mobile friendly
- Bisa diakses dimana saja

---

### **Metode 2: Self Hosting**

#### **Step 1: Download Files**
```bash
# Clone repository
git clone https://github.com/soetedjossi-bit/TERLAMBAT.git
cd TERLAMBAT
```

#### **Step 2: Local Testing**
```bash
# Option A: Python
python -m http.server 8000

# Option B: Node.js
npx http-server

# Option C: Ruby
ruby -run -ehttpd . -p8000
```

Buka browser: `http://localhost:8000`

#### **Step 3: Upload ke Hosting**

**Menggunakan cPanel:**
1. Login ke cPanel
2. File Manager → Upload semua file
3. Pastikan `index.html` di folder public_html
4. Akses via domain Anda

**Menggunakan FTP:**
1. Gunakan FileZilla/Putty
2. Connect ke server FTP
3. Upload semua file
4. Set permissions (755 untuk folder, 644 untuk file)

**Menggunakan GitHub Pages:**
1. Push ke repository
2. Settings → Pages → Select main branch
3. Akses via: `https://username.github.io/repo-name`

---

## Google Sheet Integration

### **Complete Setup Guide**

#### **Step 1: Create Google Sheet**

1. Buka https://sheets.google.com
2. Click "+ Create new spreadsheet"
3. Rename ke "Presensi Siswa"
4. Buat 2 sheet:
   - Sheet 1: "Presensi" (untuk data)
   - Sheet 2: "Settings" (opsional)

#### **Step 2: Setup Sheet Structure**

**Di sheet "Presensi", baris 1 (Header):**

| Column | Header |
|--------|--------|
| A | Tanggal |
| B | Timestamp |
| C | Nama Siswa |
| D | Kelas |
| E | NISN |
| F | Waktu Tiba |
| G | Status |
| H | Durasi Terlambat |
| I | Catatan |

**Contoh data:**
```
Tanggal         | Timestamp              | Nama Siswa  | Kelas | NISN       | Waktu Tiba | Status      | Durasi | Catatan
17/05/2026      | 2026-05-17T08:30:00Z  | Budi Santoso| 12A   | 1234567890 | 08:30      | Terlambat   | 30     | Bangun kesiangan
```

#### **Step 3: Create Google Apps Script**

1. Di Google Sheet, klik **Extensions** → **Apps Script**
2. Hapus kode template
3. Paste kode di bawah:

```javascript
// ===== CONFIGURATION =====
const SHEET_ID = 'YOUR_SHEET_ID'; // GANTI DENGAN SHEET ID ANDA
const SHEET_NAME = 'Presensi';

// ===== DO POST HANDLER =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Add new attendance
    if (data.action === 'addAttendance') {
      addAttendance(data.data);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data berhasil disimpan ke Google Sheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all attendance
    if (data.action === 'getAttendance') {
      const attendance = getAttendance();
      return ContentService.createTextOutput(JSON.stringify(attendance))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get stats
    if (data.action === 'getStats') {
      const stats = getStats();
      return ContentService.createTextOutput(JSON.stringify(stats))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== ADD ATTENDANCE =====
function addAttendance(data) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    sheet.appendRow([
      data.date || '',
      data.timestamp || new Date().toISOString(),
      data.studentName || '',
      data.studentClass || '',
      data.nisn || '',
      data.arrivalTime || '',
      data.status || '',
      data.duration || '',
      data.notes || ''
    ]);
    
    Logger.log('Attendance added: ' + data.studentName);
  } catch (error) {
    Logger.log('Error adding attendance: ' + error.toString());
    throw error;
  }
}

// ===== GET ALL ATTENDANCE =====
function getAttendance() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const result = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][2]) { // Check if studentName exists
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
    }
    
    return result;
  } catch (error) {
    Logger.log('Error getting attendance: ' + error.toString());
    throw error;
  }
}

// ===== GET STATISTICS =====
function getStats() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const today = new Date().toLocaleDateString('id-ID');
    let todayData = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === today) {
        todayData.push({
          status: data[i][6],
          duration: data[i][7]
        });
      }
    }
    
    const stats = {
      totalPresent: todayData.filter(x => x.status === 'Tepat Waktu').length,
      totalLate: todayData.filter(x => x.status === 'Terlambat').length,
      totalAbsent: todayData.filter(x => ['Sakit', 'Izin'].includes(x.status)).length,
      totalToday: todayData.length,
      avgDuration: Math.round(
        todayData.filter(x => x.status === 'Terlambat')
          .reduce((sum, x) => sum + (x.duration || 0), 0) / 
        Math.max(1, todayData.filter(x => x.status === 'Terlambat').length)
      )
    };
    
    return stats;
  } catch (error) {
    Logger.log('Error getting stats: ' + error.toString());
    throw error;
  }
}
```

4. **Ganti `YOUR_SHEET_ID` dengan Sheet ID Anda**
   - Lihat URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_DISINI/...`

#### **Step 4: Deploy Google Apps Script**

1. Click **⚙️ Settings** di sidebar
2. Cari "General" → "Execute the app as"
3. Pilih akun Google Anda
4. Click **Deploy** (tombol kanan atas)
5. Pilih **New Deployment**
6. Type: **Web app**
7. Execute as: (Pilih akun Anda)
8. Who has access: **Anyone**
9. Click **Deploy**
10. **Copy URL deployment** (simpan untuk step berikutnya)

#### **Step 5: Integrate dengan Aplikasi**

1. Buka aplikasi: https://soetedjossi-bit.github.io/TERLAMBAT
2. Login (jika belum)
3. Go to **Pengaturan** tab
4. Scroll ke **Integrasi Google Sheet**
5. Paste:
   - **URL Google Apps Script**: Dari step 4 (point 10)
   - **Google Sheet ID**: Sheet ID dari URL
6. Click **Simpan Pengaturan**

✅ **Done! Data akan otomatis sync ke Google Sheet**

---

## Customization

### **Ubah Kredensial Login**

Edit `js/auth.js`:
```javascript
const DEFAULT_CREDENTIALS = {
    email: 'admin@sekolah.com',
    password: 'password_anda',
    name: 'Admin Sekolah'
};
```

### **Ubah Warna Theme**

Edit `css/style.css` - bagian `:root`:
```css
:root {
    --primary: #6366f1;           /* Warna utama (indigo) */
    --primary-light: #818cf8;
    --success: #10b981;           /* Warna sukses (hijau) */
    --warning: #f59e0b;           /* Warna warning (kuning) */
    --danger: #ef4444;            /* Warna danger (merah) */
    /* ... */
}
```

### **Ubah Pengaturan Sekolah Default**

Edit `js/main.js` - function `getSchoolSettings()`:
```javascript
function getSchoolSettings() {
    return {
        schoolName: 'SEKOLAH ANDA',      // Ubah nama sekolah
        startTime: '07:00',               // Ubah jam masuk
        lateThreshold: 10                 // Ubah batas terlambat (menit)
    };
}
```

### **Ubah Text/Label**

Edit `index.html` dan cari text yang ingin diubah, contoh:
- "📚 Presensi Siswa" → "Sistem Absensi Kelas"
- "Cek Kehadiran Siswa" → "Input Kehadiran"

---

## Deployment

### **Deploy ke GitHub Pages** (Recommended)

1. Fork repository ini
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: root
6. Save
7. Tunggu ~1 menit
8. Akses: `https://username.github.io/TERLAMBAT`

### **Deploy ke Vercel** (Free)

1. Buka https://vercel.com
2. Click "New Project"
3. Import repository
4. Deploy
5. Akses via domain yang diberikan

### **Deploy ke Netlify** (Free)

1. Buka https://netlify.com
2. Drag & drop folder ke canvas
3. atau connect GitHub
4. Deploy otomatis

---

## FAQ & Troubleshooting

### **Q: Apakah perlu internet?**
A: Data bisa disimpan offline (localStorage). Internet hanya diperlukan untuk:
- Sync ke Google Sheet
- Export data
- Update otomatis

### **Q: Apa yang disimpan di localStorage?**
A: Semua data presensi, settings, dan credentials. Data tersimpan lokal di browser.

### **Q: Bagaimana jika browser history dihapus?**
A: Backup data secara berkala via "Backup Data" button di Settings.

### **Q: Bisa multi-user?**
A: Ya, setiap user bisa login dengan akun berbeda. Data masih global.

### **Q: Bagaimana jika Google Sheet sudah full?**
A: Buat sheet baru dan update SHEET_ID di Google Apps Script.

### **Q: Bisakah digunakan offline sepenuhnya?**
A: Ya! Aplikasi berfungsi 100% offline. Sync ke Google Sheet optional.

### **Q: Bagaimana security?**
A: 
- Data di localStorage terenkripsi browser
- HTTPS untuk komunikasi
- Ganti password default di production

### **Q: Bisa di-customize untuk sekolah lain?**
A: Tentu! Edit:
- Nama sekolah di Settings
- Jam masuk & batas terlambat
- Warna & theme
- Text & label

---

## Technical Stack

```
Frontend:
  - HTML5
  - CSS3 (Glassmorphism, Responsive)
  - JavaScript (Vanilla, ES6+)
  - Chart.js (Analytics)
  - html2pdf.js (PDF Export)
  - PapaParse (CSV Export)

Backend/Integration:
  - Google Apps Script
  - Google Sheets API
  - LocalStorage API

Deployment:
  - GitHub Pages
  - Vercel
  - Netlify
  - Self-hosted (cPanel, VPS, etc)
```

---

## Performance Tips

1. **Optimize Data**: Hapus data lama secara berkala
2. **Clear Cache**: Clear browser cache jika perlu
3. **Backup**: Backup data setiap minggu
4. **Monitor**: Check statistics secara rutin
5. **Update**: Pull latest version dari repository

---

## Next Steps

1. ✅ Setup aplikasi
2. ✅ Setup Google Sheet (optional)
3. ✅ Customize untuk sekolah Anda
4. ✅ Deploy ke public
5. ✅ Train users
6. ✅ Monitor & maintain

---

**Need help? Open an issue atau contact developer!**

🎉 **Happy Tracking!**
