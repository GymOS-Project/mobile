export const getMBFromBytes = (fileBytes: any) => {
  const Bytes = 1048576; //1 MB
  return parseFloat(String(fileBytes / Bytes)).toFixed(2);
};
