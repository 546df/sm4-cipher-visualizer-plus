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
  
  // Configuration state - 修改默认填充模式为PKCS7
  const [config, setConfig] = useState<SM4Config>({
    mode: 'ECB',
    padding: 'PKCS7',
    outputFormat: 'hex',
    encoding: 'utf8'
  });

  // Input state
  const [plaintext, setPlaintext] = useState('你好，SM4！');
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
      title: "随机数据已生成",
      description: "已生成新的随机密钥和明文用于测试。"
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

  // Start encryption process
  const handleEncrypt = async () => {
    if (!plaintext.trim() || !key.trim()) {
      toast({
        title: "输入无效",
        description: "请提供明文和密钥。",
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
      
      const encryptionResult = await encryptSM4(plaintext, key, config, iv);
      
      const executionTime = Date.now() - startTime;
      
      setSm4State(encryptionResult.state);
      setResult({
        ciphertext: encryptionResult.ciphertext,
        steps: encryptionResult.steps,
        executionTime
      });

      toast({
        title: "加密完成",
        description: `SM4 加密在 ${executionTime}ms 内完成，共 ${encryptionResult.steps.length} 个步骤。`
      });
    } catch (error) {
      console.error('Encryption error:', error);
      toast({
        title: "加密失败",
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
                onClick={handleEncrypt}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isProcessing ? '处理中...' : '加密'}</span>
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
