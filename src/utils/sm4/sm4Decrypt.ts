
/**
 * SM4 Decryption functions - TypeScript wrapper  
 */

// Import from the JavaScript implementation
declare const decryptSM4: (ciphertext: string, keyHex: string, config: any, ivHex?: string) => Promise<any>;

export { decryptSM4 };
