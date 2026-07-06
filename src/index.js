import { readEmployeeList, readPreviousYearList } from './io/CSVParser.js';
import { saveResultToCSV } from './io/CSVWriter.js';
import { assignSecretSanta } from './services/SecretSantaAssigner.js';

const run = async (employeesFile, outputFile, previousFile = null) => {
  try {
    console.log('Starting Secret Santa...\n');

    const employees = await readEmployeeList(employeesFile);
    console.log(`Loaded ${employees.length} employees`);

    const previousPairs = previousFile
      ? await readPreviousYearList(previousFile)
      : [];

    if (previousPairs.length) {
      console.log(`Loaded ${previousPairs.length} previous year pairs`);
    }

    const newPairs = assignSecretSanta(employees, previousPairs);
    console.log(`Generated ${newPairs.length} new pairs`);

    await saveResultToCSV(newPairs, outputFile);
    console.log(`Saved to ${outputFile}\n`);

    console.log('Results:');
    newPairs.forEach(p => console.log(`  ${p.giver.name} → ${p.receiver.name}`));

    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node src/index.js <employees.csv> <output.csv> [previous.csv]');
  process.exit(1);
}

run(args[0], args[1], args[2]);
