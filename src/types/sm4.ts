
/**
 * SM4 algorithm type definitions
 * Defines interfaces and types for SM4 encryption/decryption operations
 */

// SM4 configuration options
export interface SM4Config {
  mode: 'ECB' | 'CBC';           // Operation mode
  padding: 'None' | 'PKCS7';     // Padding scheme
  outputFormat: 'hex' | 'base64'; // Output format
  encoding: 'utf8' | 'ascii';     // Input encoding
}

// SM4 round state for visualization
export interface SM4RoundState {
  roundNumber: number;
  input: number[];               // 4 32-bit words input
  roundKey: number;              // Round key for this round
  sboxOutput: number[];          // S-box transformation output
  linearOutput: number;          // Linear transformation output
  output: number[];              // Round output
  description: string;           // Human-readable description
}

// Complete SM4 state for step-by-step visualization
export interface SM4State {
  originalPlaintext: string;
  processedInput: number[];      // Input after padding and formatting
  expandedKey: number[];         // All 32 round keys
  rounds: SM4RoundState[];       // State for each round
  finalOutput: number[];         // Final encrypted output
  mode: 'ECB' | 'CBC';
  iv?: number[];                 // Initialization vector for CBC
}

// SM4 step information for tutorial purposes
export interface SM4Step {
  id: number;
  title: string;
  description: string;
  data?: any;                    // Optional data for the step
  highlight?: string[];          // Elements to highlight
}

// Block processing result
export interface BlockResult {
  input: number[];
  output: number[];
  rounds: SM4RoundState[];
}

// Complete encryption result
export interface EncryptionResult {
  ciphertext: string;
  state: SM4State;
  steps: SM4Step[];
  blocks: BlockResult[];
}
