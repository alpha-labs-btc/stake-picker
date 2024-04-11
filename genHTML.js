const fs = require('fs');
const path = require('path');

function csvToHTMLTable(csvData) {
    let rows = csvData.split("\n");
    let html = "<table>\n";

    // Header row
    html += "<tr>";
    const headers = rows[0].split(",");
    headers.forEach(header => {
        html += `<th>${header.trim().replace(/"/g, '')}</th>`;
    });
    html += "</tr>\n";

    // Data rows
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(",");
        if (cells.length === headers.length) { // Ensuring row is not empty
            html += "<tr>";
            cells.forEach(cell => {
                html += `<td>${cell.trim().replace(/"/g, '')}</td>`;
            });
            html += "</tr>\n";
        }
    }

    html += "</table>";
    return html;
}

// Read CSV file
const csvFilePath = path.join(__dirname, 'ticket.csv');
fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the CSV file:', err);
        return;
    }
    const htmlTable = csvToHTMLTable(data);
    const markdownContent = `# Data from ticket.csv\n\n${htmlTable}`;

    // Save to html.md
    const mdFilePath = path.join(__dirname, 'README.md');
    fs.writeFile(mdFilePath, markdownContent, err => {
        if (err) {
            console.error('Error writing the Markdown file:', err);
        } else {
            console.log('Markdown file (html.md) created successfully.');
        }
    });
});
