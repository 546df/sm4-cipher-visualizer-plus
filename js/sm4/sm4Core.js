
/**
 * SM4 core algorithm implementation
 * Contains key expansion and block encryption functions
 */

/**
 * Rotate left operation
 * @param {number} value 32-bit value to rotate
 * @param {number} n Number of bits to rotate
 * @returns {number} Rotated value
 */
function rotateLeft(value, n) {
    return ((value << n) | (value >>> (32 - n))) >>> 0;
}

/**
 * S-box transformation
 * @param {number} input 32-bit input
 * @returns {number} Transformed output
 */
function sboxTransform(input) {
    const bytes = [
        (input >>> 24) & 0xff,
        (input >>> 16) & 0xff,
        (input >>> 8) & 0xff,
        input & 0xff
    ];
    
    const transformedBytes = bytes.map(byte => SM4_SBOX[byte]);
    
    return (transformedBytes[0] << 24) | 
           (transformedBytes[1] << 16) | 
           (transformedBytes[2] << 8) | 
           transformedBytes[3];
}

/**
 * Linear transformation L
 * @param {number} input 32-bit input
 * @returns {number} Transformed output
 */
function linearTransform(input) {
    return (input ^ rotateLeft(input, 2) ^ rotateLeft(input, 10) ^ rotateLeft(input, 18) ^ rotateLeft(input, 24)) >>> 0;
}

/**
 * Linear transformation L' for key expansion
 * @param {number} input 32-bit input
 * @returns {number} Transformed output
 */
function linearTransformKey(input) {
    return (input ^ rotateLeft(input, 13) ^ rotateLeft(input, 23)) >>> 0;
}

/**
 * T transformation (S-box + Linear)
 * @param {number} input 32-bit input
 * @returns {number} Transformed output
 */
function tTransform(input) {
    return linearTransform(sboxTransform(input));
}

/**
 * T' transformation for key expansion
 * @param {number} input 32-bit input
 * @returns {number} Transformed output
 */
function tTransformKey(input) {
    return linearTransformKey(sboxTransform(input));
}

/**
 * Generate round keys from master key
 * @param {number[]} keyBytes 16-byte master key
 * @returns {number[]} Array of 32 round keys
 */
function generateRoundKeys(keyBytes) {
    console.log('Generating round keys from master key:', bytesToHex(keyBytes));
    
    // Convert key bytes to words
    const keyWords = bytesToWords(keyBytes);
    console.log('Key words:', keyWords.map(w => w.toString(16).padStart(8, '0')));
    
    // Initialize with FK
    const k = new Array(4);
    for (let i = 0; i < 4; i++) {
        k[i] = (keyWords[i] ^ SM4_FK[i]) >>> 0;
    }
    
    // Generate round keys
    const roundKeys = new Array(32);
    for (let i = 0; i < 32; i++) {
        const temp = (k[(i + 1) % 4] ^ k[(i + 2) % 4] ^ k[(i + 3) % 4] ^ SM4_CK[i]) >>> 0;
        roundKeys[i] = k[i % 4] = (k[i % 4] ^ tTransformKey(temp)) >>> 0;
        console.log(`Round key ${i}: ${roundKeys[i].toString(16).padStart(8, '0')}`);
    }
    
    return roundKeys;
}

/**
 * Encrypt a single 16-byte block
 * @param {number[]} block 16-byte input block
 * @param {number[]} roundKeys Array of 32 round keys
 * @param {number} blockIndex Block index for identification
 * @returns {Object} Block encryption result with round details
 */
function encryptBlock(block, roundKeys, blockIndex) {
    console.log(`Encrypting block ${blockIndex}:`, bytesToHex(block));
    
    // Convert block to words (big-endian)
    const x = bytesToWords(block);
    console.log('Input words:', x.map(w => w.toString(16).padStart(8, '0')));
    
    const rounds = [];
    
    // 32 rounds of transformation
    for (let i = 0; i < 32; i++) {
        const input = [x[0], x[1], x[2], x[3]];
        const temp = (x[1] ^ x[2] ^ x[3] ^ roundKeys[i]) >>> 0;
        const sboxOutput = sboxTransform(temp);
        const tOutput = tTransform(temp);
        
        // Round function: X[i+4] = X[i] XOR T(X[i+1] XOR X[i+2] XOR X[i+3] XOR RK[i])
        const newWord = (x[0] ^ tOutput) >>> 0;
        
        // Shift the state
        x[0] = x[1];
        x[1] = x[2];
        x[2] = x[3];
        x[3] = newWord;
        
        rounds.push({
            roundNumber: i + 1,
            input: [...input],
            roundKey: roundKeys[i],
            sboxOutput: [sboxOutput],
            linearOutput: tOutput,
            output: [x[0], x[1], x[2], x[3]],
            description: `第${i + 1}轮: T变换后得到 ${tOutput.toString(16).padStart(8, '0')}`
        });
        
        console.log(`Round ${i + 1}: ${x.map(w => w.toString(16).padStart(8, '0')).join(' ')}`);
    }
    
    // Reverse transformation (final permutation)
    const outputWords = [x[3], x[2], x[1], x[0]];
    const outputBytes = wordsToBytes(outputWords);
    
    console.log('Output words:', outputWords.map(w => w.toString(16).padStart(8, '0')));
    console.log('Output bytes:', bytesToHex(outputBytes));
    
    return {
        input: block,
        output: outputBytes,
        rounds: rounds
    };
}
