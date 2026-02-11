if (!process.env.CI) {
  const { config } = await import('dotenv');
  config({ path: '.env' });
}

export {};