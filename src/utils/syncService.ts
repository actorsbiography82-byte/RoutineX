import { Task } from '@/types/routine';

/**
 * Pushes tasks to Google Apps Script Web App.
 * Uses Next.js API proxy to avoid browser CORS issues, with direct fetch fallback.
 */
export async function pushTasksToSheet(scriptUrl: string, tasks: Task[]): Promise<{ success: boolean; error?: string }> {
  if (!scriptUrl) return { success: false, error: 'No script URL configured' };

  try {
    // Try via Next.js internal API proxy
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptUrl, action: 'sync', data: tasks }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Sync returned error' };
    }
  } catch (err: any) {
    // If proxy fails (e.g. static export), try direct POST
    try {
      const direct = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'sync', data: tasks }),
        mode: 'cors',
      });
      const data = await direct.json();
      return { success: !!data.success, error: data.error };
    } catch (directErr: any) {
      return { success: false, error: directErr.message || 'Network error' };
    }
  }

  return { success: false, error: 'Failed to push to Google Sheet' };
}

/**
 * Pulls tasks from Google Apps Script Web App.
 */
export async function pullTasksFromSheet(scriptUrl: string): Promise<{ success: boolean; tasks?: Task[]; error?: string }> {
  if (!scriptUrl) return { success: false, error: 'No script URL configured' };

  try {
    const response = await fetch(`/api/sync?scriptUrl=${encodeURIComponent(scriptUrl)}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.tasks)) {
        return { success: true, tasks: data.tasks };
      }
      return { success: false, error: data.error || 'Failed to parse sheet data' };
    }
  } catch (err: any) {
    // Direct GET fallback
    try {
      const direct = await fetch(scriptUrl, { method: 'GET', mode: 'cors' });
      const data = await direct.json();
      if (data.success && Array.isArray(data.tasks)) {
        return { success: true, tasks: data.tasks };
      }
    } catch (directErr: any) {
      return { success: false, error: directErr.message || 'Network error' };
    }
  }

  return { success: false, error: 'Failed to pull from Google Sheet' };
}

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * RoutineX Google Sheet Backend Sync Bridge
 * 1. Open Google Sheet -> Extensions -> Apps Script
 * 2. Paste this code and save (Ctrl+S)
 * 3. Click Deploy -> New deployment -> Select type: Web app
 * 4. Execute as: "Me" | Who has access: "Anyone"
 * 5. Click Deploy, copy Web App URL, and paste it into RoutineX Settings!
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var tasks = [];

  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        tasks.push({
          id: String(row[0]),
          title: String(row[1] || ''),
          time: String(row[2] || ''),
          category: String(row[3] || 'General'),
          completed: String(row[4]).toLowerCase() === 'true' || row[4] === true,
          createdAt: Number(row[5] || Date.now()),
          updatedAt: Number(row[6] || Date.now())
        });
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    tasks: tasks,
    lastSyncedAt: Date.now()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var tasks = payload.data || [];

    sheet.clearContents();
    sheet.appendRow(["ID", "Title", "Time", "Category", "Completed", "CreatedAt", "UpdatedAt"]);

    tasks.forEach(function(t) {
      sheet.appendRow([
        t.id,
        t.title,
        t.time || '',
        t.category || 'General',
        t.completed ? true : false,
        t.createdAt || Date.now(),
        t.updatedAt || Date.now()
      ]);
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      count: tasks.length,
      lastSyncedAt: Date.now()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

