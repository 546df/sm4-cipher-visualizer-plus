
/**
 * SM4 Core encryption functions - TypeScript wrapper
 */

// Import from the JavaScript implementation
declare const encryptSM4: (plaintext: string, keyHex: string, config: any, ivHex?: string) => Promise<any>;

export { encryptSM4 };
