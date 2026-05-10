export const capitalize = (text: string): string => {
  return text[0].toUpperCase() + text.slice(1);
};

export const truncate = (str: string, num: number): string =>
  str.length <= num ? str : str.slice(0, num) + "…";
