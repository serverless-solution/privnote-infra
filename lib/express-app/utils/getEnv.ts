function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `getEnv.ts: Missing required environment variable: ${name}, see README.md`
    );
  }
  return value;
}

export const getEnv = {
  tableName: requireEnv('BASE_TABLE_NAME'),
};
