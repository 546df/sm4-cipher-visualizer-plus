
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Download, BarChart } from 'lucide-react';
import { SM4Config } from '@/types/sm4';
import { useToast } from '@/hooks/use-toast';

interface OutputPanelProps {
  result: {
    ciphertext: string;
    steps: any[];
    executionTime: number;
  } | null;
  config: SM4Config;
  originalText: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ result, config, originalText }) => {
  const { toast } = useToast();
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

  const downloadResult = () => {
    if (!result) return;

    const data = {
      timestamp: new Date().toISOString(),
      configuration: config,
      input: {
        plaintext: originalText,
        length: originalText.length
      },
      output: {
        ciphertext: result.ciphertext,
        length: result.ciphertext.length
      },
      performance: {
        executionTime: result.executionTime,
        stepsCount: result.steps.length
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sm4-encryption-result-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Encryption result has been downloaded as JSON file."
    });
  };

  if (!result) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No encryption result yet</p>
            <p className="text-sm">Start the encryption process to see the output and analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const compressionRatio = ((result.ciphertext.length / originalText.length) * 100).toFixed(1);
  const throughput = originalText.length / (result.executionTime / 1000); // bytes per second

  return (
    <div className="space-y-6">
      {/* Encryption Result */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Encryption Result</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{config.outputFormat.toUpperCase()}</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result.ciphertext, 'Ciphertext')}
              >
                {copiedField === 'Ciphertext' ? (
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
            <label className="text-sm font-medium text-gray-700">Encrypted Ciphertext</label>
            <Textarea
              value={result.ciphertext}
              readOnly
              className="mt-1 font-mono text-sm bg-gray-50"
              rows={6}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Length:</span>
              <p className="text-gray-600">{result.ciphertext.length} characters</p>
            </div>
            <div>
              <span className="font-medium">Format:</span>
              <p className="text-gray-600">{config.outputFormat.toUpperCase()}</p>
            </div>
            <div>
              <span className="font-medium">Mode:</span>
              <p className="text-gray-600">{config.mode} with {config.padding} padding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Execution Time:</span>
                <Badge variant="outline">{result.executionTime}ms</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Processing Steps:</span>
                <Badge variant="outline">{result.steps.length}</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Throughput:</span>
                <Badge variant="outline">{throughput.toFixed(1)} bytes/sec</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Size Ratio:</span>
                <Badge variant="outline">{compressionRatio}%</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Higher throughput indicates better performance</p>
                <p>• Size ratio shows output vs input length</p>
                <p>• Step count reflects algorithm complexity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Algorithm:</span>
                <Badge className="bg-green-600">SM4 (128-bit)</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Key Strength:</span>
                <Badge className="bg-blue-600">128-bit (2^128)</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Block Size:</span>
                <Badge variant="outline">128-bit</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rounds:</span>
                <Badge variant="outline">32</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• SM4 is approved by Chinese national standard</p>
                <p>• 128-bit keys provide strong security</p>
                <p>• 32 rounds ensure thorough diffusion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input vs Output Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Input vs Output Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Original Plaintext</label>
              <Textarea
                value={originalText}
                readOnly
                className="mt-1 font-mono text-sm bg-blue-50"
                rows={4}
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Length: {originalText.length} characters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(originalText, 'Original plaintext')}
                  className="h-auto p-1"
                >
                  {copiedField === 'Original plaintext' ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Encrypted Ciphertext</label>
              <Textarea
                value={result.ciphertext}
                readOnly
                className="mt-1 font-mono text-sm bg-purple-50"
                rows={4}
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Length: {result.ciphertext.length} characters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.ciphertext, 'Encrypted ciphertext')}
                  className="h-auto p-1"
                >
                  {copiedField === 'Encrypted ciphertext' ? (
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
