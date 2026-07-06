export const createEmployee = (name, email) => {
  if (!name?.trim()) throw new Error('Employee name is required');
  if (!email?.trim() || !email.includes('@')) throw new Error('Valid email is required');

  return {
    name: name.trim(),
    email: email.trim().toLowerCase()
  };
};
