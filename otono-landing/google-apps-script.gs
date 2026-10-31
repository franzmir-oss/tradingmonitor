/**
 * Reservas de Sesiones de Otoño — Google Apps Script
 *
 * Guarda cada reserva en una hoja de Google Sheets y devuelve las fechas
 * ocupadas a la landing, para que se bloqueen automáticamente para todos.
 *
 * Para liberar una fecha: borra su fila en la hoja "Reservas".
 */
const SHEET_NAME = 'Reservas';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Fecha sesión', 'Nombre', 'Apellidos', 'Correo', 'Teléfono', 'Reservado el']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function bookedDates_() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 1).getDisplayValues()
    .map(r => String(r[0]).trim())
    .filter(Boolean);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET → { booked: ['2026-11-07', ...] }
function doGet() {
  return json_({ booked: bookedDates_() });
}

// POST { date, name, last, mail, tel } → { ok: true } o { ok: false, reason: 'taken' }
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita que dos personas reserven la misma fecha a la vez
  try {
    const d = JSON.parse(e.postData.contents);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) return json_({ ok: false, reason: 'invalid' });
    if (bookedDates_().indexOf(d.date) !== -1) return json_({ ok: false, reason: 'taken' });
    const sh = getSheet_();
    sh.appendRow(["'" + d.date, d.name || '', d.last || '', d.mail || '', "'" + (d.tel || ''), new Date()]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
