// Global test teardown file

export default async function globalTeardown() {
  // Clean up any global resources
  jest.restoreAllMocks();
  
  // Clear any timers
  jest.clearAllTimers();
  
  // Reset modules if needed
  jest.resetModules();
  
  // Clean up any database connections
  // await mongoose.connection.close();
  
  // Clean up any file system changes
  // await fs.rmdir(testDir, { recursive: true });
  
  console.log('Global teardown completed');
} 