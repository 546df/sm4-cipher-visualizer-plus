
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Key, Shield, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const TutorialPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <span>SM4 Algorithm Tutorial & Examples</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-100">
            Learn about the SM4 block cipher algorithm with interactive examples and step-by-step explanations.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          <TabsTrigger value="modes">Modes</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>What is SM4?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                SM4 is a symmetric block cipher algorithm that was adopted as the national standard of China (GB/T 32907-2016). 
                It's designed for wireless LAN products and is also used in various other cryptographic applications.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Key Characteristics</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>128-bit block size</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>128-bit key length</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>32-round Feistel structure</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Non-linear S-box transformation</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Applications</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Wireless LAN security (WAPI)</li>
                    <li>• VPN and network encryption</li>
                    <li>• Mobile communication systems</li>
                    <li>• Government and commercial applications</li>
                    <li>• IoT device security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SM4 Algorithm Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">1. Key Expansion</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    The 128-bit master key is expanded into 32 round keys using the SM4 key schedule algorithm:
                  </p>
                  <div className="font-mono text-xs bg-white p-3 rounded border">
                    <div>MK = (MK₀, MK₁, MK₂, MK₃)</div>
                    <div>K₀ = MK₀ ⊕ FK₀, K₁ = MK₁ ⊕ FK₁, K₂ = MK₂ ⊕ FK₂, K₃ = MK₃ ⊕ FK₃</div>
                    <div>For i = 0 to 31: RKᵢ = Kᵢ₊₄ = Kᵢ ⊕ T'(Kᵢ₊₁ ⊕ Kᵢ₊₂ ⊕ Kᵢ₊₃ ⊕ CKᵢ)</div>
                  </div>
                </div>

                <h4 className="font-semibold text-lg">2. Round Function</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    Each round applies the T-transformation, which consists of:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Non-linear Transformation (τ)</h5>
                      <p className="text-xs text-gray-600">S-box substitution applied to each byte</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Linear Transformation (L)</h5>
                      <p className="text-xs text-gray-600">Bit rotation and XOR operations for diffusion</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-lg">3. Round Structure</h4>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="font-mono text-xs bg-white p-3 rounded border">
                    <div>Xᵢ₊₄ = Xᵢ ⊕ T(Xᵢ₊₁ ⊕ Xᵢ₊₂ ⊕ Xᵢ₊₃ ⊕ RKᵢ)</div>
                    <div>where T(A) = L(τ(A))</div>
                    <div>L(B) = B ⊕ (B ≪ 2) ⊕ (B ≪ 10) ⊕ (B ≪ 18) ⊕ (B ≪ 24)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modes" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge className="bg-blue-600">ECB</Badge>
                  <span>Electronic Codebook</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  ECB mode encrypts each block independently using the same key.
                </p>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-green-600">Advantages:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Simple implementation</li>
                    <li>• Parallelizable encryption</li>
                    <li>• No error propagation</li>
                  </ul>

                  <h5 className="font-medium text-red-600">Disadvantages:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Identical blocks produce identical ciphertext</li>
                    <li>• Patterns in plaintext are preserved</li>
                    <li>• Vulnerable to chosen plaintext attacks</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600">
                    <strong>Use case:</strong> Small, random data or when speed is critical and patterns aren't a concern.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge className="bg-purple-600">CBC</Badge>
                  <span>Cipher Block Chaining</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  CBC mode XORs each plaintext block with the previous ciphertext block before encryption.
                </p>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-green-600">Advantages:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Identical blocks produce different ciphertext</li>
                    <li>• Better security than ECB</li>
                    <li>• Hides plaintext patterns</li>
                  </ul>

                  <h5 className="font-medium text-red-600">Disadvantages:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sequential encryption (not parallelizable)</li>
                    <li>• Error propagation between blocks</li>
                    <li>• Requires initialization vector (IV)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-600">
                    <strong>Use case:</strong> General-purpose encryption where security is important and patterns must be hidden.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Padding Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">PKCS7 Padding</h5>
                  <p className="text-sm text-gray-700 mb-3">
                    Adds padding bytes with value equal to the number of padding bytes needed.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    Original: [A, B, C]<br/>
                    Padded: [A, B, C, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">No Padding</h5>
                  <p className="text-sm text-gray-700 mb-3">
                    Data must already be a multiple of the block size (16 bytes for SM4).
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    Input: Must be exactly 16, 32, 48... bytes<br/>
                    No modification to the data
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Example 1: Basic ECB Encryption</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Input</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Plaintext:</strong> "Hello, World!"</div>
                      <div><strong>Key:</strong> 0123456789abcdef0123456789abcdef</div>
                      <div><strong>Mode:</strong> ECB</div>
                      <div><strong>Padding:</strong> PKCS7</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Expected Output</h5>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all">
                      c5d2a7f3e8b9d4c1a6f2e7b8c3d9a4f5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 2: CBC Mode with IV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Input</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Plaintext:</strong> "Secure Message"</div>
                      <div><strong>Key:</strong> fedcba9876543210fedcba9876543210</div>
                      <div><strong>IV:</strong> 1234567890abcdef1234567890abcdef</div>
                      <div><strong>Mode:</strong> CBC</div>
                      <div><strong>Padding:</strong> PKCS7</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Expected Output</h5>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all">
                      b8f4e2d1c9a7f5e3d1c9a7f5e3b8f4e2
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>Test These Examples</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700">
                  Try these examples in the visualizer to see how different modes and settings affect the encryption process. 
                  Use the "Random" button to generate your own test cases and experiment with different configurations.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>SM4 Security Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-green-600 mb-3">Strengths</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>128-bit security:</strong> Provides 2^128 possible keys, making brute force attacks computationally infeasible</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>32 rounds:</strong> Sufficient rounds to ensure strong diffusion and confusion</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>Non-linear S-box:</strong> Provides resistance against linear and differential attacks</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>National standard:</strong> Extensively analyzed and approved by cryptographic experts</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-amber-600 mb-3">Considerations</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>Mode selection:</strong> ECB mode can reveal patterns in data, CBC is recommended for most uses</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>Key management:</strong> Secure key generation and distribution are critical</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>Implementation:</strong> Side-channel attacks possible with poor implementations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>IV uniqueness:</strong> CBC mode requires unique IVs for each encryption</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Best Practices</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Use CBC mode for general-purpose encryption</li>
                  <li>• Generate random, unique IVs for each encryption operation</li>
                  <li>• Use secure random number generators for key generation</li>
                  <li>• Implement proper key rotation and management procedures</li>
                  <li>• Consider authenticated encryption modes for integrity protection</li>
                  <li>• Regularly audit and test cryptographic implementations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialPanel;
