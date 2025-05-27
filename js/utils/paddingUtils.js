
/**
 * Padding utilities for SM4 block cipher
 * Implements PKCS7 padding and no-padding modes
 */

/**
 * Apply PKCS7 padding to byte array
 * @param {number[]} data Input byte array
 * @param {number} blockSize Block size in bytes (16 for SM4)
 * @returns {number[]} Padded byte array
 */
function applyPKCS7Padding(data, blockSize = 16) {
    const paddingLength = blockSize - (data.length % blockSize);
    const paddedData = [...data];
    
    for (let i = 0; i < paddingLength; i++) {
        paddedData.push(paddingLength);
    }
    
    console.log(`Applied PKCS7 padding: ${paddingLength} bytes added`);
    return paddedData;
}

/**
 * Remove PKCS7 padding from byte array
 * @param {number[]} data Padded byte array
 * @param {number} blockSize Block size in bytes (16 for SM4)
 * @returns {number[]} Unpadded byte array
 */
function removePKCS7Padding(data, blockSize = 16) {
    if (data.length === 0 || data.length % blockSize !== 0) {
        throw new Error('Invalid padded data length');
    }
    
    const paddingLength = data[data.length - 1];
    
    if (paddingLength < 1 || paddingLength > blockSize) {
        throw new Error('Invalid PKCS7 padding');
    }
    
    for (let i = data.length - paddingLength; i < data.length; i++) {
        if (data[i] !== paddingLength) {
            throw new Error('Invalid PKCS7 padding bytes');
        }
    }
    
    const unpaddedData = data.slice(0, data.length - paddingLength);
    console.log(`Removed PKCS7 padding: ${paddingLength} bytes removed`);
    return unpaddedData;
}

/**
 * Apply no padding (data must be multiple of block size)
 * @param {number[]} data Input byte array
 * @param {number} blockSize Block size in bytes (16 for SM4)
 * @returns {number[]} Input data unchanged
 */
function applyNoPadding(data, blockSize = 16) {
    if (data.length % blockSize !== 0) {
        throw new Error(`Data length (${data.length}) must be a multiple of block size (${blockSize}) when using no padding`);
    }
    
    console.log('No padding applied - data length is already multiple of block size');
    return [...data];
}

/**
 * Remove no padding (return data unchanged)
 * @param {number[]} data Input byte array
 * @param {number} blockSize Block size in bytes (16 for SM4)
 * @returns {number[]} Input data unchanged
 */
function removeNoPadding(data, blockSize = 16) {
    if (data.length % blockSize !== 0) {
        throw new Error(`Data length (${data.length}) is not a multiple of block size (${blockSize})`);
    }
    
    console.log('No padding removed - returning data unchanged');
    return [...data];
}

/**
 * Get appropriate padding function based on mode
 * @param {string} paddingMode Padding mode ('PKCS7' or 'None')
 * @returns {Function} Padding function
 */
function getPaddingFunction(paddingMode) {
    switch (paddingMode) {
        case 'PKCS7':
            return applyPKCS7Padding;
        case 'None':
            return applyNoPadding;
        default:
            throw new Error(`Unsupported padding mode: ${paddingMode}`);
    }
}

/**
 * Get appropriate unpadding function based on mode
 * @param {string} paddingMode Padding mode ('PKCS7' or 'None')
 * @returns {Function} Unpadding function
 */
function getUnpaddingFunction(paddingMode) {
    switch (paddingMode) {
        case 'PKCS7':
            return removePKCS7Padding;
        case 'None':
            return removeNoPadding;
        default:
            throw new Error(`Unsupported padding mode: ${paddingMode}`);
    }
}
