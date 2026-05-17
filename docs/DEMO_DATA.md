# 📊 Demo Data Presensi

File `demo-data.html` digunakan untuk menambahkan data demo ke aplikasi presensi.

## Cara Menggunakan

### **1. Buka File Demo**
Buka `demo-data.html` di browser Anda

### **2. Pilih Demo Data**
- **Load Demo Data (20 Record)**: Menambahkan 20 data presensi dari hari ini dan kemarin
- **Load Minimal Demo (5 Record)**: Menambahkan 5 data presensi minimal
- **Hapus Semua Demo Data**: Menghapus semua data yang sudah ditambahkan

### **3. Buka Aplikasi Presensi**
Setelah memuat demo data, buka aplikasi presensi: `index.html`

Data yang ditambahkan akan langsung terlihat di:
- ✅ Dashboard (Statistik & Daftar Terbaru)
- ✅ Tab Riwayat (Tabel lengkap)
- ✅ Tab Laporan (Grafik & Statistik)

---

## Data yang Ditambahkan

### **Struktur Data**
```javascript
{
    studentName: 'Nama Siswa',
    studentClass: '12A',
    nisn: '1234567890',
    arrivalTime: '07:15',
    status: 'Terlambat',  // atau 'Tepat Waktu', 'Sakit', 'Izin'
    duration: 15,         // durasi terlambat dalam menit
    notes: 'Catatan',
    date: '17/05/2026',
    timestamp: '2026-05-17T08:30:00Z'
}
```

### **Sample Data**
- **Tepat Waktu**: 5 siswa
- **Terlambat**: 7 siswa (15-45 menit)
- **Sakit**: 2 siswa
- **Izin**: 1 siswa

---

## Testing

Gunakan demo data untuk testing:

1. **Dashboard Testing**
   - Lihat statistik hari ini
   - Verify perhitungan otomatis

2. **History Testing**
   - Filter by class
   - Filter by status
   - Filter by date
   - Export data

3. **Reports Testing**
   - Lihat pie chart
   - Lihat line chart
   - Check statistics

4. **Export Testing**
   - Export PDF
   - Export CSV
   - Backup JSON

---

## Notes

- Demo data disimpan di localStorage
- Data tidak akan hilang sampai browser cache dihapus
- Bisa menambahkan data real setelah demo data
- Gunakan tombol "Hapus Semua Demo Data" untuk reset

---

**Happy Testing! 🚀**
