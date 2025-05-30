
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { SM4State } from '@/types/sm4';

interface VisualizationPanelProps {
  sm4State: SM4State | null;
  currentStep: number;
  onStepChange: (step: number) => void;
  isProcessing: boolean;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  sm4State,
  currentStep,
  onStepChange,
  isProcessing
}) => {
  const [isAutoPlay, setIsAutoPlay] = React.useState(false);
  const [playSpeed, setPlaySpeed] = React.useState(1000); // ms between steps
  const [showAllRounds, setShowAllRounds] = React.useState(false);

  React.useEffect(() => {
    if (isAutoPlay && sm4State && currentStep < sm4State.rounds.length - 1) {
      const timer = setTimeout(() => {
        onStepChange(currentStep + 1);
      }, playSpeed);
      return () => clearTimeout(timer);
    } else if (isAutoPlay && sm4State && currentStep >= sm4State.rounds.length - 1) {
      setIsAutoPlay(false);
    }
  }, [isAutoPlay, currentStep, sm4State, playSpeed, onStepChange]);

  if (!sm4State) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">没有加密过程可视化</p>
            <p className="text-sm">配置设置并开始加密以查看分步过程</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRound = sm4State.rounds[currentStep] || sm4State.rounds[0];
  const totalSteps = sm4State.rounds.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const formatHex = (value: number | number[]): string => {
    if (Array.isArray(value)) {
      return value.map(v => v.toString(16).padStart(2, '0')).join(' ');
    }
    return value.toString(16).padStart(8, '0');
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleReset = () => {
    onStepChange(0);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>算法可视化</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                第 {currentRound.roundNumber + 1} 轮，共 32 轮
              </Badge>
              <Badge variant="secondary">
                {sm4State.mode} 模式
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>加密进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousStep}
              disabled={currentStep === 0 || isProcessing}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant={isAutoPlay ? "secondary" : "default"}
              size="sm"
              onClick={toggleAutoPlay}
              disabled={isProcessing || currentStep >= totalSteps - 1}
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextStep}
              disabled={currentStep >= totalSteps - 1 || isProcessing}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="ml-4 flex items-center space-x-2">
              <label className="text-sm">速度：</label>
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={2000}>慢</option>
                <option value={1000}>正常</option>
                <option value={500}>快</option>
              </select>
            </div>

            <Button
              variant={showAllRounds ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowAllRounds(!showAllRounds)}
              className="ml-4"
            >
              {showAllRounds ? "隐藏" : "显示"}全部轮
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Round Visualization */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>第 {currentRound.roundNumber + 1} 轮输入状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {currentRound.input.map((word, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">X{index}</div>
                  <div className="bg-blue-100 p-2 rounded font-mono text-sm">
                    {formatHex(word)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>轮密钥与变换</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">轮密钥 RK{currentRound.roundNumber}</div>
              <div className="bg-purple-100 p-2 rounded font-mono text-sm">
                {formatHex(currentRound.roundKey)}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">S 盒输出</div>
              <div className="bg-green-100 p-2 rounded font-mono text-sm">
                {formatHex(currentRound.sboxOutput)}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">线性变换输出</div>
              <div className="bg-orange-100 p-2 rounded font-mono text-sm">
                {formatHex(currentRound.linearOutput)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Round Output */}
      <Card>
        <CardHeader>
          <CardTitle>第 {currentRound.roundNumber + 1} 轮输出状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {currentRound.output.map((word, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-1">X{index}</div>
                <div className="bg-indigo-100 p-2 rounded font-mono text-sm">
                  {formatHex(word)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-700">{currentRound.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* All Rounds Overview */}
      {showAllRounds && (
        <Card>
          <CardHeader>
            <CardTitle>完整加密过程概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sm4State.rounds.map((round, index) => (
                <div 
                  key={index}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onStepChange(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">第 {round.roundNumber + 1} 轮</h4>
                    <Badge variant={index === currentStep ? "default" : "outline"}>
                      RK{round.roundNumber}: {formatHex(round.roundKey)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">输入：</span>
                      <div className="font-mono">
                        {round.input.map(w => formatHex(w)).join(' | ')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">输出：</span>
                      <div className="font-mono">
                        {round.output.map(w => formatHex(w)).join(' | ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Algorithm Flow */}
      <Card>
        <CardHeader>
          <CardTitle>SM4 算法流程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span>输入</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
              <span>轮密钥</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span>S 盒</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
              <span>线性变换</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-300 rounded"></div>
              <span>输出</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationPanel;
