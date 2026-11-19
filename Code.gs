// Google Apps Script — paste this into Extensions > Apps Script on your Google Sheet.
// This acts as your free "database API": phone POSTs messages in, website GETs them out.

var SHEET_NAME = 'Messages';

// CHANGE THIS to your own secret value before deploying. Keep it private.
var API_KEY = 'change-this-to-a-long-random-secret';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.apiKey !== API_KEY) {
      return jsonOutput({ error: 'unauthorized' });
    }
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.sender || '',
      data.body || '',
      data.received_at || ''
    ]);
    return jsonOutput({ status: 'ok' });
  } catch (err) {
    return jsonOutput({ error: err.toString() });
  }
}

function doGet(e) {
  var key = e.parameter.apiKey;
  if (key !== API_KEY) {
    return jsonOutput({ error: 'unauthorized' });
  }
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();
  var messages = [];
  for (var i = 1; i < rows.length; i++) { // row 0 is the header
    messages.push({
      loggedAt: rows[i][0],
      sender: rows[i][1],
      body: rows[i][2],
      receivedAt: rows[i][3]
    });
  }
  messages.reverse(); // newest first
  return jsonOutput(messages);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Logged At', 'Sender', 'Body', 'Received At']);
  }
  return sheet;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
