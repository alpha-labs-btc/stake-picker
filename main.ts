import csv from 'csv-parser';
import fs from 'fs';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

interface Ticket {
    ticket_id: number;
    wallet_address: string;
}

// Read the CSV file and parse it into an array of Tickets
function readCSV(filePath: string): Promise<Ticket[]> {
    const tickets: Ticket[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => tickets.push(data))
            .on('end', () => resolve(tickets))
            .on('error', (error) => reject(error));
    });
}

// Convert a hexadecimal string to a decimal number
function hexToDecimal(hex: string): number {
    return parseInt(hex, 16);
}

// Select the winners based on the algorithm
async function selectWinners(filePath: string, rootBlockHash: string, numWinners: number): Promise<Ticket[]> {
    const tickets = await readCSV(filePath);
    const winners: Ticket[] = [];
    let s = hexToDecimal(rootBlockHash.slice(-9));

    while (tickets.length > 0 && winners.length < numWinners) {
        const index = s % tickets.length;
        const winner = tickets.splice(index, 1)[0];
        winners.push(winner);

        if (winners.length >= 1) {
            s = parseInt(winner.ticket_id.toString());
        }
    }

    // Write winners to a CSV file
    const csvWriter = createCsvWriter({
        path: 'winners.csv',
        header: [
            {id: 'ticket_id', title: 'TICKET_ID'},
            {id: 'wallet_address', title: 'WALLET_ADDRESS'}
        ]
    });

    await csvWriter.writeRecords(winners);

    return winners;
}

// Usage
const filePath = process.argv[2];
const rootBlockHash = process.argv[3];
const numWinners = parseInt(process.argv[4]);

selectWinners(filePath, rootBlockHash, numWinners)
    .then((winners) => console.log(winners))
    .catch((error) => console.error(error));