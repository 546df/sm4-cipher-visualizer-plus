
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
            <span>操作设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mode">操作模式</Label>
            <Select value={config.mode} onValueChange={(value) => updateConfig('mode', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECB">ECB (电子密码本)</SelectItem>
                <SelectItem value="CBC">CBC (密码块链接)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.mode === 'ECB' 
                ? '每个块独立加密' 
                : '每个块与前一个密文块进行异或运算'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="padding">填充模式</Label>
            <Select value={config.padding} onValueChange={(value) => updateConfig('padding', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择填充方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PKCS7">PKCS7 填充</SelectItem>
                <SelectItem value="None">无填充</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.padding === 'PKCS7' 
                ? '自动添加填充使数据成为块大小的倍数' 
                : '数据必须已经是 16 字节的倍数'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>格式设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outputFormat">输出格式</Label>
            <Select value={config.outputFormat} onValueChange={(value) => updateConfig('outputFormat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hex">十六进制</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.outputFormat === 'hex' 
                ? '输出为十六进制字符串 (0-9, a-f)' 
                : '输出为 Base64 编码字符串'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encoding">字符编码</Label>
            <Select value={config.encoding} onValueChange={(value) => updateConfig('encoding', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择编码" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf8">UTF-8</SelectItem>
                <SelectItem value="ascii">ASCII</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {config.encoding === 'utf8' 
                ? 'Unicode 文本编码 (支持所有字符)' 
                : '基本 ASCII 编码 (0-127)'}
            </p>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">当前配置</Label>
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
