
/**
 * Core SM4 encryption algorithm implementation
 * Implements the complete SM4 block cipher with step-by-step visualization
 */

import { SM4Config, SM4State, SM4RoundState, EncryptionResult, SM4Step } from '@/types/sm4';
import { stringToBytes, hexToBytes, bytesToHex, bytesToBase64, wordsToBytes, bytesToWords } from '@/utils/formatConverter';
import { getPaddingFunction } from '@/utils/paddingUtils';
import { SM4_SBOX, SM4_CK, SM4_FK } from './sm4Constants';

/**
 * Main SM4 encryption function
 * @param plaintext Input plaintext string
 * @param key 128-bit key as hex string
 * @param config SM4 configuration
 * @param iv Initialization vector for CBC mode
 * @returns Complete encryption result with visualization data
 */
export const encryptSM4 = async (
  plaintext: string,
  key: string,
  config: SM4Config,
  iv?: string
): Promise<EncryptionResult> => {
  console.log('Starting SM4 encryption...');
  console.log('Plaintext:', plaintext);
  console.log('Key:', key);
  console.log('Config:', config);
  
  const steps: SM4Step[] = [];
  let stepId = 1;

  // Step 1: Convert input to bytes
  steps.push({
    id: stepId++,
    title: 'Input Processing',
    description: `Converting plaintext "${plaintext}" to bytes using ${config.encoding} encoding`,
    data: { plaintext, encoding: config.encoding }
  });

  const plaintextBytes = stringToBytes(plaintext, config.encoding);
  console.log('Plaintext bytes:', plaintextBytes);

  // Step 2: Apply padding
  steps.push({
    id: stepId++,
    title: 'Padding Application',
    description: `Applying ${config.padding} padding to make data multiple of 16 bytes`,
    data: { originalLength: plaintextBytes.length, padding: config.padding }
  });

  const paddingFunction = getPaddingFunction(config.padding);
  const paddedBytes = paddingFunction(plaintextBytes, 16);
  console.log('Padded bytes:', paddedBytes);

  // Step 3: Key expansion
  steps.push({
    id: stepId++,
    title: 'Key Expansion',
    description: 'Generating 32 round keys from master key using SM4 key schedule',
    data: { masterKey: key }
  });

  const keyBytes = hexToBytes(key);
  const roundKeys = generateRoundKeys(keyBytes);
  console.log('Round keys generated:', roundKeys.length);

  // Step 4: Block processing
  const blocks: any[] = [];
  const blockCount = paddedBytes.length / 16;
  let previousBlock = iv ? hexToBytes(iv) : null;

  steps.push({
    id: stepId++,
    title: 'Block Processing',
    description: `Processing ${blockCount} blocks using ${config.mode} mode`,
    data: { blockCount, mode: config.mode }
  });

  let allRounds: SM4RoundState[] = [];
  const encryptedBlocks: number[] = [];

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const blockStart = blockIndex * 16;
    const blockBytes = paddedBytes.slice(blockStart, blockStart + 16);
    
    // Apply CBC mode preprocessing if needed
    let inputBlock = blockBytes;
    if (config.mode === 'CBC' && previousBlock) {
      inputBlock = blockBytes.map((byte, i) => byte ^ previousBlock![i]);
    }

    // Encrypt single block
    const blockResult = encryptBlock(inputBlock, roundKeys, blockIndex);
    blocks.push(blockResult);
    allRounds.push(...blockResult.rounds);
    
    encryptedBlocks.push(...blockResult.output);
    previousBlock = blockResult.output;
  }

  // Step 5: Format output
  steps.push({
    id: stepId++,
    title: 'Output Formatting',
    description: `Converting encrypted bytes to ${config.outputFormat} format`,
    data: { format: config.outputFormat, byteLength: encryptedBlocks.length }
  });

  const ciphertext = config.outputFormat === 'hex' 
    ? bytesToHex(encryptedBlocks)
    : bytesToBase64(encryptedBlocks);

  // Create SM4 state for visualization
  const sm4State: SM4State = {
    originalPlaintext: plaintext,
    processedInput: paddedBytes,
    expandedKey: roundKeys,
    rounds: allRounds,
    finalOutput: encryptedBlocks,
    mode: config.mode,
    iv: iv ? hexToBytes(iv) : undefined
  };

  console.log('SM4 encryption completed');
  console.log('Ciphertext:', ciphertext);

  return {
    ciphertext,
    state: sm4State,
    steps,
    blocks
  };
};

/**
 * Generate 32 round keys from master key
 * @param key 128-bit master key as byte array
 * @returns Array of 32 round keys
 */
const generateRoundKeys = (key: number[]): number[] => {
  console.log('Generating round keys from master key...');
  
  // Convert key to words
  const keyWords = bytesToWords(key);
  console.log('Key words:', keyWords.map(w => w.toString(16).padStart(8, '0')));

  // Initial transformation using FK constants
  const mixedKey = [
    keyWords[0] ^ SM4_FK[0],
    keyWords[1] ^ SM4_FK[1],
    keyWords[2] ^ SM4_FK[2],
    keyWords[3] ^ SM4_FK[3]
  ];

  console.log('Mixed key after FK:', mixedKey.map(w => w.toString(16).padStart(8, '0')));

  const roundKeys: number[] = [];
  let rk = [...mixedKey];

  // Generate 32 round keys
  for (let i = 0; i < 32; i++) {
    const temp = rk[1] ^ rk[2] ^ rk[3] ^ SM4_CK[i];
    const transformed = keyTransformation(temp);
    const newKey = rk[0] ^ transformed;
    
    roundKeys.push(newKey);
    
    // Shift register
    rk[0] = rk[1];
    rk[1] = rk[2];
    rk[2] = rk[3];
    rk[3] = newKey;
    
    console.log(`Round key ${i}:`, newKey.toString(16).padStart(8, '0'));
  }

  console.log(`Generated ${roundKeys.length} round keys`);
  return roundKeys;
};

/**
 * Key transformation function (similar to T transformation but for key schedule)
 * @param input 32-bit input word
 * @returns Transformed 32-bit word
 */
const keyTransformation = (input: number): number => {
  // Apply S-box to each byte
  const bytes = [
    SM4_SBOX[(input >>> 24) & 0xff],
    SM4_SBOX[(input >>> 16) & 0xff],
    SM4_SBOX[(input >>> 8) & 0xff],
    SM4_SBOX[input & 0xff]
  ];

  // Combine bytes back to word
  const sboxOutput = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];

  // Key schedule specific linear transformation: L'(B) = B ⊕ (B <<< 13) ⊕ (B <<< 23)
  const rotated13 = rotateLeft(sboxOutput, 13);
  const rotated23 = rotateLeft(sboxOutput, 23);
  
  return (sboxOutput ^ rotated13 ^ rotated23) >>> 0;
};

/**
 * Encrypt a single 16-byte block
 * @param block 16-byte input block
 * @param roundKeys Array of 32 round keys
 * @param blockIndex Block index for identification
 * @returns Block encryption result with round details
 */
const encryptBlock = (block: number[], roundKeys: number[], blockIndex: number) => {
  console.log(`Encrypting block ${blockIndex}:`, bytesToHex(block));
  
  // Convert block to 4 32-bit words
  let state = bytesToWords(block);
  const rounds: SM4RoundState[] = [];

  // 32 rounds of SM4
  for (let round = 0; round < 32; round++) {
    const roundInput = [...state];
    const roundKey = roundKeys[round];
    
    // T transformation: T(input) = L(τ(input))
    const temp = state[1] ^ state[2] ^ state[3] ^ roundKey;
    const sboxOutput = applySBox(temp);
    const linearOutput = applyLinearTransformation(sboxOutput);
    
    // Update state
    const newWord = state[0] ^ linearOutput;
    state = [state[1], state[2], state[3], newWord];
    
    rounds.push({
      roundNumber: round,
      input: roundInput,
      roundKey: roundKey,
      sboxOutput: [(sboxOutput >>> 24) & 0xff, (sboxOutput >>> 16) & 0xff, (sboxOutput >>> 8) & 0xff, sboxOutput & 0xff],
      linearOutput: linearOutput,
      output: [...state],
      description: `Round ${round}: Applied T-transformation with round key ${roundKey.toString(16).padStart(8, '0')}`
    });
  }

  // Reverse word order for final output (SM4 specification)
  const finalState = [state[3], state[2], state[1], state[0]];
  const outputBytes = wordsToBytes(finalState);

  console.log(`Block ${blockIndex} encrypted:`, bytesToHex(outputBytes));

  return {
    input: block,
    output: outputBytes,
    rounds
  };
};

/**
 * Apply S-box transformation to 32-bit word
 * @param input 32-bit input word
 * @returns S-box transformed word
 */
const applySBox = (input: number): number => {
  const b0 = SM4_SBOX[(input >>> 24) & 0xff];
  const b1 = SM4_SBOX[(input >>> 16) & 0xff];
  const b2 = SM4_SBOX[(input >>> 8) & 0xff];
  const b3 = SM4_SBOX[input & 0xff];
  
  return ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0;
};

/**
 * Apply linear transformation L
 * L(B) = B ⊕ (B <<< 2) ⊕ (B <<< 10) ⊕ (B <<< 18) ⊕ (B <<< 24)
 * @param input 32-bit input word
 * @returns Linear transformed word
 */
const applyLinearTransformation = (input: number): number => {
  const rot2 = rotateLeft(input, 2);
  const rot10 = rotateLeft(input, 10);
  const rot18 = rotateLeft(input, 18);
  const rot24 = rotateLeft(input, 24);
  
  return (input ^ rot2 ^ rot10 ^ rot18 ^ rot24) >>> 0;
};

/**
 * Rotate 32-bit word left by specified positions
 * @param word 32-bit word
 * @param positions Number of positions to rotate
 * @returns Rotated word
 */
const rotateLeft = (word: number, positions: number): number => {
  return ((word << positions) | (word >>> (32 - positions))) >>> 0;
};
