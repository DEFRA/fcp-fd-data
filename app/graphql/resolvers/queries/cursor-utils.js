export const encodeCursor = (value) => Buffer.from(JSON.stringify(value)).toString('base64')
export const decodeCursor = (cursor) => {
  const decoded = Buffer.from(cursor, 'base64').toString('ascii');
  console.log("Decoded Cursor:", decoded); // Log the decoded value
  return JSON.parse(decoded);
};
