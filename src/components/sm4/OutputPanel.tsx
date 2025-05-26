
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Download, BarChart, Lock, Unlock } from 'lucide-react';
import { SM4Config } from '@/types/sm4';
import { useToast } from '@/hooks/use-toast';

interface OutputPanelProps {
  result: {
    output: string;
    steps: any[];
    executionTime: number;
  } | null;
  config: SM4Config;
  originalText: string;
  operationMode: 'encrypt' | 'decrypt';
}

const OutputPanel: React.FC<OutputPanelProps> = ({ result, config, originalText, operationMode }) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "已复制到剪贴板",
        description: `${field}已复制到剪贴板。`
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板。",
        variant: "destructive"
      });
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const data = {
      时间戳: new Date().toISOString(),
      操作模式: operationMode === 'encrypt' ? '加密' : '解密',
      配置: config,
      输入: {
        [operationMode === 'encrypt' ? '明文' : '密文']: originalText,
        长度: originalText.length
      },
      输出: {
        [operationMode === 'encrypt' ? '密文' : '明文']: result.output,
        长度: result.output.length
      },
      性能: {
        执行时间: result.executionTime,
        步骤数: result.steps.length
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sm4-${operationMode === 'encrypt' ? '加密' : '解密'}结果-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "下载开始",
      description: `${operationMode === 'encrypt' ? '加密' : '解密'}结果已下载为 JSON 文件。`
    });
  };

  if (!result) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">暂无{operationMode === 'encrypt' ? '加密' : '解密'}结果</p>
            <p className="text-sm">开始{operationMode === 'encrypt' ? '加密' : '解密'}过程以查看输出和分析</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const compressionRatio = ((result.output.length / originalText.length) * 100).toFixed(1);
  const throughput = originalText.length / (result.executionTime / 1000);

  return (
    <div className="space-y-6">
      {/* Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {operationMode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              <span>{operationMode === 'encrypt' ? '加密' : '解密'}结果</span>
            </div>
            <div className="flex items-center space-x-2">
              {operationMode === 'encrypt' && <Badge variant="outline">{config.outputFormat.toUpperCase()}</Badge>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.output, operationMode === 'encrypt' ? '密文' : '明文')}
              >
                {copiedField === (operationMode === 'encrypt' ? '密文' : '明文') ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResult}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {operationMode === 'encrypt' ? '加密后的密文' : '解密后的明文'}
            </label>
            <Textarea
              value={result.output}
              readOnly
              className="mt-1 font-mono text-sm bg-gray-50"
              rows={6}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">长度：</span>
              <p className="text-gray-600">{result.output.length} 字符</p>
            </div>
            <div>
              <span className="font-medium">格式：</span>
              <p className="text-gray-600">
                {operationMode === 'encrypt' ? config.outputFormat.toUpperCase() : config.encoding.toUpperCase()}
              </p>
            </div>
            <div>
              <span className="font-medium">模式：</span>
              <p className="text-gray-600">{config.mode} 配合 {config.padding} 填充</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>性能指标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">执行时间：</span>
                <Badge variant="outline">{result.executionTime}毫秒</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">处理步骤：</span>
                <Badge variant="outline">{result.steps.length}</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">吞吐量：</span>
                <Badge variant="outline">{throughput.toFixed(1)} 字节/秒</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">大小比率：</span>
                <Badge variant="outline">{compressionRatio}%</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• 更高的吞吐量表示更好的性能</p>
                <p>• 大小比率显示输出与输入长度对比</p>
                <p>• 步骤数反映算法复杂度</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全性分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">算法：</span>
                <Badge className="bg-green-600">SM4 (128位)</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">密钥强度：</span>
                <Badge className="bg-blue-600">128位 (2^128)</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">分组大小：</span>
                <Badge variant="outline">128位</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">轮数：</span>
                <Badge variant="outline">32</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• SM4 已获中国国家标准认证</p>
                <p>• 128位密钥提供强安全性</p>
                <p>• 32轮确保充分扩散</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input vs Output Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>输入输出对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {operationMode === 'encrypt' ? '原始明文' : '原始密文'}
              </label>
              <Textarea
                value={originalText}
                readOnly
                className="mt-1 font-mono text-sm bg-blue-50"
                rows={4}
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>长度: {originalText.length} 字符</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(originalText, operationMode === 'encrypt' ? '原始明文' : '原始密文')}
                  className="h-auto p-1"
                >
                  {copiedField === (operationMode === 'encrypt' ? '原始明文' : '原始密文') ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                {operationMode === 'encrypt' ? '加密后密文' : '解密后明文'}
              </label>
              <Textarea
                value={result.output}
                readOnly
                className="mt-1 font-mono text-sm bg-purple-50"
                rows={4}
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>长度: {result.output.length} 字符</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.output, operationMode === 'encrypt' ? '加密后密文' : '解密后明文')}
                  className="h-auto p-1"
                >
                  {copiedField === (operationMode === 'encrypt' ? '加密后密文' : '解密后明文') ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutputPanel;
