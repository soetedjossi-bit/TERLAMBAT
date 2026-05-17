// ===== CHARTS & REPORTS =====

let statusChart = null;
let trendChart = null;

// Load Reports Data
function loadReportsData() {
    const attendanceData = getAttendanceData();
    
    // Update summary stats
    updateSummaryStats(attendanceData);
    
    // Initialize charts
    initializeCharts(attendanceData);
}

// ===== UPDATE SUMMARY STATS =====
function updateSummaryStats(data) {
    if (data.length === 0) return;
    
    // Get data for this week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekData = data.filter(item => {
        const itemDate = new Date(item.date.split('/').reverse().join('-'));
        return itemDate >= weekAgo;
    });
    
    const lateData = weekData.filter(item => item.status === 'Terlambat');
    
    // Calculate stats
    const totalWeek = weekData.length;
    const totalLateWeek = lateData.length;
    
    const avgDuration = lateData.length > 0
        ? Math.round(lateData.reduce((sum, item) => sum + (item.duration || 0), 0) / lateData.length)
        : 0;
    
    // Find top late student
    const lateByStudent = {};
    lateData.forEach(item => {
        lateByStudent[item.studentName] = (lateByStudent[item.studentName] || 0) + 1;
    });
    
    const topLateName = Object.keys(lateByStudent).reduce((a, b) => 
        lateByStudent[a] > lateByStudent[b] ? a : b
    , '-') || '-';
    
    // Update UI
    document.getElementById('totalWeek').textContent = totalWeek;
    document.getElementById('totalLateWeek').textContent = totalLateWeek;
    document.getElementById('avgDuration').textContent = avgDuration + ' menit';
    document.getElementById('topLateStudent').textContent = topLateName === '-' ? '-' : `${topLateName} (${lateByStudent[topLateName]}x)`;
}

// ===== INITIALIZE CHARTS =====
function initializeCharts(data) {
    const today = new Date().toLocaleDateString('id-ID');
    const todayData = data.filter(item => item.date === today);
    
    // Status Chart (Pie)
    updateStatusChart(todayData);
    
    // Trend Chart (Line - 7 hari terakhir)
    updateTrendChart(data);
}

// ===== UPDATE STATUS CHART =====
function updateStatusChart(todayData) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const stats = {
        'Tepat Waktu': todayData.filter(item => item.status === 'Tepat Waktu').length,
        'Terlambat': todayData.filter(item => item.status === 'Terlambat').length,
        'Sakit': todayData.filter(item => item.status === 'Sakit').length,
        'Izin': todayData.filter(item => item.status === 'Izin').length
    };
    
    if (statusChart) {
        statusChart.data.labels = Object.keys(stats);
        statusChart.data.datasets[0].data = Object.values(stats);
        statusChart.update();
    } else {
        statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats),
                datasets: [{
                    data: Object.values(stats),
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6',
                        '#a855f7'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===== UPDATE TREND CHART =====
function updateTrendChart(data) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // Get last 7 days
    const days = [];
    const lateCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('id-ID');
        days.push(dateStr);
        
        const dayData = data.filter(item => item.date === dateStr && item.status === 'Terlambat');
        lateCounts.push(dayData.length);
    }
    
    if (trendChart) {
        trendChart.data.labels = days;
        trendChart.data.datasets[0].data = lateCounts;
        trendChart.update();
    } else {
        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Jumlah Terlambat',
                    data: lateCounts,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}