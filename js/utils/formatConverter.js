
/**
 * Format conversion utilities
 */

function stringToBytes(str, encoding = 'utf8') {
    const bytes = [];
    
    if (encoding === 'utf8') {
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6));
                bytes.push(0x80 | (code & 0x3f));
            } else {
                bytes.push(0xe0 | (code >> 12));
                bytes.push(0x80 | ((code >> 6) & 0x3f));
                bytes.push(0x80 | (code & 0x3f));
            }
        }
    } else if (encoding === 'hex') {
        const cleanHex = str.replace(/[^0-9a-fA-F]/g, '');
        for (let i = 0; i < cleanHex.length; i += 2) {
            bytes.push(parseInt(cleanHex.substr(i, 2), 16));
        }
    } else if (encoding === 'base64') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const clean = str.replace(/[^A-Za-z0-9+/]/g, '');
        
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
    } else {
        // ASCII
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i) & 0xff);
        }
    }
    
    return bytes;
}

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
            result += String.fromCharCode(byte1);
        } else if ((byte1 & 0xe0) === 0xc0) {
            const byte2 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
        } else if ((byte1 & 0xf0) === 0xe0) {
            const byte2 = bytes[i++];
            const byte3 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
        }
    }
    
    return result;
}

function hexToBytes(hex) {
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes.push(parseInt(cleanHex.substr(i, 2), 16));
    }
    return bytes;
}

function bytesToHex(bytes) {
    return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

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

function bytesToWords(bytes) {
    const words = [];
    for (let i = 0; i < bytes.length; i += 4) {
        const word = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
        words.push(word >>> 0);
    }
    return words;
}
