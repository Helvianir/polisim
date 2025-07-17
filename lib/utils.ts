
import { Party } from '../types';

/**
 * Generates a random color for a party.
 * Uses HSL color space to generate aesthetically pleasing, distinct colors.
 * @returns A hexadecimal color string.
 */
export const generatePartyColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 70; // 70-90%
  const lightness = Math.floor(Math.random() * 20) + 50;  // 50-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Triggers a file download for the given content.
 * @param content - The string content to be downloaded.
 * @param fileName - The name of the file to be saved.
 * @param contentType - The MIME type of the content.
 */
const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
};

/**
 * Exports the current simulation state to a JSON file.
 * @param state - The current state of the simulation to be exported.
 */
export const exportToJson = (state: { parties: Party[], totalSeats: number }) => {
    const simplifiedState = {
        totalSeats: state.totalSeats,
        parties: state.parties.map(({ id, name, seats, color, ideology }) => ({ id, name, seats, color, ideology })),
    };
    downloadFile(JSON.stringify(simplifiedState, null, 2), 'parliament_simulation.json', 'application/json');
};

/**
 * Converts an array of objects to a CSV string.
 * @param data - The array of objects to convert.
 * @returns A CSV formatted string.
 */
const toCsv = (data: Party[]): string => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), 
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName as keyof Party], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    return csvRows.join('\r\n');
};


/**
 * Exports the current party data to a CSV file.
 * @param parties - The list of parties to be exported.
 */
export const exportToCsv = (parties: Party[]) => {
    const simplifiedParties = parties.map(({ id, name, seats, color, ideology }) => ({ id, name, seats, color, ideology }));
    const csvContent = toCsv(simplifiedParties);
    downloadFile(csvContent, 'parliament_data.csv', 'text/csv;charset=utf-8;');
};
