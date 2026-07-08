import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import { createEmployee } from '../models/Employee.js';

const isExcelFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.xlsx' || ext === '.xls';
};

const readExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

export const readEmployeeList = async (filePath) => {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  if (isExcelFile(filePath)) {
    const rows = readExcelFile(filePath);
    const employees = [];
    const seen = new Set();

    for (const row of rows) {
      const employee = createEmployee(row['Employee_Name'], row['Employee_EmailID']);

      if (seen.has(employee.email)) {
        throw new Error(`Duplicate employee: ${employee.email}`);
      }

      seen.add(employee.email);
      employees.push(employee);
    }

    if (employees.length === 0) throw new Error('No employees found');
    return employees;
  }

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

  if (isExcelFile(filePath)) {
    const rows = readExcelFile(filePath);
    const assignments = [];

    for (const row of rows) {
      const giver = createEmployee(row['Employee_Name'], row['Employee_EmailID']);
      const receiver = createEmployee(row['Secret_Child_Name'], row['Secret_Child_EmailID']);
      assignments.push({ giver, receiver });
    }

    return assignments;
  }

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








