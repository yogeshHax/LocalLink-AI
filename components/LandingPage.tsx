import React from 'react';
import { ArrowRight, Shield, Zap, Users, Hexagon, Share2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Reusing the new Logo definition for consistency
const LocalLinkLogo = () => (
    <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="relative flex items-center justify-center bg-indigo-600 w-10 h-10 rounded-xl shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
            <Hexagon className="w-full h-full text-indigo-600 absolute opacity-0" fill="currentColor" />
            <Share2 className="w-3/5 h-3/5 text-white relative z-10" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
            <span className="font-black text-gray-900 text-xl tracking-tight leading-none">LocalLink</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Community</span>
        </div>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <LocalLinkLogo />
        <div className="flex gap-4">
          <button onClick={onGetStarted} className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-bold hover:bg-gray-50 rounded-xl transition-all">Log In</button>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Join Community
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wide mb-8 border border-indigo-100 animate-[fadeIn_0.5s]">
              <Zap className="w-4 h-4 fill-current" />
              <span>The #1 Marketplace for Open Innovation</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[0.9]">
              Trade Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Save Cash.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              LocalLink connects you with neighbors to exchange services. Pay with money or trade your time using our unique Credit System.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105"
              >
                Find Help Nearby
              </button>
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Offer Your Skills <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "Trusted & Verified",
                desc: "Every neighbor has a Trust Score. We verify IDs so you can welcome help into your home with confidence."
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Smart Matching",
                desc: "Our AI finds the perfect barter. You need plumbing, they need math tutoring? It's a match."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Dual Currency",
                desc: "Short on cash? No problem. Earn Time-Credits by helping others and spend them when you need help."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                <div className="mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Preview */}
      <div className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-500 font-bold tracking-widest text-sm uppercase">© 2024 LocalLink Inc.</p>
      </div>
    </div>
  );
};

export default LandingPage;