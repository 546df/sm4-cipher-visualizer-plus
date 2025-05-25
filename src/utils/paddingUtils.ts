
/**
 * Padding utilities for SM4 block cipher
 * Implements PKCS7 padding and no-padding modes
 */

/**
 * Apply PKCS7 padding to byte array
 * PKCS7 padding adds n bytes of value n to make the data a multiple of block size
 * 
 * @param data Input byte array
 * @param blockSize Block size in bytes (16 for SM4)
 * @returns Padded byte array
 */
export const applyPKCS7Padding = (data: number[], blockSize: number = 16): number[] => {
  const paddingLength = blockSize - (data.length % blockSize);
  const paddedData = [...data];
  
  // Add padding bytes with value equal to padding length
  for (let i = 0; i < paddingLength; i++) {
    paddedData.push(paddingLength);
  }
  
  console.log(`Applied PKCS7 padding: ${paddingLength} bytes added`);
  console.log('Original length:', data.length, 'Padded length:', paddedData.length);
  
  return paddedData;
};

/**
 * Remove PKCS7 padding from byte array
 * 
 * @param data Padded byte array
 * @param blockSize Block size in bytes (16 for SM4)
 * @returns Unpadded byte array
 */
export const removePKCS7Padding = (data: number[], blockSize: number = 16): number[] => {
  if (data.length === 0 || data.length % blockSize !== 0) {
    throw new Error('Invalid padded data length');
  }
  
  const paddingLength = data[data.length - 1];
  
  // Validate padding
  if (paddingLength < 1 || paddingLength > blockSize) {
    throw new Error('Invalid PKCS7 padding');
  }
  
  // Check if all padding bytes have the correct value
  for (let i = data.length - paddingLength; i < data.length; i++) {
    if (data[i] !== paddingLength) {
      throw new Error('Invalid PKCS7 padding bytes');
    }
  }
  
  const unpaddedData = data.slice(0, data.length - paddingLength);
  
  console.log(`Removed PKCS7 padding: ${paddingLength} bytes removed`);
  console.log('Padded length:', data.length, 'Unpadded length:', unpaddedData.length);
  
  return unpaddedData;
};

/**
 * Apply no padding (data must be multiple of block size)
 * 
 * @param data Input byte array
 * @param blockSize Block size in bytes (16 for SM4)
 * @returns Input data unchanged
 */
export const applyNoPadding = (data: number[], blockSize: number = 16): number[] => {
  if (data.length % blockSize !== 0) {
    throw new Error(`Data length (${data.length}) must be a multiple of block size (${blockSize}) when using no padding`);
  }
  
  console.log('No padding applied - data length is already multiple of block size');
  return [...data];
};

/**
 * Remove no padding (return data unchanged)
 * 
 * @param data Input byte array
 * @param blockSize Block size in bytes (16 for SM4)
 * @returns Input data unchanged
 */
export const removeNoPadding = (data: number[], blockSize: number = 16): number[] => {
  if (data.length % blockSize !== 0) {
    throw new Error(`Data length (${data.length}) is not a multiple of block size (${blockSize})`);
  }
  
  console.log('No padding removed - returning data unchanged');
  return [...data];
};

/**
 * Get appropriate padding function based on mode
 * 
 * @param paddingMode Padding mode ('PKCS7' or 'None')
 * @returns Padding function
 */
export const getPaddingFunction = (paddingMode: 'PKCS7' | 'None') => {
  switch (paddingMode) {
    case 'PKCS7':
      return applyPKCS7Padding;
    case 'None':
      return applyNoPadding;
    default:
      throw new Error(`Unsupported padding mode: ${paddingMode}`);
  }
};

/**
 * Get appropriate unpadding function based on mode
 * 
 * @param paddingMode Padding mode ('PKCS7' or 'None')
 * @returns Unpadding function
 */
export const getUnpaddingFunction = (paddingMode: 'PKCS7' | 'None') => {
  switch (paddingMode) {
    case 'PKCS7':
      return removePKCS7Padding;
    case 'None':
      return removeNoPadding;
    default:
      throw new Error(`Unsupported padding mode: ${paddingMode}`);
  }
};

/**
 * Calculate the padded length for given data and padding mode
 * 
 * @param dataLength Original data length
 * @param paddingMode Padding mode
 * @param blockSize Block size in bytes
 * @returns Padded length
 */
export const calculatePaddedLength = (
  dataLength: number, 
  paddingMode: 'PKCS7' | 'None', 
  blockSize: number = 16
): number => {
  switch (paddingMode) {
    case 'PKCS7':
      return dataLength + (blockSize - (dataLength % blockSize));
    case 'None':
      if (dataLength % blockSize !== 0) {
        throw new Error(`Data length (${dataLength}) must be a multiple of block size (${blockSize}) for no padding`);
      }
      return dataLength;
    default:
      throw new Error(`Unsupported padding mode: ${paddingMode}`);
  }
};
