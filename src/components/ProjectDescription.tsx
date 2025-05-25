
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Eye, BookOpen, Zap, Settings } from 'lucide-react';

const ProjectDescription = () => {
  const features = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Step-by-Step Visualization",
      description: "Watch the SM4 algorithm process each step with detailed explanations and visual representations."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Multiple Operation Modes",
      description: "Support for ECB and CBC modes with configurable padding (None, PKCS7) and formats (Base64, Hex)."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Random Test Generation",
      description: "Generate random keys and plaintext for easy testing and experimentation."
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Educational Content",
      description: "Comprehensive tutorials and examples to help beginners understand cryptography concepts."
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
              <h1 className="text-3xl font-bold mb-2">SM4 Cryptography Visualizer</h1>
              <p className="text-blue-100 text-lg">
                Interactive Educational Tool for Understanding SM4 Encryption Algorithm
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                What is SM4?
              </h3>
              <p className="text-blue-50 leading-relaxed">
                SM4 is a block cipher encryption algorithm adopted as a national standard in China. 
                It operates on 128-bit blocks with 128-bit keys and uses a 32-round Feistel structure 
                for secure data encryption and decryption.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="text-blue-50 space-y-1">
                <li>• 128-bit block size and key length</li>
                <li>• 32-round Feistel network structure</li>
                <li>• Support for multiple operation modes</li>
                <li>• Visual step-by-step process display</li>
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
            <CardTitle>Supported Configurations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Operation Modes</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">ECB (Electronic Codebook)</Badge>
                <Badge variant="outline">CBC (Cipher Block Chaining)</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Padding Modes</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">None</Badge>
                <Badge variant="outline">PKCS7</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Output Formats</h4>
              <div className="flex space-x-2">
                <Badge variant="outline">Base64</Badge>
                <Badge variant="outline">Hex</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies Used</CardTitle>
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
              Built with modern web technologies to provide a responsive, interactive, 
              and educational experience for learning cryptographic algorithms.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Configure Settings</h4>
              <p className="text-gray-600 text-sm">
                Choose your preferred operation mode, padding, and output format.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Input Data</h4>
              <p className="text-gray-600 text-sm">
                Enter your plaintext and key, or use the random generation feature.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Watch & Learn</h4>
              <p className="text-gray-600 text-sm">
                Observe the step-by-step encryption process with detailed explanations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDescription;
