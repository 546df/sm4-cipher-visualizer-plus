
/**
 * Padding utilities for SM4 block cipher
 */

function getPaddingFunction(paddingMode) {
    switch (paddingMode) {
        case 'PKCS7':
            return applyPKCS7Padding;
        case 'NoPadding':
            return applyNoPadding;
        default:
            throw new Error(`Unsupported padding mode: ${paddingMode}`);
    }
}

function getUnpaddingFunction(paddingMode) {
    switch (paddingMode) {
        case 'PKCS7':
            return removePKCS7Padding;
        case 'NoPadding':
            return removeNoPadding;
        default:
            throw new Error(`Unsupported padding mode: ${paddingMode}`);
    }
}

function applyPKCS7Padding(data, blockSize = 16) {
    const paddingLength = blockSize - (data.length % blockSize);
    const paddedData = [...data];
    
    for (let i = 0; i < paddingLength; i++) {
        paddedData.push(paddingLength);
    }
    
    console.log(`Applied PKCS7 padding: ${paddingLength} bytes added`);
    return paddedData;
}

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

function applyNoPadding(data, blockSize = 16) {
    if (data.length % blockSize !== 0) {
        throw new Error(`Data length (${data.length}) must be a multiple of block size (${blockSize}) when using no padding`);
    }
    return [...data];
}

function removeNoPadding(data, blockSize = 16) {
    if (data.length % blockSize !== 0) {
        throw new Error(`Data length (${data.length}) is not a multiple of block size (${blockSize})`);
    }
    return [...data];
}
