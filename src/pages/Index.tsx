
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Key, Shield, Zap } from 'lucide-react';
import SM4Visualizer from '@/components/SM4Visualizer';
import ProjectDescription from '@/components/ProjectDescription';

const Index = () => {
  const [currentView, setCurrentView] = React.useState<'description' | 'visualizer' | 'tutorial'>('description');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SM4 Cryptography Visualizer
                </h1>
                <p className="text-sm text-gray-600">Interactive SM4 Algorithm Learning Tool</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              <Button
                variant={currentView === 'description' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('description')}
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Project Info</span>
              </Button>
              <Button
                variant={currentView === 'visualizer' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('visualizer')}
                className="flex items-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>Visualizer</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'description' && <ProjectDescription />}
        {currentView === 'visualizer' && <SM4Visualizer />}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>SM4 Cryptography Visualizer - Educational Tool for Understanding Encryption</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
