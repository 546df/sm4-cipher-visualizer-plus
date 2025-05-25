
/**
 * Random data generator utilities for SM4 testing
 * Provides functions to generate random keys, plaintexts, and test data
 */

/**
 * Generate a random hexadecimal key for SM4 (128 bits = 32 hex chars)
 * @returns Random 32-character hexadecimal string
 */
export const generateRandomKey = (): string => {
  const chars = '0123456789abcdef';
  let result = '';
  
  // Generate 32 random hex characters for 128-bit key
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  console.log('Generated random key:', result);
  return result;
};

/**
 * Generate random plaintext for testing
 * @param length Desired length of plaintext (default: random between 8-32 chars)
 * @returns Random plaintext string
 */
export const generateRandomPlaintext = (length?: number): string => {
  const words = [
    'Hello', 'World', 'SM4', 'Crypto', 'Security', 'Algorithm', 'Encryption',
    'Decryption', 'Block', 'Cipher', 'Key', 'Data', 'Message', 'Secret',
    'Digital', 'Privacy', 'Information', 'Technology', 'Computer', 'Network'
  ];
  
  const targetLength = length || Math.floor(Math.random() * 25) + 8; // 8-32 chars
  let result = '';
  
  while (result.length < targetLength) {
    const word = words[Math.floor(Math.random() * words.length)];
    if (result.length === 0) {
      result = word;
    } else if (result.length + word.length + 1 <= targetLength) {
      result += ' ' + word;
    } else {
      break;
    }
  }
  
  // Pad to exact length if needed
  if (result.length < targetLength) {
    const remaining = targetLength - result.length;
    result += '!'.repeat(remaining);
  }
  
  console.log('Generated random plaintext:', result);
  return result;
};

/**
 * Generate random hexadecimal string of specified length
 * @param length Number of hex characters to generate
 * @returns Random hex string
 */
export const generateRandomHex = (length: number): string => {
  const chars = '0123456789abcdef';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Generate random bytes as number array
 * @param count Number of bytes to generate
 * @returns Array of random bytes (0-255)
 */
export const generateRandomBytes = (count: number): number[] => {
  const bytes: number[] = [];
  
  for (let i = 0; i < count; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  
  return bytes;
};

/**
 * Generate test cases for SM4 algorithm
 * @param count Number of test cases to generate
 * @returns Array of test case objects
 */
export const generateTestCases = (count: number = 5) => {
  const testCases = [];
  
  for (let i = 0; i < count; i++) {
    testCases.push({
      id: i + 1,
      name: `Test Case ${i + 1}`,
      plaintext: generateRandomPlaintext(),
      key: generateRandomKey(),
      iv: generateRandomKey(), // For CBC mode
      description: `Randomly generated test case with ${generateRandomPlaintext().length} character plaintext`
    });
  }
  
  console.log('Generated test cases:', testCases);
  return testCases;
};
