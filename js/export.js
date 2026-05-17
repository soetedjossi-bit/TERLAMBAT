// ===== EXPORT FUNCTIONS =====

// Export to Excel
function exportToExcel() {
    const data = getAttendanceData();
    if (data.length === 0) {
        showNotification('✗ Tidak ada data untuk diexport', 'error');
        return;
    }
    
    // Create CSV
    let csv = 'Tanggal,Waktu,Nama Siswa,Kelas,NISN,Waktu Tiba,Status,Durasi Terlambat,Catatan\n';
    
    data.forEach(item => {
        const row = [
            item.date,
            item.timestamp,
            item.studentName,
            item.studentClass,
            item.nisn || '',
            item.arrivalTime,
            item.status,
            item.duration || '',
            (item.notes || '').replace(/"/g, '""')
        ];
        csv += `"${row.join('",')}"\n`;
    });
    
    // Download as .xlsx (via CSV)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `presensi_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    showNotification('✓ File Excel berhasil diunduh', 'success');
}

// Export to CSV
function exportToCsv() {
    const data = getAttendanceData();
    if (data.length === 0) {
        showNotification('✗ Tidak ada data untuk diexport', 'error');
        return;
    }
    
    let csv = 'Tanggal,Waktu,Nama Siswa,Kelas,NISN,Waktu Tiba,Status,Durasi Terlambat,Catatan\n';
    
    data.forEach(item => {
        const row = [
            item.date,
            item.timestamp,
            item.studentName,
            item.studentClass,
            item.nisn || '',
            item.arrivalTime,
            item.status,
            item.duration || '',
            (item.notes || '').replace(/,/g, ';')
        ];
        csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `presensi_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    showNotification('✓ File CSV berhasil diunduh', 'success');
}

// Export to PDF
function exportToPdf() {
    const data = getAttendanceData();
    if (data.length === 0) {
        showNotification('✗ Tidak ada data untuk diexport', 'error');
        return;
    }
    
    const settings = getSchoolSettings();
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">${settings.schoolName}</h2>
        <h3 style="text-align: center; margin-bottom: 20px;">LAPORAN PRESENSI SISWA</h3>
        <p style="text-align: right; margin-bottom: 20px;">Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background-color: #f0f0f0;">
                    <th style="border: 1px solid #ccc; padding: 10px;">No</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Tanggal</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Nama Siswa</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Kelas</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Waktu Tiba</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Status</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Durasi</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, idx) => `
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">${idx + 1}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.date}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.studentName}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.studentClass}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.arrivalTime}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.status}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${item.duration ? item.duration + ' menit' : '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <p style="margin-top: 40px;">Dibuatkan oleh: ${getLoggedInUser()?.name || 'Admin'}</p>
    `;
    
    const opt = {
        margin: 10,
        filename: `presensi_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
    showNotification('✓ File PDF berhasil diunduh', 'success');
}

// Send Email Report
function sendEmailBtn() {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        showNotification('✗ Silakan login terlebih dahulu', 'error');
        return;
    }
    
    // This would require backend support for sending emails
    // For now, show a placeholder
    showNotification('⚠ Fitur email akan tersedia setelah integrasi backend', 'info');
    
    // Uncomment untuk implementasi dengan backend
    // const data = getAttendanceData();
    // sendEmailReport(currentUser.email, data);
}