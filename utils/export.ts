// Mock data sources for export functionality
export const mockData = {
    Leads: [],
    Companies: [],
    Contacts: [],
    Deals: [],
    Activities: [],
    Tasks: []
};


// --- Data Export Utility ---

/**
 * Converts an array of objects to a CSV string.
 */
function toCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = (value === null || value === undefined) ? '' : String(value);
        // Handle values with commas by enclosing them in double quotes
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ];
  return csvRows.join('\n');
}

/**
 * Triggers a browser download for the given data.
 * @param data The data to be downloaded.
 * @param filename The name of the file.
 * @param format The format of the file ('csv', 'xlsx', 'json').
 */
export function exportDataAsFile(data: any[], filename: string, format: 'csv' | 'xlsx' | 'json') {
  let fileContent: string;
  let mimeType: string;
  const fileExtension = format === 'xlsx' ? 'csv' : format; // Note: Simulating XLSX as CSV

  switch (format) {
    case 'json':
      fileContent = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      break;
    case 'xlsx': // Simulate XLSX export by providing CSV data.
    case 'csv':
    default:
      fileContent = toCSV(data);
      mimeType = 'text/csv';
      break;
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}