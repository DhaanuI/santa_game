# Secret Santa Game

An automated Secret Santa assignment system for company employees, built with Node.js. This application generates fair and valid Secret Santa assignments while respecting constraints like avoiding self-assignments and preventing repeated assignments from previous years.

## Features

- **Backtracking Algorithm**: Uses intelligent backtracking to find valid assignments
- **Previous Year Avoidance**: Ensures employees don't get the same Secret Child as the previous year
- **Input Validation**: Comprehensive validation of employee data and email formats
- **Modular Architecture**: Clean, functional design with separated concerns
- **Error Handling**: Clear error messages for invalid inputs or impossible constraints
- **CSV & Excel Support**: Reads employee data from CSV or XLSX files, writes assignments to CSV
- **Tested**: Unit tests covering all core functionality

## Architecture

The application follows a modular, functional design:

```
src/
├── models/           # Employee and Assignment creation
├── io/              # CSV reading and writing
├── services/        # Backtracking assignment algorithm
└── index.js         # Main application entry point
```

### Key Components

- **Employee.js**: Creates and validates employee objects
- **Assignment.js**: Creates valid giver-receiver pairs
- **CSVParser.js**: Reads employee list and previous year assignments from CSV
- **CSVWriter.js**: Writes final assignments to CSV file
- **SecretSantaAssigner.js**: Backtracking algorithm that finds valid assignments

## Installation

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Steps

1. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Generate Secret Santa assignments from an employee CSV file:

```bash
node src/index.js data/employees.csv output/assignments.csv
```

### With Previous Year's Assignments

Avoid repeating assignments from the previous year:

```bash
# Using CSV files
node src/index.js data/employees.csv output/assignments.csv data/previous_assignments.csv

# Using Excel files (also supported)
node src/index.js data/employees.xlsx output/assignments.csv data/previous.xlsx
```

### Command Line Arguments

```
node src/index.js <employees_file> <output_file> [previous_assignments_file]

Arguments:
  employees_file              Path to CSV file containing employee list
  output_file                 Path where output CSV will be created
  previous_assignments_file   (Optional) Path to previous year's assignments
```

## Input File Format

The application supports both **CSV** and **Excel (.xlsx, .xls)** files for input.

### Employees File (CSV or Excel)

The file must have these columns:
- `Employee_Name`: Full name of the employee
- `Employee_EmailID`: Email address of the employee

Example:
```csv
Employee_Name,Employee_EmailID
Alice Johnson,alice.johnson@acme.com
Bob Smith,bob.smith@acme.com
Charlie Brown,charlie.brown@acme.com
```

### Previous Assignments File (CSV or Excel - Optional)

The file must have these columns:
- `Employee_Name`: Giver's name
- `Employee_EmailID`: Giver's email
- `Secret_Child_Name`: Receiver's name
- `Secret_Child_EmailID`: Receiver's email

Example:
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
Alice Johnson,alice.johnson@acme.com,Bob Smith,bob.smith@acme.com
Bob Smith,bob.smith@acme.com,Charlie Brown,charlie.brown@acme.com
```

## Output File Format

The output CSV file contains the following columns:
- `Employee_Name`: Employee who will give the gift
- `Employee_EmailID`: Giver's email
- `Secret_Child_Name`: Employee who will receive the gift
- `Secret_Child_EmailID`: Receiver's email

## Testing

Run the test suite:

```bash
npm test
```

This runs all unit tests in `tests/manual-test.js` covering:
- Employee validation
- Assignment creation
- Backtracking algorithm
- Constraint validation

## Constraints and Validations

The application ensures:

1. ✓ No employee is assigned to themselves
2. ✓ Each employee gives to exactly one person
3. ✓ Each employee receives from exactly one person
4. ✓ No employee gets the same Secret Child as previous year (if provided)
5. ✓ All employees participate in the Secret Santa
6. ✓ No duplicate assignments

## Error Handling

The application handles various error scenarios:

- **Invalid CSV Format**: Missing required columns, empty files
- **Invalid Employee Data**: Empty names, invalid email formats
- **Duplicate Employees**: Same employee listed multiple times
- **Insufficient Employees**: Less than 2 employees
- **File Not Found**: Missing input files
- **Permission Errors**: Unable to write output file
- **Constraint Conflicts**: Unable to generate valid assignments after multiple attempts

## Example Run

```bash
$ node src/index.js data/employees.csv output/assignments.csv data/previous_assignments.csv

Starting Secret Santa...

Loaded 8 employees
Loaded 8 previous year pairs
Generated 8 new pairs
Saved to output/assignments.csv

Results:
  Alice Johnson → Charlie Brown
  Bob Smith → Diana Prince
  Charlie Brown → Frank Miller
  Diana Prince → Alice Johnson
  Eve Wilson → Grace Lee
  Frank Miller → Bob Smith
  Grace Lee → Eve Wilson
  Henry Davis → Bob Smith

Done!
```

## Algorithm

The application uses a **backtracking algorithm** to generate Secret Santa assignments:

1. **Try** to assign each employee to an available receiver
2. **Validate** constraints (not themselves, not last year's assignment)
3. **Backtrack** if no valid options remain
4. **Continue** until all employees are assigned

This approach guarantees finding a valid solution if one exists, and is more efficient than random shuffling.

## Design Principles

- **Separation of Concerns**: Models, I/O, and business logic are separated
- **Functional Programming**: Pure functions with async/await
- **Modularity**: Each module has a single, well-defined responsibility
- **Error Handling**: Clear error messages for invalid inputs or impossible constraints

## Troubleshooting

**File not found error:**
- Ensure file paths are correct and files exist

**Unable to generate valid assignments:**
- Constraints may be impossible to satisfy (e.g., with very small teams where everyone had everyone else last year)

**Module import errors:**
- Ensure you're using Node.js >= 14.0.0
- Verify `package.json` has `"type": "module"`

