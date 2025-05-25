
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Eye, BookOpen, Zap, Settings } from 'lucide-react';

const ProjectDescription = () => {
  const features = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "分步骤可视化",
      description: "观看 SM4 算法处理每个步骤的详细解释和可视化展示。"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "多种操作模式",
      description: "支持 ECB 和 CBC 模式，可配置填充方式（无填充、PKCS7）和格式（Base64、十六进制）。"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "随机测试生成",
      description: "生成随机密钥和明文，便于测试和实验。"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "教育内容",
      description: "全面的教程和示例，帮助初学者理解密码学概念。"
    }
  ];

  const technologies = [
    "React", "TypeScript", "Tailwind CSS", "Shadcn/UI", "Lucide Icons"
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">SM4 密码算法可视化工具</h1>
              <p className="text-blue-100 text-lg">
                理解 SM4 加密算法的交互式教育工具
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                什么是 SM4？
              </h3>
              <p className="text-blue-50 leading-relaxed">
                SM4 是中国采用的分组密码加密算法国家标准。它对 128 位数据块进行操作，
                使用 128 位密钥和 32 轮 Feistel 结构进行安全的数据加密和解密。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">主要特性</h3>
              <ul className="text-blue-50 space-y-1">
                <li>• 128 位分组大小和密钥长度</li>
                <li>• 32 轮 Feistel 网络结构</li>
                <li>• 支持多种操作模式</li>
                <li>• 可视化分步过程显示</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <span>{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>支持的配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">操作模式</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">ECB (电子密码本)</Badge>
                <Badge variant="outline">CBC (密码块链接)</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">填充模式</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">无填充</Badge>
                <Badge variant="outline">PKCS7</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">输出格式</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">Base64</Badge>
                <Badge variant="outline">十六进制</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用的技术</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600 mt-4 leading-relaxed">
              使用现代 Web 技术构建，为学习密码算法提供响应式、交互式和教育性的体验。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>如何使用此工具</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">配置设置</h4>
              <p className="text-gray-600 text-sm">
                选择您偏好的操作模式、填充方式和输出格式。
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">输入数据</h4>
              <p className="text-gray-600 text-sm">
                输入您的明文和密钥，或使用随机生成功能。
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">观察和学习</h4>
              <p className="text-gray-600 text-sm">
                观察分步加密过程和详细解释。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDescription;
