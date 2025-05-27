
/**
 * SM4 core algorithm implementation
 * Contains key expansion and block encryption functions with visualization
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
 * Encrypt a single 16-byte block with detailed visualization
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
            roundNumber: i,
            input: [...input],
            roundKey: roundKeys[i],
            sboxOutput: sboxOutput,
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

/**
 * SM4 encryption with full visualization
 * @param {string} plaintext Input plaintext
 * @param {string} keyHex 128-bit key as hex string
 * @param {Object} config Configuration object
 * @param {string} ivHex Optional IV for CBC mode
 * @returns {Object} Complete encryption result with visualization data
 */
async function encryptSM4(plaintext, keyHex, config, ivHex) {
    console.log('Starting SM4 encryption...');
    
    const steps = [];
    let stepId = 1;

    // Step 1: Convert plaintext to bytes
    steps.push({
        id: stepId++,
        title: '输入处理',
        description: `将${config.encoding}编码的明文转换为字节数组`,
        data: { plaintext, encoding: config.encoding }
    });

    const plaintextBytes = stringToBytes(plaintext, config.encoding);
    console.log('Plaintext bytes:', plaintextBytes);

    // Step 2: Apply padding
    steps.push({
        id: stepId++,
        title: '填充处理',
        description: `应用${config.padding}填充到16字节边界`,
        data: { originalLength: plaintextBytes.length, padding: config.padding }
    });

    const paddingFunction = getPaddingFunction(config.padding);
    const paddedBytes = paddingFunction(plaintextBytes, 16);
    console.log('Padded bytes:', paddedBytes);

    // Step 3: Key expansion
    steps.push({
        id: stepId++,
        title: '密钥扩展',
        description: '从主密钥生成32个轮密钥',
        data: { masterKey: keyHex }
    });

    const keyBytes = hexToBytes(keyHex);
    const roundKeys = generateRoundKeys(keyBytes);

    // Step 4: Block processing
    const blockCount = paddedBytes.length / 16;
    steps.push({
        id: stepId++,
        title: '分组加密',
        description: `使用${config.mode}模式加密${blockCount}个分组`,
        data: { blockCount, mode: config.mode }
    });

    const blocks = [];
    let allRounds = [];
    const encryptedBlocks = [];
    let previousBlock = ivHex ? hexToBytes(ivHex) : null;

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
        const blockStart = blockIndex * 16;
        let blockBytes = paddedBytes.slice(blockStart, blockStart + 16);
        
        // Apply CBC mode preprocessing if needed
        if (config.mode === 'CBC' && previousBlock) {
            blockBytes = blockBytes.map((byte, i) => byte ^ previousBlock[i]);
        }
        
        // Encrypt single block
        const blockResult = encryptBlock(blockBytes, roundKeys, blockIndex);
        blocks.push(blockResult);
        allRounds.push(...blockResult.rounds);
        encryptedBlocks.push(...blockResult.output);
        
        if (config.mode === 'CBC') {
            previousBlock = blockResult.output;
        }
    }

    // Step 5: Format output
    steps.push({
        id: stepId++,
        title: '输出格式化',
        description: `将加密结果转换为${config.outputFormat}格式`,
        data: { outputFormat: config.outputFormat, byteLength: encryptedBlocks.length }
    });

    const ciphertext = config.outputFormat === 'hex' 
        ? bytesToHex(encryptedBlocks)
        : bytesToBase64(encryptedBlocks);

    console.log('SM4 encryption completed');
    console.log('Ciphertext:', ciphertext);

    return {
        ciphertext,
        state: {
            originalPlaintext: plaintext,
            processedInput: paddedBytes,
            expandedKey: roundKeys,
            rounds: allRounds,
            finalOutput: encryptedBlocks,
            mode: config.mode,
            iv: ivHex ? hexToBytes(ivHex) : undefined
        },
        steps,
        blocks
    };
}

/**
 * SM4 decryption with full visualization
 * @param {string} ciphertext Input ciphertext
 * @param {string} keyHex 128-bit key as hex string
 * @param {Object} config Configuration object
 * @param {string} ivHex Optional IV for CBC mode
 * @returns {Object} Complete decryption result with visualization data
 */
async function decryptSM4(ciphertext, keyHex, config, ivHex) {
    console.log('Starting SM4 decryption...');
    
    const steps = [];
    let stepId = 1;

    // Step 1: Convert ciphertext to bytes
    steps.push({
        id: stepId++,
        title: '密文处理',
        description: `将${config.outputFormat}格式的密文转换为字节数组`,
        data: { ciphertext, format: config.outputFormat }
    });

    const ciphertextBytes = config.outputFormat === 'hex' 
        ? hexToBytes(ciphertext)
        : base64ToBytes(ciphertext);

    // Step 2: Key expansion (same as encryption)
    steps.push({
        id: stepId++,
        title: '密钥扩展',
        description: '从主密钥生成32个轮密钥（与加密相同）',
        data: { masterKey: keyHex }
    });

    const keyBytes = hexToBytes(keyHex);
    const roundKeys = generateRoundKeys(keyBytes);
    const reversedKeys = [...roundKeys].reverse(); // For decryption

    // Step 3: Block processing
    const blockCount = ciphertextBytes.length / 16;
    steps.push({
        id: stepId++,
        title: '分组解密',
        description: `使用${config.mode}模式解密${blockCount}个分组`,
        data: { blockCount, mode: config.mode }
    });

    const blocks = [];
    let allRounds = [];
    const decryptedBlocks = [];
    let previousBlock = ivHex ? hexToBytes(ivHex) : null;

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
        const blockStart = blockIndex * 16;
        const blockBytes = ciphertextBytes.slice(blockStart, blockStart + 16);
        
        // Decrypt single block using reversed round keys
        const blockResult = encryptBlock(blockBytes, reversedKeys, blockIndex);
        blocks.push(blockResult);
        allRounds.push(...blockResult.rounds);
        
        let outputBlock = blockResult.output;
        
        // Apply CBC mode postprocessing if needed
        if (config.mode === 'CBC') {
            if (previousBlock) {
                outputBlock = outputBlock.map((byte, i) => byte ^ previousBlock[i]);
            }
            previousBlock = blockBytes;
        }
        
        decryptedBlocks.push(...outputBlock);
    }

    // Step 4: Remove padding
    steps.push({
        id: stepId++,
        title: '去除填充',
        description: `移除${config.padding}填充`,
        data: { padding: config.padding, encryptedLength: decryptedBlocks.length }
    });

    const unpaddingFunction = getUnpaddingFunction(config.padding);
    const unpaddedBytes = unpaddingFunction(decryptedBlocks, 16);

    // Step 5: Convert to string
    steps.push({
        id: stepId++,
        title: '输出格式化',
        description: `将字节数组转换为${config.encoding}编码的文本`,
        data: { encoding: config.encoding, byteLength: unpaddedBytes.length }
    });

    const plaintext = bytesToString(unpaddedBytes, config.encoding);

    console.log('SM4 decryption completed');
    console.log('Plaintext:', plaintext);

    return {
        plaintext,
        state: {
            originalPlaintext: ciphertext,
            processedInput: ciphertextBytes,
            expandedKey: roundKeys,
            rounds: allRounds,
            finalOutput: unpaddedBytes,
            mode: config.mode,
            iv: ivHex ? hexToBytes(ivHex) : undefined
        },
        steps,
        blocks
    };
}
