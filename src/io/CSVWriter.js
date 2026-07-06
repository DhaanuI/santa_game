import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

export const saveResultToCSV = async (pairs, outputPath) => {
  if (!pairs?.length) throw new Error('No pairs to write');

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const records = pairs
    .sort((a, b) => a.giver.name.localeCompare(b.giver.name))
    .map(p => ({
      employeeName: p.giver.name,
      employeeEmail: p.giver.email,
      secretChildName: p.receiver.name,
      secretChildEmail: p.receiver.email
    }));

  const writer = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'employeeName', title: 'Employee_Name' },
      { id: 'employeeEmail', title: 'Employee_EmailID' },
      { id: 'secretChildName', title: 'Secret_Child_Name' },
      { id: 'secretChildEmail', title: 'Secret_Child_EmailID' }
    ]
  });

  await writer.writeRecords(records);
};
