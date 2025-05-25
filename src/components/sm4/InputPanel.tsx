
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Type, Key, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { SM4Config } from '@/types/sm4';
import { useToast } from '@/hooks/use-toast';

interface InputPanelProps {
  plaintext: string;
  onPlaintextChange: (value: string) => void;
  keyValue: string;
  onKeyChange: (value: string) => void;
  iv: string;
  onIvChange: (value: string) => void;
  config: SM4Config;
}

const InputPanel: React.FC<InputPanelProps> = ({
  plaintext,
  onPlaintextChange,
  keyValue,
  onKeyChange,
  iv,
  onIvChange,
  config
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
        title: "Copied to clipboard",
        description: `${field} has been copied to your clipboard.`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const validateKey = (key: string): { isValid: boolean; message: string } => {
    if (!/^[0-9a-fA-F]*$/.test(key)) {
      return { isValid: false, message: "Key must contain only hexadecimal characters (0-9, a-f)" };
    }
    if (key.length !== 32) {
      return { isValid: false, message: `Key must be exactly 32 characters (current: ${key.length})` };
    }
    return { isValid: true, message: "Valid 128-bit key" };
  };

  const keyValidation = validateKey(keyValue);
  const ivValidation = config.mode === 'CBC' ? validateKey(iv) : { isValid: true, message: "IV not required for ECB mode" };

  const getByteLength = (text: string, encoding: 'utf8' | 'ascii'): number => {
    if (encoding === 'ascii') {
      return text.length;
    }
    // Rough UTF-8 byte count estimation
    return new Blob([text]).size;
  };

  const plaintextByteLength = getByteLength(plaintext, config.encoding);
  const paddedLength = config.padding === 'PKCS7' 
    ? plaintextByteLength + (16 - (plaintextByteLength % 16))
    : plaintextByteLength;

  return (
    <div className="space-y-6">
      {/* Plaintext Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="w-5 h-5" />
              <span>Plaintext Input</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{plaintextByteLength} bytes</Badge>
              {config.padding === 'PKCS7' && (
                <Badge variant="secondary">→ {paddedLength} bytes after padding</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plaintext">Enter text to encrypt</Label>
            <Textarea
              id="plaintext"
              placeholder="Enter your plaintext here..."
              value={plaintext}
              onChange={(e) => onPlaintextChange(e.target.value)}
              className="min-h-[100px] font-mono"
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Encoding: {config.encoding.toUpperCase()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(plaintext, 'Plaintext')}
                className="h-auto p-1"
              >
                {copiedField === 'Plaintext' ? (
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
              <span>Encryption Key</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">128-bit key (32 hex characters)</Label>
              <div className="relative">
                <Input
                  id="key"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter 32 hexadecimal characters..."
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
                    onClick={() => copyToClipboard(keyValue, 'Key')}
                    className="h-auto p-1"
                  >
                    {copiedField === 'Key' ? (
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
              <span>Initialization Vector (IV)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iv">
                128-bit IV for CBC mode {config.mode !== 'CBC' && '(not required)'}
              </Label>
              <div className="relative">
                <Input
                  id="iv"
                  type={showIv ? "text" : "password"}
                  placeholder="Enter 32 hexadecimal characters..."
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
                    onClick={() => copyToClipboard(iv, 'IV')}
                    disabled={config.mode !== 'CBC'}
                    className="h-auto p-1"
                  >
                    {copiedField === 'IV' ? (
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
              <span className="font-medium">Input Length:</span>
              <p className="text-gray-600">{plaintextByteLength} bytes</p>
            </div>
            <div>
              <span className="font-medium">After Padding:</span>
              <p className="text-gray-600">{paddedLength} bytes ({Math.ceil(paddedLength / 16)} blocks)</p>
            </div>
            <div>
              <span className="font-medium">Ready to Encrypt:</span>
              <p className={keyValidation.isValid && (config.mode !== 'CBC' || ivValidation.isValid) ? 'text-green-600' : 'text-red-600'}>
                {keyValidation.isValid && (config.mode !== 'CBC' || ivValidation.isValid) ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputPanel;
