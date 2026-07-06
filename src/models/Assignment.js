export const createAssignment = (giver, receiver) => {
  if (giver.email === receiver.email) {
    throw new Error(`Employee cannot be assigned to themselves`);
  }
  return { giver, receiver };
};
