const canAssign = (giver, receiver, previousPairs) => {
  if (giver.email === receiver.email) return false;

  return !previousPairs.some(
    p => p.giver.email === giver.email && p.receiver.email === receiver.email
  );
};

const backtrack = (giverIndex, employees, available, currentPairs, previousPairs) => {
  if (giverIndex === employees.length) {
    return [...currentPairs];
  }

  const giver = employees[giverIndex];

  for (let i = 0; i < available.length; i++) {
    const receiver = available[i];

    if (canAssign(giver, receiver, previousPairs)) {
      currentPairs.push({ giver, receiver });
      available.splice(i, 1);

      const result = backtrack(giverIndex + 1, employees, available, currentPairs, previousPairs);

      if (result) {
        return result;
      }

      available.splice(i, 0, receiver);
      currentPairs.pop();
    }
  }

  return null;
};

export const assignSecretSanta = (employees, previousPairs = []) => {
  if (employees.length < 2) {
    throw new Error('Need at least 2 employees for Secret Santa');
  }

  const available = [...employees];
  const result = backtrack(0, employees, available, [], previousPairs);

  if (!result) {
    throw new Error('Unable to create valid assignments with given constraints');
  }

  return result;
};
