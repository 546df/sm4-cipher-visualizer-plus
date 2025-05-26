
/**
 * SM4 decryption algorithm implementation
 * Implements the complete SM4 block cipher decryption with step-by-step visualization
 */

import { SM4Config, SM4State, SM4RoundState, DecryptionResult, SM4Step } from '@/types/sm4';
import { hexToBytes, base64ToBytes, bytesToHex, bytesToString } from '@/utils/formatConverter';
import { getUnpaddingFunction } from '@/utils/paddingUtils';
import { SM4_SBOX, SM4_FK } from './sm4Constants';
import { generateRoundKeys, encryptBlock } from './sm4Core';

/**
 * Main SM4 decryption function
 * @param ciphertext Input ciphertext string (hex or base64)
 * @param key 128-bit key as hex string
 * @param config SM4 configuration
 * @param iv Initialization vector for CBC mode
 * @returns Complete decryption result with visualization data
 */
export const decryptSM4 = async (
  ciphertext: string,
  key: string,
  config: SM4Config,
  iv?: string
): Promise<DecryptionResult> => {
  console.log('Starting SM4 decryption...');
  console.log('Ciphertext:', ciphertext);
  console.log('Key:', key);
  console.log('Config:', config);
  
  const steps: SM4Step[] = [];
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
  
  console.log('Ciphertext bytes:', ciphertextBytes);

  if (ciphertextBytes.length === 0 || ciphertextBytes.length % 16 !== 0) {
    throw new Error('密文长度必须是16字节的倍数');
  }

  // Step 2: Key expansion (same as encryption)
  steps.push({
    id: stepId++,
    title: '密钥扩展',
    description: '从主密钥生成32个轮密钥（与加密相同）',
    data: { masterKey: key }
  });

  const keyBytes = hexToBytes(key);
  const roundKeys = generateRoundKeys(keyBytes);
  console.log('Round keys generated:', roundKeys.length);

  // Step 3: Block processing
  const blocks: any[] = [];
  const blockCount = ciphertextBytes.length / 16;
  let previousBlock = iv ? hexToBytes(iv) : null;

  steps.push({
    id: stepId++,
    title: '分组解密',
    description: `使用${config.mode}模式解密${blockCount}个分组`,
    data: { blockCount, mode: config.mode }
  });

  let allRounds: SM4RoundState[] = [];
  const decryptedBlocks: number[] = [];

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const blockStart = blockIndex * 16;
    const blockBytes = ciphertextBytes.slice(blockStart, blockStart + 16);
    
    // Decrypt single block (SM4 decryption is the same as encryption with reversed round keys)
    const blockResult = decryptBlock(blockBytes, roundKeys, blockIndex);
    blocks.push(blockResult);
    allRounds.push(...blockResult.rounds);
    
    let outputBlock = blockResult.output;
    
    // Apply CBC mode postprocessing if needed
    if (config.mode === 'CBC') {
      if (previousBlock) {
        outputBlock = outputBlock.map((byte, i) => byte ^ previousBlock![i]);
      }
      previousBlock = blockBytes; // For next block
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
  console.log('Unpadded bytes:', unpaddedBytes);

  // Step 5: Convert to string
  steps.push({
    id: stepId++,
    title: '输出格式化',
    description: `将字节数组转换为${config.encoding}编码的文本`,
    data: { encoding: config.encoding, byteLength: unpaddedBytes.length }
  });

  const plaintext = bytesToString(unpaddedBytes, config.encoding);

  // Create SM4 state for visualization
  const sm4State: SM4State = {
    originalPlaintext: ciphertext,
    processedInput: ciphertextBytes,
    expandedKey: roundKeys,
    rounds: allRounds,
    finalOutput: unpaddedBytes,
    mode: config.mode,
    iv: iv ? hexToBytes(iv) : undefined
  };

  console.log('SM4 decryption completed');
  console.log('Plaintext:', plaintext);

  return {
    plaintext,
    state: sm4State,
    steps,
    blocks
  };
};

/**
 * Decrypt a single 16-byte block
 * SM4 decryption uses the same transformation as encryption but with reversed round keys
 * @param block 16-byte input block
 * @param roundKeys Array of 32 round keys
 * @param blockIndex Block index for identification
 * @returns Block decryption result with round details
 */
const decryptBlock = (block: number[], roundKeys: number[], blockIndex: number) => {
  console.log(`Decrypting block ${blockIndex}:`, bytesToHex(block));
  
  // For SM4 decryption, we use the same encryption function but with reversed round keys
  const reversedKeys = [...roundKeys].reverse();
  
  // Use the existing encryption function with reversed keys
  return encryptBlock(block, reversedKeys, blockIndex);
};

// Export the generateRoundKeys function to be used by encryption
export { generateRoundKeys } from './sm4Core';
