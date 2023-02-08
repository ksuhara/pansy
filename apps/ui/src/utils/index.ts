
export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const getFirstLetterToUpperCase = (s: string) => (
  s.replace(/^[a-z]/, char => char.toUpperCase())
);
