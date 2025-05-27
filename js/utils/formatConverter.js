
/**
 * Format conversion utilities for SM4 cryptography
 * Handles conversion between different data formats (hex, base64, bytes, strings)
 */

/**
 * Convert string to byte array using specified encoding
 * @param {string} str Input string
 * @param {string} encoding Character encoding (utf8 or ascii)
 * @returns {number[]} Array of bytes
 */
function stringToBytes(str, encoding = 'utf8') {
    const bytes = [];
    
    if (encoding === 'utf8') {
        // UTF-8 encoding
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6));
                bytes.push(0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes.push(0xe0 | (code >> 12));
                bytes.push(0x80 | ((code >> 6) & 0x3f));
                bytes.push(0x80 | (code & 0x3f));
            } else {
                // Surrogate pair
                i++;
                const hi = code;
                const lo = str.charCodeAt(i);
                const codePoint = 0x10000 + (((hi & 0x3ff) << 10) | (lo & 0x3ff));
                bytes.push(0xf0 | (codePoint >> 18));
                bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
                bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
                bytes.push(0x80 | (codePoint & 0x3f));
            }
        }
    } else {
        // ASCII encoding
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i) & 0xff);
        }
    }
    
    console.log(`String "${str}" converted to bytes:`, bytes);
    return bytes;
}

/**
 * Convert byte array to string using specified encoding
 * @param {number[]} bytes Array of bytes
 * @param {string} encoding Character encoding (utf8 or ascii)
 * @returns {string} Decoded string
 */
function bytesToString(bytes, encoding = 'utf8') {
    if (encoding === 'ascii') {
        return String.fromCharCode(...bytes);
    }
    
    // UTF-8 decoding
    let result = '';
    let i = 0;
    
    while (i < bytes.length) {
        const byte1 = bytes[i++];
        
        if (byte1 < 0x80) {
            // 1-byte character
            result += String.fromCharCode(byte1);
        } else if ((byte1 & 0xe0) === 0xc0) {
            // 2-byte character
            const byte2 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
        } else if ((byte1 & 0xf0) === 0xe0) {
            // 3-byte character
            const byte2 = bytes[i++];
            const byte3 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
        } else if ((byte1 & 0xf8) === 0xf0) {
            // 4-byte character (surrogate pair)
            const byte2 = bytes[i++];
            const byte3 = bytes[i++];
            const byte4 = bytes[i++];
            const codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
            const surrogate1 = 0xd800 + ((codePoint - 0x10000) >> 10);
            const surrogate2 = 0xdc00 + ((codePoint - 0x10000) & 0x3ff);
            result += String.fromCharCode(surrogate1, surrogate2);
        }
    }
    
    return result;
}

/**
 * Convert hexadecimal string to byte array
 * @param {string} hex Hexadecimal string
 * @returns {number[]} Array of bytes
 */
function hexToBytes(hex) {
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    
    if (cleanHex.length % 2 !== 0) {
        throw new Error('Invalid hex string: odd number of characters');
    }
    
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes.push(parseInt(cleanHex.substr(i, 2), 16));
    }
    
    return bytes;
}

/**
 * Convert byte array to hexadecimal string
 * @param {number[]} bytes Array of bytes
 * @param {boolean} uppercase Whether to use uppercase letters
 * @returns {string} Hexadecimal string
 */
function bytesToHex(bytes, uppercase = false) {
    const hex = bytes.map(byte => {
        const h = byte.toString(16).padStart(2, '0');
        return uppercase ? h.toUpperCase() : h;
    }).join('');
    
    return hex;
}

/**
 * Convert byte array to Base64 string
 * @param {number[]} bytes Array of bytes
 * @returns {string} Base64 encoded string
 */
function bytesToBase64(bytes) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    
    for (let i = 0; i < bytes.length; i += 3) {
        const a = bytes[i];
        const b = bytes[i + 1] || 0;
        const c = bytes[i + 2] || 0;
        
        const combined = (a << 16) | (b << 8) | c;
        
        result += chars[(combined >> 18) & 63];
        result += chars[(combined >> 12) & 63];
        result += i + 1 < bytes.length ? chars[(combined >> 6) & 63] : '=';
        result += i + 2 < bytes.length ? chars[combined & 63] : '=';
    }
    
    return result;
}

/**
 * Convert Base64 string to byte array
 * @param {string} base64 Base64 encoded string
 * @returns {number[]} Array of bytes
 */
function base64ToBytes(base64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = [];
    
    const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
    
    for (let i = 0; i < clean.length; i += 4) {
        const a = chars.indexOf(clean[i]);
        const b = chars.indexOf(clean[i + 1]);
        const c = chars.indexOf(clean[i + 2]);
        const d = chars.indexOf(clean[i + 3]);
        
        const combined = (a << 18) | (b << 12) | (c << 6) | d;
        
        bytes.push((combined >> 16) & 255);
        if (c !== -1) bytes.push((combined >> 8) & 255);
        if (d !== -1) bytes.push(combined & 255);
    }
    
    return bytes;
}

/**
 * Convert 32-bit words to byte array (big-endian)
 * @param {number[]} words Array of 32-bit integers
 * @returns {number[]} Array of bytes
 */
function wordsToBytes(words) {
    const bytes = [];
    
    for (const word of words) {
        bytes.push((word >>> 24) & 0xff);
        bytes.push((word >>> 16) & 0xff);
        bytes.push((word >>> 8) & 0xff);
        bytes.push(word & 0xff);
    }
    
    return bytes;
}

/**
 * Convert byte array to 32-bit words (big-endian)
 * @param {number[]} bytes Array of bytes
 * @returns {number[]} Array of 32-bit integers
 */
function bytesToWords(bytes) {
    const words = [];
    
    for (let i = 0; i < bytes.length; i += 4) {
        const word = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
        words.push(word >>> 0); // Ensure unsigned 32-bit
    }
    
    return words;
}
