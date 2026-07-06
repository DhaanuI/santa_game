import fs from 'fs';
import csvParser from 'csv-parser';
import { createEmployee } from '../models/Employee.js';

export const readEmployeeList = async (filePath) => {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const employees = [];
  const seen = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        try {
          const employee = createEmployee(row['Employee_Name'], row['Employee_EmailID']);

          if (seen.has(employee.email)) {
            throw new Error(`Duplicate employee: ${employee.email}`);
          }

          seen.add(employee.email);
          employees.push(employee);
        } catch (error) {
          reject(error);
        }
      })
      .on('end', () => {
        if (employees.length === 0) reject(new Error('No employees found'));
        else resolve(employees);
      })
      .on('error', reject);
  });
};

export const readPreviousYearList = async (filePath) => {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const previousPairs = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        try {
          const giver = createEmployee(row['Employee_Name'], row['Employee_EmailID']);
          const receiver = createEmployee(row['Secret_Child_Name'], row['Secret_Child_EmailID']);
          previousPairs.push({ giver, receiver });
        } catch (error) {
          reject(error);
        }
      })
      .on('end', () => resolve(previousPairs))
      .on('error', reject);
  });
};








