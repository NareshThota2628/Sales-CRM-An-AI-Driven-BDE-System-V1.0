// Mock data sources for export functionality
export const mockData = {
    Leads: [
      { id: 'lead-1', name: 'John Doe', company: 'Innovatech', status: 'Qualified', aiScore: 'Hot', source: 'Webinar' },
      { id: 'lead-2', name: 'Jane Smith', company: 'Solutions Inc.', status: 'New', aiScore: 'Hot', source: 'Referral' },
    ],
    Companies: [
      { id: 'comp-1', name: 'Innovatech', health: 'Healthy', arr: 50000, owner: 'Amélie Laurent' },
      { id: 'comp-2', name: 'Quantum Leap', health: 'Healthy', arr: 120000, owner: 'Amélie Laurent' },
    ],
    Contacts: [
      { name: 'John Doe', title: 'VP of Engineering', company: 'Innovatech' },
      { name: 'Sarah Jenkins', title: 'Project Manager', company: 'Innovatech' },
    ],
    Deals: [
        { name: 'Initial Enterprise License', stage: 'Closed Won', amount: 50000, closeDate: '2023-08-15' },
        { name: 'Analytics Pro Add-on', stage: 'In Progress', amount: 15000, closeDate: '2024-03-20' },
    ],
    Activities: [
        { type: 'note', content: 'Customer is very happy with the platform.', author: 'Amélie Laurent' },
        { type: 'call', content: 'Q4 check-in call.', author: 'Amélie Laurent' },
    ],
    Tasks: [
        { id: 'task-1', title: 'Identify 50 new prospects', priority: 'High Priority', status: 'todo' },
        { id: 'task-5', title: 'Qualify 20 inbound leads', priority: 'High Priority', status: 'inprogress' },
    ]
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
