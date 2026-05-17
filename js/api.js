// ===== GOOGLE SHEET API INTEGRATION =====

// Send data to Google Sheet via Google Apps Script
async function sendToGoogleSheet(data) {
    const settings = getGoogleSettings();
    
    if (!settings.scriptUrl) {
        console.warn('Google Apps Script URL not configured');
        return { success: false, message: 'Google Sheet tidak dikonfigurasi' };
    }
    
    try {
        const response = await fetch(settings.scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'addAttendance',
                data: data
            })
        });
        
        console.log('Data sent to Google Sheet:', data);
        return { success: true, message: 'Data berhasil dikirim ke Google Sheet' };
    } catch (error) {
        console.error('Error sending to Google Sheet:', error);
        // Tetap lanjut meski gagal, karena sudah disimpan di local
        return { success: false, message: error.message };
    }
}

// Fetch attendance data from Google Sheet
async function getAttendanceFromGoogleSheet() {
    const settings = getGoogleSettings();
    
    if (!settings.scriptUrl) {
        return [];
    }
    
    try {
        const response = await fetch(settings.scriptUrl + '?action=getAttendance');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching from Google Sheet:', error);
        return [];
    }
}

// Google Apps Script deployment template
const GAS_SCRIPT_TEMPLATE = `
const SHEET_ID = 'YOUR_SHEET_ID'; // Ganti dengan Sheet ID Anda
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
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
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
}`;

// Helper function untuk mendapatkan Google Settings
function getGoogleSettings() {
    const saved = localStorage.getItem('googleSettings');
    return saved ? JSON.parse(saved) : { scriptUrl: '', sheetId: '' };
}