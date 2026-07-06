import { createEmployee } from '../src/models/Employee.js';
import { createAssignment } from '../src/models/Assignment.js';
import { assignSecretSanta } from '../src/services/SecretSantaAssigner.js';

console.log('🧪 Running Manual Tests...\n');

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
};

test('Create valid employee', () => {
  const emp = createEmployee('John Doe', 'john@test.com');
  if (emp.name !== 'John Doe') throw new Error('Name mismatch');
  if (emp.email !== 'john@test.com') throw new Error('Email mismatch');
});

test('Trim whitespace and lowercase email', () => {
  const emp = createEmployee('  Jane  ', '  JANE@TEST.COM  ');
  if (emp.name !== 'Jane') throw new Error('Name not trimmed');
  if (emp.email !== 'jane@test.com') throw new Error('Email not lowercased');
});

test('Reject empty name', () => {
  try {
    createEmployee('', 'test@test.com');
    throw new Error('Should have thrown error');
  } catch (e) {
    if (!e.message.includes('required')) throw new Error('Wrong error message');
  }
});

test('Reject invalid email', () => {
  try {
    createEmployee('John', 'invalid-email');
    throw new Error('Should have thrown error');
  } catch (e) {
    if (!e.message.includes('required')) throw new Error('Wrong error message');
  }
});

test('Create valid assignment pair', () => {
  const emp1 = createEmployee('Alice', 'alice@test.com');
  const emp2 = createEmployee('Bob', 'bob@test.com');
  const pair = createAssignment(emp1, emp2);
  if (pair.giver !== emp1) throw new Error('Giver mismatch');
  if (pair.receiver !== emp2) throw new Error('Receiver mismatch');
});

test('Reject self-assignment', () => {
  const emp = createEmployee('Alice', 'alice@test.com');
  try {
    createAssignment(emp, emp);
    throw new Error('Should have thrown error');
  } catch (e) {
    if (!e.message.includes('themselves')) throw new Error('Wrong error message');
  }
});

test('Generate valid Secret Santa pairs', () => {
  const employees = [
    createEmployee('Alice', 'alice@test.com'),
    createEmployee('Bob', 'bob@test.com'),
    createEmployee('Charlie', 'charlie@test.com'),
    createEmployee('Diana', 'diana@test.com')
  ];
  
  const pairs = assignSecretSanta(employees);
  
  if (pairs.length !== employees.length) throw new Error('Wrong number of pairs');
  
  pairs.forEach(pair => {
    if (pair.giver.email === pair.receiver.email) {
      throw new Error('Self-assignment found!');
    }
  });
  
  const givers = new Set(pairs.map(p => p.giver.email));
  const receivers = new Set(pairs.map(p => p.receiver.email));
  
  if (givers.size !== employees.length) throw new Error('Duplicate givers');
  if (receivers.size !== employees.length) throw new Error('Duplicate receivers');
});

test('Avoid previous year assignments', () => {
  const alice = createEmployee('Alice', 'alice@test.com');
  const bob = createEmployee('Bob', 'bob@test.com');
  const charlie = createEmployee('Charlie', 'charlie@test.com');
  
  const employees = [alice, bob, charlie];
  const previousPairs = [{ giver: alice, receiver: bob }];
  
  const pairs = assignSecretSanta(employees, previousPairs);
  
  const alicePair = pairs.find(p => p.giver.email === alice.email);
  if (alicePair.receiver.email === bob.email) {
    throw new Error('Alice got Bob again from previous year!');
  }
});

test('Reject less than 2 employees', () => {
  const employees = [createEmployee('Alice', 'alice@test.com')];
  try {
    assignSecretSanta(employees);
    throw new Error('Should have thrown error');
  } catch (e) {
    if (!e.message.includes('at least 2')) throw new Error('Wrong error message');
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
}
