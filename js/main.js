// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    loadAttendanceData();
    setupEventListeners();
    setupTabNavigation();
    checkUserLogin();
});

// ===== DIGITAL CLOCK =====
function initClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('dateDisplay');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    const form = document.getElementById('attendanceForm');
    const arrivalTimeInput = document.getElementById('arrivalTime');
    const refreshBtn = document.getElementById('refreshBtn');
    const filterBtn = document.getElementById('filterBtn');
    
    // Set current time as default
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    arrivalTimeInput.value = `${hours}:${minutes}`;
    
    form.addEventListener('submit', handleSubmit);
    refreshBtn?.addEventListener('click', loadAttendanceData);
    filterBtn?.addEventListener('click', applyFilter);
    
    // Export buttons
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportToExcel);
    document.getElementById('exportPdfBtn')?.addEventListener('click', exportToPdf);
    document.getElementById('exportCsvBtn')?.addEventListener('click', exportToCsv);
    
    // Data management buttons
    document.getElementById('clearDataBtn')?.addEventListener('click', clearAllData);
    document.getElementById('backupDataBtn')?.addEventListener('click', backupData);
    document.getElementById('saveGoogleSettings')?.addEventListener('click', saveGoogleSettings);
    document.getElementById('saveSchoolSettings')?.addEventListener('click', saveSchoolSettings);
}

// ===== TAB NAVIGATION =====
function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.dataset.tab;
            
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active class
            link.classList.add('active');
            document.getElementById(tabName)?.classList.add('active');
            
            // Load data untuk tab tertentu
            if (tabName === 'history') {
                loadHistoryData();
            } else if (tabName === 'reports') {
                loadReportsData();
            }
        });
    });
}

// ===== HANDLE FORM SUBMIT =====
async function handleSubmit(e) {
    e.preventDefault();
    
    const schoolSettings = getSchoolSettings();
    const arrivalTime = document.getElementById('arrivalTime').value;
    const status = document.getElementById('status').value;
    
    // Auto-detect terlambat jika belum dipilih
    let finalStatus = status;
    let duration = parseInt(document.getElementById('duration').value) || 0;
    
    if (status === 'Terlambat' && !duration) {
        const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
        const [startHours, startMinutes] = schoolSettings.startTime.split(':').map(Number);
        
        const arrivalDate = new Date(2000, 0, 1, arrHours, arrMinutes);
        const startDate = new Date(2000, 0, 1, startHours, startMinutes);
        
        duration = Math.max(0, Math.floor((arrivalDate - startDate) / 60000));
        document.getElementById('duration').value = duration;
    }
    
    const formData = {
        studentName: document.getElementById('studentName').value,
        studentClass: document.getElementById('studentClass').value,
        nisn: document.getElementById('nisn').value,
        arrivalTime: arrivalTime,
        status: finalStatus,
        duration: duration,
        notes: document.getElementById('notes').value,
        date: new Date().toLocaleDateString('id-ID'),
        timestamp: new Date().toISOString()
    };
    
    try {
        // Send to Google Sheet
        const googleSettings = getGoogleSettings();
        if (googleSettings.scriptUrl && googleSettings.sheetId) {
            await sendToGoogleSheet(formData);
        }
        
        // Save locally
        saveAttendanceLocally(formData);
        
        showNotification('✓ Data presensi berhasil disimpan!', 'success');
        document.getElementById('attendanceForm').reset();
        loadAttendanceData();
    } catch (error) {
        console.error('Error:', error);
        showNotification('✗ Gagal menyimpan data', 'error');
    }
}

// ===== LOAD ATTENDANCE DATA =====
function loadAttendanceData() {
    const attendanceData = getAttendanceData();
    const container = document.getElementById('recentAttendance');
    
    if (attendanceData.length === 0) {
        container.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i> Belum ada data presensi</p>';
        updateStats([]);
        return;
    }
    
    // Sort by timestamp descending
    attendanceData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Show last 10 records
    const recentData = attendanceData.slice(0, 10);
    
    container.innerHTML = recentData.map((item, idx) => {
        const statusClass = `status-${item.status.toLowerCase().replace(/\s+/g, '')}`;
        const itemClass = item.status === 'Terlambat' ? 'late' : item.status === 'Sakit' ? 'sick' : item.status === 'Izin' ? 'permission' : '';
        
        return `
            <div class="attendance-item ${itemClass}">
                <div class="item-info">
                    <div class="item-name">${item.studentName}</div>
                    <div class="item-details">
                        <span>${item.studentClass}</span>
                        <span>${item.arrivalTime}</span>
                        <span>${item.date}</span>
                        ${item.duration ? `<span>(${item.duration} menit)</span>` : ''}
                    </div>
                </div>
                <span class="item-status ${statusClass}">${item.status}</span>
            </div>
        `;
    }).join('');
    
    updateStats(attendanceData);
}

// ===== UPDATE STATISTICS =====
function updateStats(data) {
    const today = new Date().toLocaleDateString('id-ID');
    const todayData = data.filter(item => item.date === today);
    
    const stats = {
        present: todayData.filter(item => item.status === 'Tepat Waktu').length,
        late: todayData.filter(item => item.status === 'Terlambat').length,
        absent: todayData.filter(item => ['Sakit', 'Izin'].includes(item.status)).length,
        total: todayData.length
    };
    
    document.getElementById('totalPresent').textContent = stats.present;
    document.getElementById('totalLate').textContent = stats.late;
    document.getElementById('totalAbsent').textContent = stats.absent;
    document.getElementById('totalToday').textContent = stats.total;
}

// ===== LOAD HISTORY DATA =====
function loadHistoryData() {
    const attendanceData = getAttendanceData();
    const tbody = document.getElementById('historyTableBody');
    
    if (attendanceData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">Tidak ada data</td></tr>';
        return;
    }
    
    const sorted = [...attendanceData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    tbody.innerHTML = sorted.map((item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.date}</td>
            <td>${item.arrivalTime}</td>
            <td>${item.studentName}</td>
            <td>${item.studentClass}</td>
            <td>${item.nisn || '-'}</td>
            <td><span class="item-status status-${item.status.toLowerCase().replace(/\s+/g, '')}">${item.status}</span></td>
            <td>${item.duration ? item.duration + ' menit' : '-'}</td>
            <td>${item.notes || '-'}</td>
            <td>
                <button class="btn-icon" onclick="deleteRecord('${item.timestamp}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== APPLY FILTER =====
function applyFilter() {
    const filterClass = document.getElementById('filterClass').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('filterDate').value;
    
    let attendanceData = getAttendanceData();
    
    attendanceData = attendanceData.filter(item => {
        const classMatch = !filterClass || item.studentClass.toLowerCase().includes(filterClass);
        const statusMatch = !filterStatus || item.status === filterStatus;
        const dateMatch = !filterDate || item.date === new Date(filterDate).toLocaleDateString('id-ID');
        return classMatch && statusMatch && dateMatch;
    });
    
    const tbody = document.getElementById('historyTableBody');
    
    if (attendanceData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">Tidak ada data sesuai filter</td></tr>';
        return;
    }
    
    tbody.innerHTML = attendanceData.map((item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.date}</td>
            <td>${item.arrivalTime}</td>
            <td>${item.studentName}</td>
            <td>${item.studentClass}</td>
            <td>${item.nisn || '-'}</td>
            <td><span class="item-status status-${item.status.toLowerCase().replace(/\s+/g, '')}">${item.status}</span></td>
            <td>${item.duration ? item.duration + ' menit' : '-'}</td>
            <td>${item.notes || '-'}</td>
            <td>
                <button class="btn-icon" onclick="deleteRecord('${item.timestamp}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== DELETE RECORD =====
function deleteRecord(timestamp) {
    if (!confirm('Apakah Anda yakin ingin menghapus record ini?')) return;
    
    let data = getAttendanceData();
    data = data.filter(item => item.timestamp !== timestamp);
    localStorage.setItem('attendanceData', JSON.stringify(data));
    loadHistoryData();
    showNotification('✓ Record berhasil dihapus', 'success');
}

// ===== CLEAR ALL DATA =====
function clearAllData() {
    if (!confirm('PERINGATAN! Ini akan menghapus SEMUA data presensi. Lanjutkan?')) return;
    if (!confirm('Yakin? Tindakan ini tidak bisa dibatalkan!')) return;
    
    localStorage.removeItem('attendanceData');
    showNotification('✓ Semua data telah dihapus', 'success');
    loadAttendanceData();
}

// ===== BACKUP DATA =====
function backupData() {
    const data = getAttendanceData();
    const backup = {
        version: '1.0',
        backupDate: new Date().toISOString(),
        records: data
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_presensi_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('✓ Backup data berhasil diunduh', 'success');
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function getAttendanceData() {
    return JSON.parse(localStorage.getItem('attendanceData')) || [];
}

function saveAttendanceLocally(data) {
    const existing = getAttendanceData();
    existing.push(data);
    localStorage.setItem('attendanceData', JSON.stringify(existing));
}

function getGoogleSettings() {
    const saved = localStorage.getItem('googleSettings');
    return saved ? JSON.parse(saved) : { scriptUrl: '', sheetId: '' };
}

function saveGoogleSettings() {
    const scriptUrl = document.getElementById('googleSheetUrl').value;
    const sheetId = document.getElementById('sheetId').value;
    
    if (!scriptUrl || !sheetId) {
        showNotification('✗ Silakan isi semua field', 'error');
        return;
    }
    
    localStorage.setItem('googleSettings', JSON.stringify({ scriptUrl, sheetId }));
    showNotification('✓ Pengaturan Google Sheet berhasil disimpan', 'success');
}

function getSchoolSettings() {
    const saved = localStorage.getItem('schoolSettings');
    return saved ? JSON.parse(saved) : {
        schoolName: 'Sekolah Kami',
        startTime: '07:00',
        lateThreshold: 10
    };
}

function saveSchoolSettings() {
    const schoolName = document.getElementById('schoolName').value;
    const startTime = document.getElementById('startTime').value;
    const lateThreshold = document.getElementById('lateThreshold').value;
    
    localStorage.setItem('schoolSettings', JSON.stringify({
        schoolName,
        startTime,
        lateThreshold: parseInt(lateThreshold)
    }));
    
    showNotification('✓ Pengaturan sekolah berhasil disimpan', 'success');
}

function loadSchoolSettings() {
    const settings = getSchoolSettings();
    document.getElementById('schoolName').value = settings.schoolName;
    document.getElementById('startTime').value = settings.startTime;
    document.getElementById('lateThreshold').value = settings.lateThreshold;
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSchoolSettings();
    const googleSettings = getGoogleSettings();
    if (googleSettings.scriptUrl) {
        document.getElementById('googleSheetUrl').value = googleSettings.scriptUrl;
    }
    if (googleSettings.sheetId) {
        document.getElementById('sheetId').value = googleSettings.sheetId;
    }
});