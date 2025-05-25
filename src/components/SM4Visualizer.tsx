
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import ConfigurationPanel from '@/components/sm4/ConfigurationPanel';
import InputPanel from '@/components/sm4/InputPanel';
import VisualizationPanel from '@/components/sm4/VisualizationPanel';
import OutputPanel from '@/components/sm4/OutputPanel';
import TutorialPanel from '@/components/sm4/TutorialPanel';

import { SM4Config, SM4State } from '@/types/sm4';
import { generateRandomKey, generateRandomPlaintext } from '@/utils/randomGenerator';
import { encryptSM4 } from '@/utils/sm4/sm4Core';

const SM4Visualizer = () => {
  const { toast } = useToast();
  
  // Configuration state
  const [config, setConfig] = useState<SM4Config>({
    mode: 'ECB',
    padding: 'PKCS7',
    outputFormat: 'hex',
    encoding: 'utf8'
  });

  // Input state
  const [plaintext, setPlaintext] = useState('Hello, SM4!');
  const [key, setKey] = useState('0123456789abcdef0123456789abcdef');
  const [iv, setIv] = useState('0123456789abcdef0123456789abcdef');

  // Visualization state
  const [sm4State, setSm4State] = useState<SM4State | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Output state
  const [result, setResult] = useState<{
    ciphertext: string;
    steps: any[];
    executionTime: number;
  } | null>(null);

  // Generate random test data
  const handleGenerateRandom = () => {
    setKey(generateRandomKey());
    setPlaintext(generateRandomPlaintext());
    if (config.mode === 'CBC') {
      setIv(generateRandomKey()); // IV same length as key
    }
    toast({
      title: "Random Data Generated",
      description: "New random key and plaintext have been generated for testing."
    });
  };

  // Reset visualization
  const handleReset = () => {
    setSm4State(null);
    setResult(null);
    setCurrentStep(0);
    setIsProcessing(false);
    toast({
      title: "Reset Complete",
      description: "Visualization has been reset to initial state."
    });
  };

  // Start encryption process
  const handleEncrypt = async () => {
    if (!plaintext.trim() || !key.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please provide both plaintext and key.",
        variant: "destructive"
      });
      return;
    }

    if (key.length !== 32) {
      toast({
        title: "Invalid Key Length",
        description: "SM4 key must be exactly 32 hexadecimal characters (128 bits).",
        variant: "destructive"
      });
      return;
    }

    if (config.mode === 'CBC' && iv.length !== 32) {
      toast({
        title: "Invalid IV Length",
        description: "IV must be exactly 32 hexadecimal characters (128 bits) for CBC mode.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);

    try {
      const startTime = Date.now();
      
      const encryptionResult = await encryptSM4(plaintext, key, config, iv);
      
      const executionTime = Date.now() - startTime;
      
      setSm4State(encryptionResult.state);
      setResult({
        ciphertext: encryptionResult.ciphertext,
        steps: encryptionResult.steps,
        executionTime
      });

      toast({
        title: "Encryption Complete",
        description: `SM4 encryption completed in ${executionTime}ms with ${encryptionResult.steps.length} steps.`
      });
    } catch (error) {
      console.error('Encryption error:', error);
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Control Panel */}
      <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SM4 Algorithm Visualizer</span>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateRandom}
                className="flex items-center space-x-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Random</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEncrypt}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Encrypt'}</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="visualize">Visualize</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-4">
          <ConfigurationPanel config={config} onConfigChange={setConfig} />
        </TabsContent>

        <TabsContent value="input" className="space-y-4">
          <InputPanel
            plaintext={plaintext}
            onPlaintextChange={setPlaintext}
            keyValue={key}
            onKeyChange={setKey}
            iv={iv}
            onIvChange={setIv}
            config={config}
          />
        </TabsContent>

        <TabsContent value="visualize" className="space-y-4">
          <VisualizationPanel
            sm4State={sm4State}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            isProcessing={isProcessing}
          />
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <OutputPanel
            result={result}
            config={config}
            originalText={plaintext}
          />
        </TabsContent>

        <TabsContent value="tutorial" className="space-y-4">
          <TutorialPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SM4Visualizer;
