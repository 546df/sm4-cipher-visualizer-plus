
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, Shuffle, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import ConfigurationPanel from '@/components/sm4/ConfigurationPanel';
import InputPanel from '@/components/sm4/InputPanel';
import VisualizationPanel from '@/components/sm4/VisualizationPanel';
import OutputPanel from '@/components/sm4/OutputPanel';
import TutorialPanel from '@/components/sm4/TutorialPanel';

import { SM4Config, SM4State } from '@/types/sm4';
import { generateRandomKey, generateRandomPlaintext } from '@/utils/randomGenerator';
import { encryptSM4 } from '@/utils/sm4/sm4Core';
import { decryptSM4 } from '@/utils/sm4/sm4Decrypt';

const SM4Visualizer = () => {
  const { toast } = useToast();
  
  // Configuration state - 修改默认填充模式为PKCS7
  const [config, setConfig] = useState<SM4Config>({
    mode: 'ECB',
    padding: 'PKCS7',
    outputFormat: 'hex',
    encoding: 'utf8'
  });

  // Input state
  const [plaintext, setPlaintext] = useState('你好，SM4！');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('0123456789abcdef0123456789abcdef');
  const [iv, setIv] = useState('0123456789abcdef0123456789abcdef');

  // Operation mode state
  const [operationMode, setOperationMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Visualization state
  const [sm4State, setSm4State] = useState<SM4State | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Output state
  const [result, setResult] = useState<{
    output: string;
    steps: any[];
    executionTime: number;
  } | null>(null);

  // Generate random test data
  const handleGenerateRandom = () => {
    setKey(generateRandomKey());
    if (operationMode === 'encrypt') {
      setPlaintext(generateRandomPlaintext());
    }
    if (config.mode === 'CBC') {
      setIv(generateRandomKey());
    }
    toast({
      title: "随机数据已生成",
      description: `已生成新的随机密钥${operationMode === 'encrypt' ? '和明文' : ''}用于测试。`
    });
  };

  // Reset visualization
  const handleReset = () => {
    setSm4State(null);
    setResult(null);
    setCurrentStep(0);
    setIsProcessing(false);
    toast({
      title: "重置完成",
      description: "可视化已重置到初始状态。"
    });
  };

  // Start encryption/decryption process
  const handleProcess = async () => {
    const inputText = operationMode === 'encrypt' ? plaintext : ciphertext;
    
    if (!inputText.trim() || !key.trim()) {
      toast({
        title: "输入无效",
        description: `请提供${operationMode === 'encrypt' ? '明文' : '密文'}和密钥。`,
        variant: "destructive"
      });
      return;
    }

    if (key.length !== 32) {
      toast({
        title: "密钥长度无效",
        description: "SM4 密钥必须恰好是 32 个十六进制字符（128 位）。",
        variant: "destructive"
      });
      return;
    }

    if (config.mode === 'CBC' && iv.length !== 32) {
      toast({
        title: "初始向量长度无效",
        description: "CBC 模式的初始向量必须恰好是 32 个十六进制字符（128 位）。",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);

    try {
      const startTime = Date.now();
      
      let processResult;
      if (operationMode === 'encrypt') {
        processResult = await encryptSM4(plaintext, key, config, iv);
        setCiphertext(processResult.ciphertext);
      } else {
        processResult = await decryptSM4(ciphertext, key, config, iv);
        setPlaintext(processResult.plaintext);
      }
      
      const executionTime = Date.now() - startTime;
      
      setSm4State(processResult.state);
      setResult({
        output: operationMode === 'encrypt' ? processResult.ciphertext : processResult.plaintext,
        steps: processResult.steps,
        executionTime
      });

      toast({
        title: `${operationMode === 'encrypt' ? '加密' : '解密'}完成`,
        description: `SM4 ${operationMode === 'encrypt' ? '加密' : '解密'}在 ${executionTime}ms 内完成，共 ${processResult.steps.length} 个步骤。`
      });
    } catch (error) {
      console.error(`${operationMode === 'encrypt' ? 'Encryption' : 'Decryption'} error:`, error);
      toast({
        title: `${operationMode === 'encrypt' ? '加密' : '解密'}失败`,
        description: error instanceof Error ? error.message : "发生了意外错误。",
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
            <span>SM4 算法可视化工具</span>
            <div className="flex space-x-2">
              <div className="flex bg-white/20 rounded-lg p-1">
                <Button
                  variant={operationMode === 'encrypt' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setOperationMode('encrypt')}
                  className={`flex items-center space-x-1 ${operationMode === 'encrypt' ? '' : 'text-white hover:bg-white/20'}`}
                >
                  <Lock className="w-4 h-4" />
                  <span>加密</span>
                </Button>
                <Button
                  variant={operationMode === 'decrypt' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setOperationMode('decrypt')}
                  className={`flex items-center space-x-1 ${operationMode === 'decrypt' ? '' : 'text-white hover:bg-white/20'}`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>解密</span>
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateRandom}
                className="flex items-center space-x-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>随机生成</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isProcessing ? '处理中...' : (operationMode === 'encrypt' ? '加密' : '解密')}</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configure">配置</TabsTrigger>
          <TabsTrigger value="input">输入</TabsTrigger>
          <TabsTrigger value="visualize">可视化</TabsTrigger>
          <TabsTrigger value="output">输出</TabsTrigger>
          <TabsTrigger value="tutorial">教程</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-4">
          <ConfigurationPanel config={config} onConfigChange={setConfig} />
        </TabsContent>

        <TabsContent value="input" className="space-y-4">
          <InputPanel
            plaintext={plaintext}
            onPlaintextChange={setPlaintext}
            ciphertext={ciphertext}
            onCiphertextChange={setCiphertext}
            keyValue={key}
            onKeyChange={setKey}
            iv={iv}
            onIvChange={setIv}
            config={config}
            operationMode={operationMode}
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
            originalText={operationMode === 'encrypt' ? plaintext : ciphertext}
            operationMode={operationMode}
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
