
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Type, Key, Eye, EyeOff, Copy, Check, Lock, Unlock } from 'lucide-react';
import { SM4Config } from '@/types/sm4';
import { useToast } from '@/hooks/use-toast';

interface InputPanelProps {
  plaintext: string;
  onPlaintextChange: (value: string) => void;
  ciphertext: string;
  onCiphertextChange: (value: string) => void;
  keyValue: string;
  onKeyChange: (value: string) => void;
  iv: string;
  onIvChange: (value: string) => void;
  config: SM4Config;
  operationMode: 'encrypt' | 'decrypt';
}

const InputPanel: React.FC<InputPanelProps> = ({
  plaintext,
  onPlaintextChange,
  ciphertext,
  onCiphertextChange,
  keyValue,
  onKeyChange,
  iv,
  onIvChange,
  config,
  operationMode
}) => {
  const { toast } = useToast();
  const [showKey, setShowKey] = React.useState(false);
  const [showIv, setShowIv] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "已复制到剪贴板",
        description: `${field}已复制到您的剪贴板。`
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板。",
        variant: "destructive"
      });
    }
  };

  const validateKey = (key: string): { isValid: boolean; message: string } => {
    if (!/^[0-9a-fA-F]*$/.test(key)) {
      return { isValid: false, message: "密钥只能包含十六进制字符（0-9，a-f）" };
    }
    if (key.length !== 32) {
      return { isValid: false, message: `密钥必须恰好是32个字符（当前：${key.length}）` };
    }
    return { isValid: true, message: "有效的128位密钥" };
  };

  const keyValidation = validateKey(keyValue);
  const ivValidation = config.mode === 'CBC' ? validateKey(iv) : { isValid: true, message: "ECB模式不需要初始向量" };

  const getByteLength = (text: string, encoding: 'utf8' | 'ascii'): number => {
    if (encoding === 'ascii') {
      return text.length;
    }
    return new Blob([text]).size;
  };

  const currentText = operationMode === 'encrypt' ? plaintext : ciphertext;
  const textByteLength = operationMode === 'encrypt' ? getByteLength(plaintext, config.encoding) : ciphertext.length / 2;
  const paddedLength = operationMode === 'encrypt' && config.padding === 'PKCS7' 
    ? textByteLength + (16 - (textByteLength % 16))
    : textByteLength;

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {operationMode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              <span>{operationMode === 'encrypt' ? '明文输入' : '密文输入'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {operationMode === 'encrypt' ? `${textByteLength} 字节` : `${Math.floor(textByteLength)} 字节`}
              </Badge>
              {operationMode === 'encrypt' && config.padding === 'PKCS7' && (
                <Badge variant="secondary">→ 填充后 {paddedLength} 字节</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">
              {operationMode === 'encrypt' ? '输入要加密的文本' : '输入要解密的密文'}
            </Label>
            <Textarea
              id="text"
              placeholder={operationMode === 'encrypt' ? '在此输入您的明文...' : '在此输入十六进制或Base64格式的密文...'}
              value={currentText}
              onChange={(e) => operationMode === 'encrypt' ? onPlaintextChange(e.target.value) : onCiphertextChange(e.target.value)}
              className="min-h-[100px] font-mono"
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                {operationMode === 'encrypt' 
                  ? `编码方式：${config.encoding.toUpperCase()}`
                  : `格式：${config.outputFormat.toUpperCase()}`
                }
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(currentText, operationMode === 'encrypt' ? '明文' : '密文')}
                className="h-auto p-1"
              >
                {copiedField === (operationMode === 'encrypt' ? '明文' : '密文') ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key and IV Input */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>加密密钥</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">128位密钥（32个十六进制字符）</Label>
              <div className="relative">
                <Input
                  id="key"
                  type={showKey ? "text" : "password"}
                  placeholder="输入32个十六进制字符..."
                  value={keyValue}
                  onChange={(e) => onKeyChange(e.target.value.toLowerCase())}
                  className={`font-mono pr-20 ${!keyValidation.isValid ? 'border-red-500' : 'border-green-500'}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKey(!showKey)}
                    className="h-auto p-1"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(keyValue, '密钥')}
                    className="h-auto p-1"
                  >
                    {copiedField === '密钥' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className={`text-sm ${keyValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {keyValidation.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* IV Input (CBC mode only) */}
        <Card className={config.mode !== 'CBC' ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>初始向量（IV）</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iv">
                CBC模式的128位初始向量 {config.mode !== 'CBC' && '（不需要）'}
              </Label>
              <div className="relative">
                <Input
                  id="iv"
                  type={showIv ? "text" : "password"}
                  placeholder="输入32个十六进制字符..."
                  value={iv}
                  onChange={(e) => onIvChange(e.target.value.toLowerCase())}
                  disabled={config.mode !== 'CBC'}
                  className={`font-mono pr-20 ${config.mode === 'CBC' && !ivValidation.isValid ? 'border-red-500' : 'border-green-500'}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowIv(!showIv)}
                    disabled={config.mode !== 'CBC'}
                    className="h-auto p-1"
                  >
                    {showIv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(iv, '初始向量')}
                    disabled={config.mode !== 'CBC'}
                    className="h-auto p-1"
                  >
                    {copiedField === '初始向量' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className={`text-sm ${ivValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {ivValidation.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Summary */}
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">输入长度：</span>
              <p className="text-gray-600">
                {operationMode === 'encrypt' ? `${textByteLength} 字节` : `${Math.floor(textByteLength)} 字节`}
              </p>
            </div>
            <div>
              <span className="font-medium">
                {operationMode === 'encrypt' ? '填充后长度：' : '预期长度：'}
              </span>
              <p className="text-gray-600">
                {operationMode === 'encrypt' 
                  ? `${paddedLength} 字节（${Math.ceil(paddedLength / 16)} 个分组）`
                  : `${Math.floor(textByteLength)} 字节（${Math.ceil(textByteLength / 16)} 个分组）`
                }
              </p>
            </div>
            <div>
              <span className="font-medium">准备{operationMode === 'encrypt' ? '加密' : '解密'}：</span>
              <p className={keyValidation.isValid && (config.mode !== 'CBC' || ivValidation.isValid) ? 'text-green-600' : 'text-red-600'}>
                {keyValidation.isValid && (config.mode !== 'CBC' || ivValidation.isValid) ? '是' : '否'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputPanel;
