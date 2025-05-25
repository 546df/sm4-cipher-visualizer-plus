
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Key, Shield, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const TutorialPanel = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <span>SM4 算法教程与示例</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-100">
            通过交互式示例和分步解释学习 SM4 分组密码算法。
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概述</TabsTrigger>
          <TabsTrigger value="algorithm">算法</TabsTrigger>
          <TabsTrigger value="modes">模式</TabsTrigger>
          <TabsTrigger value="examples">示例</TabsTrigger>
          <TabsTrigger value="security">安全性</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>什么是 SM4？</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                SM4 是一种对称分组密码算法，已被采纳为中国国家标准（GB/T 32907-2016）。
                它专为无线局域网产品设计，也用于各种其他密码学应用。
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">关键特征</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>128位分组大小</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>128位密钥长度</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>32轮费斯特尔结构</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>非线性 S-盒变换</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">应用领域</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 无线局域网安全（WAPI）</li>
                    <li>• VPN 和网络加密</li>
                    <li>• 移动通信系统</li>
                    <li>• 政府和商业应用</li>
                    <li>• 物联网设备安全</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SM4 算法结构</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">1. 密钥扩展</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    使用 SM4 密钥调度算法将 128 位主密钥扩展为 32 个轮密钥：
                  </p>
                  <div className="font-mono text-xs bg-white p-3 rounded border">
                    <div>MK = (MK₀, MK₁, MK₂, MK₃)</div>
                    <div>K₀ = MK₀ ⊕ FK₀, K₁ = MK₁ ⊕ FK₁, K₂ = MK₂ ⊕ FK₂, K₃ = MK₃ ⊕ FK₃</div>
                    <div>对于 i = 0 到 31: RKᵢ = Kᵢ₊₄ = Kᵢ ⊕ T'(Kᵢ₊₁ ⊕ Kᵢ₊₂ ⊕ Kᵢ₊₃ ⊕ CKᵢ)</div>
                  </div>
                </div>

                <h4 className="font-semibold text-lg">2. 轮函数</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    每轮应用 T 变换，包含以下部分：
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">非线性变换 (τ)</h5>
                      <p className="text-xs text-gray-600">对每个字节应用 S-盒替换</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">线性变换 (L)</h5>
                      <p className="text-xs text-gray-600">位旋转和异或运算实现扩散</p>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-lg">3. 轮结构</h4>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="font-mono text-xs bg-white p-3 rounded border">
                    <div>Xᵢ₊₄ = Xᵢ ⊕ T(Xᵢ₊₁ ⊕ Xᵢ₊₂ ⊕ Xᵢ₊₃ ⊕ RKᵢ)</div>
                    <div>其中 T(A) = L(τ(A))</div>
                    <div>L(B) = B ⊕ (B ≪ 2) ⊕ (B ≪ 10) ⊕ (B ≪ 18) ⊕ (B ≪ 24)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modes" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge className="bg-blue-600">ECB</Badge>
                  <span>电子密码本</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  ECB 模式使用相同密钥独立加密每个分组。
                </p>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-green-600">优点：</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 实现简单</li>
                    <li>• 可并行加密</li>
                    <li>• 无错误传播</li>
                  </ul>

                  <h5 className="font-medium text-red-600">缺点：</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 相同分组产生相同密文</li>
                    <li>• 明文中的模式被保留</li>
                    <li>• 易受选择明文攻击</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600">
                    <strong>适用场景：</strong> 小型随机数据或速度至关重要且模式不是问题的情况。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge className="bg-purple-600">CBC</Badge>
                  <span>密码分组链接</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  CBC 模式在加密前将每个明文分组与前一个密文分组进行异或。
                </p>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-green-600">优点：</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 相同分组产生不同密文</li>
                    <li>• 比 ECB 更安全</li>
                    <li>• 隐藏明文模式</li>
                  </ul>

                  <h5 className="font-medium text-red-600">缺点：</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 顺序加密（不可并行）</li>
                    <li>• 分组间错误传播</li>
                    <li>• 需要初始化向量（IV）</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-600">
                    <strong>适用场景：</strong> 安全性重要且必须隐藏模式的通用加密。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>填充方案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">PKCS7 填充</h5>
                  <p className="text-sm text-gray-700 mb-3">
                    添加值等于所需填充字节数的填充字节。
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    原始: [A, B, C]<br/>
                    填充后: [A, B, C, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13]
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">无填充</h5>
                  <p className="text-sm text-gray-700 mb-3">
                    数据必须已经是分组大小的倍数（SM4 为 16 字节）。
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    输入：必须恰好是 16、32、48... 字节<br/>
                    不对数据进行修改
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>示例 1：基本 ECB 加密</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">输入</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>明文：</strong> "你好，世界！"</div>
                      <div><strong>密钥：</strong> 0123456789abcdef0123456789abcdef</div>
                      <div><strong>模式：</strong> ECB</div>
                      <div><strong>填充：</strong> PKCS7</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">预期输出</h5>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all">
                      c5d2a7f3e8b9d4c1a6f2e7b8c3d9a4f5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>示例 2：带 IV 的 CBC 模式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">输入</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>明文：</strong> "安全消息"</div>
                      <div><strong>密钥：</strong> fedcba9876543210fedcba9876543210</div>
                      <div><strong>IV：</strong> 1234567890abcdef1234567890abcdef</div>
                      <div><strong>模式：</strong> CBC</div>
                      <div><strong>填充：</strong> PKCS7</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">预期输出</h5>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all">
                      b8f4e2d1c9a7f5e3d1c9a7f5e3b8f4e2
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>测试这些示例</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700">
                  在可视化工具中尝试这些示例，看看不同模式和设置如何影响加密过程。
                  使用"随机生成"按钮创建您自己的测试用例，并尝试不同的配置。
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>SM4 安全性分析</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-green-600 mb-3">优势</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>128位安全：</strong> 提供 2^128 种可能的密钥，使暴力破解在计算上不可行</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>32轮：</strong> 足够的轮数确保强扩散和混淆</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>非线性 S-盒：</strong> 提供对线性和差分攻击的抵抗</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span><strong>国家标准：</strong> 经过密码学专家广泛分析和认证</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-amber-600 mb-3">注意事项</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>模式选择：</strong> ECB 模式可能泄露数据模式，建议大多数用途使用 CBC</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>密钥管理：</strong> 安全的密钥生成和分发至关重要</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>实现：</strong> 糟糕的实现可能受到侧信道攻击</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span><strong>IV 唯一性：</strong> CBC 模式每次加密都需要唯一的 IV</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">最佳实践</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 对通用加密使用 CBC 模式</li>
                  <li>• 为每次加密操作生成随机、唯一的 IV</li>
                  <li>• 使用安全的随机数生成器进行密钥生成</li>
                  <li>• 实施适当的密钥轮换和管理程序</li>
                  <li>• 考虑使用认证加密模式以提供完整性保护</li>
                  <li>• 定期审计和测试密码学实现</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialPanel;
