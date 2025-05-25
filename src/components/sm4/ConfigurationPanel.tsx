
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Info } from 'lucide-react';
import { SM4Config } from '@/types/sm4';

interface ConfigurationPanelProps {
  config: SM4Config;
  onConfigChange: (config: SM4Config) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, onConfigChange }) => {
  const updateConfig = (key: keyof SM4Config, value: string) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Operation Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Operation Mode</Label>
            <Select value={config.mode} onValueChange={(value) => updateConfig('mode', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECB">ECB (Electronic Codebook)</SelectItem>
                <SelectItem value="CBC">CBC (Cipher Block Chaining)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.mode === 'ECB' 
                ? 'Each block is encrypted independently' 
                : 'Each block is XORed with the previous ciphertext block'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="padding">Padding Mode</Label>
            <Select value={config.padding} onValueChange={(value) => updateConfig('padding', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select padding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PKCS7">PKCS7 Padding</SelectItem>
                <SelectItem value="None">No Padding</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.padding === 'PKCS7' 
                ? 'Automatically adds padding to make data multiple of block size' 
                : 'Data must already be multiple of 16 bytes'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Format Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outputFormat">Output Format</Label>
            <Select value={config.outputFormat} onValueChange={(value) => updateConfig('outputFormat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hex">Hexadecimal</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.outputFormat === 'hex' 
                ? 'Output as hexadecimal string (0-9, a-f)' 
                : 'Output as Base64 encoded string'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encoding">Character Encoding</Label>
            <Select value={config.encoding} onValueChange={(value) => updateConfig('encoding', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf8">UTF-8</SelectItem>
                <SelectItem value="ascii">ASCII</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.encoding === 'utf8' 
                ? 'Unicode text encoding (supports all characters)' 
                : 'Basic ASCII encoding (0-127)'}
            </p>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">Current Configuration</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{config.mode}</Badge>
              <Badge variant="outline">{config.padding}</Badge>
              <Badge variant="outline">{config.outputFormat}</Badge>
              <Badge variant="outline">{config.encoding}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationPanel;
