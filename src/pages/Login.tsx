import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';
import worxLogo from '@/assets/Worx-logo (2).png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger logo animation after component mounts
    setTimeout(() => setLogoLoaded(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      toast.success('Login successful!', {
        description: 'Welcome back!',
      });
      navigate('/');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        // Dark olive green background matching the image - subtle vertical gradient
        background: 'linear-gradient(to bottom, #556b47 0%, #3d4f35 50%, #2f3f2f 100%)',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      {/* Ultra-beautiful animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Multi-layer animated mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(139, 195, 74, 0.25) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(76, 175, 80, 0.2) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(104, 159, 56, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, rgba(139, 195, 74, 0.18) 0%, transparent 40%),
              radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.16) 0%, transparent 40%)
            `,
            backgroundSize: '200% 200%',
            animation: 'meshMove 25s ease-in-out infinite'
          }}
        />
        
        {/* Shimmer overlay effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 8s linear infinite'
          }}
        />
        
        {/* Enhanced large animated gradient orbs - 8 orbs */}
        {[
          { size: 700, color: 'rgba(139, 195, 74, 0.3)', pos: { top: '-250px', right: '-250px' }, anim: 'orbFloat1', delay: 0 },
          { size: 600, color: 'rgba(76, 175, 80, 0.25)', pos: { bottom: '-200px', left: '-200px' }, anim: 'orbFloat2', delay: 2 },
          { size: 550, color: 'rgba(104, 159, 56, 0.2)', pos: { top: '50%', left: '50%' }, anim: 'orbFloat3', delay: 1 },
          { size: 500, color: 'rgba(139, 195, 74, 0.22)', pos: { top: '20%', right: '10%' }, anim: 'orbFloat4', delay: 3 },
          { size: 450, color: 'rgba(76, 175, 80, 0.18)', pos: { top: '10%', left: '15%' }, anim: 'orbFloat5', delay: 1.5 },
          { size: 400, color: 'rgba(104, 159, 56, 0.2)', pos: { bottom: '15%', right: '20%' }, anim: 'orbFloat6', delay: 2.5 },
          { size: 380, color: 'rgba(139, 195, 74, 0.19)', pos: { top: '70%', left: '5%' }, anim: 'orbFloat7', delay: 0.5 },
          { size: 420, color: 'rgba(76, 175, 80, 0.21)', pos: { bottom: '25%', left: '30%' }, anim: 'orbFloat8', delay: 4 }
        ].map((orb, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              ...orb.pos,
              animation: `${orb.anim} ${25 + i * 3}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`
            }}
          />
        ))}
        
        {/* Glowing rings */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full border"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              borderColor: `rgba(139, 195, 74, ${0.15 - i * 0.02})`,
              borderWidth: '2px',
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animation: `ringPulse ${12 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
        
        {/* Enhanced animated particles - 50 particles */}
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          const opacity = Math.random() * 0.6 + 0.3;
          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `rgba(139, 195, 74, ${opacity})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particleFloat ${12 + Math.random() * 18}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`,
                boxShadow: `0 0 ${Math.random() * 8 + 4}px rgba(139, 195, 74, ${opacity + 0.3})`,
                filter: 'blur(0.5px)'
              }}
            />
          );
        })}
        
        {/* Light rays/beams */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute opacity-15"
            style={{
              width: '2px',
              height: `${200 + Math.random() * 300}px`,
              background: `linear-gradient(to bottom, transparent, rgba(139, 195, 74, 0.4), transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              transformOrigin: 'top center',
              animation: `raySweep ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
        
        {/* Enhanced animated wave effects - 4 waves */}
        {[
          { height: 250, opacity: 0.25, anim: 'wave1', delay: 0, color: 'rgba(139, 195, 74, 0.12)' },
          { height: 200, opacity: 0.2, anim: 'wave2', delay: 2, color: 'rgba(76, 175, 80, 0.1)' },
          { height: 180, opacity: 0.15, anim: 'wave3', delay: 4, color: 'rgba(104, 159, 56, 0.08)' },
          { height: 150, opacity: 0.12, anim: 'wave4', delay: 1, color: 'rgba(139, 195, 74, 0.06)' }
        ].map((wave, i) => (
          <div
            key={`wave-${i}`}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${wave.height}px`,
              opacity: wave.opacity,
              background: `linear-gradient(180deg, transparent 0%, ${wave.color} 100%)`,
              clipPath: `polygon(0 100%, 100% 100%, 100% ${20 + i * 10}%, 0 ${50 + i * 5}%)`,
              animation: `${wave.anim} ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${wave.delay}s`
            }}
          />
        ))}
        
        {/* Floating geometric shapes - 15 shapes */}
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 80 + 40;
          const isCircle = Math.random() > 0.4;
          return (
            <div
              key={`shape-${i}`}
              className="absolute opacity-12"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `rgba(139, 195, 74, ${Math.random() * 0.4 + 0.15})`,
                borderRadius: isCircle ? '50%' : `${Math.random() * 25 + 15}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `shapeFloat ${18 + Math.random() * 22}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 12}s`,
                filter: 'blur(1.5px)',
                boxShadow: `0 0 ${Math.random() * 20 + 10}px rgba(139, 195, 74, 0.3)`
              }}
            />
          );
        })}
        
        {/* Pulsing glow spots */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
              background: `radial-gradient(circle, rgba(139, 195, 74, 0.3) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `glowPulse ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 195, 74, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 195, 74, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div 
          className="p-8 md:p-10 rounded-3xl shadow-2xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(30px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Professional Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Main logo - professional size */}
                <img 
                  src={worxLogo} 
                  alt="The Worx Logo" 
                  className="h-10 md:h-12 w-auto mx-auto"
                  style={{
                    filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.08))',
                    transition: 'opacity 0.3s ease'
                  }}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>
            
            <h1 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#1a1a1a',
                letterSpacing: '-0.01em',
                fontWeight: 600
              }}
            >
              Welcome Back
            </h1>
            <p 
              className="text-gray-600 text-sm md:text-base"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <form 
            onSubmit={handleSubmit} 
            className={`space-y-5 transition-all duration-800 delay-400 ${
              logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="space-y-2">
              <Label 
                htmlFor="username"
                className="text-sm font-semibold block"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#374151'
                }}
              >
                Username or Email
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-200">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 group-focus-within:scale-110 transition-all duration-200" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-sm hover:border-gray-300 hover:shadow-md text-base"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password"
                className="text-sm font-semibold block"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#374151'
                }}
              >
                Password
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-200">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 group-focus-within:scale-110 transition-all duration-200" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-sm hover:border-gray-300 hover:shadow-md text-base"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100 active:scale-95"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 via-green-600 to-green-700 hover:from-green-700 hover:via-green-700 hover:to-green-800 text-white h-12 rounded-xl shadow-xl font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Ultra-enhanced CSS animations */}
      <style>{`
        @keyframes meshMove {
          0%, 100% {
            background-position: 0% 0%, 100% 100%, 50% 50%, 30% 70%, 70% 30%;
          }
          25% {
            background-position: 20% 20%, 80% 80%, 45% 55%, 25% 75%, 75% 25%;
          }
          50% {
            background-position: 40% 40%, 60% 60%, 55% 45%, 35% 65%, 65% 35%;
          }
          75% {
            background-position: 30% 30%, 70% 70%, 50% 50%, 40% 60%, 60% 40%;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        
        @keyframes orbFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(50px, -80px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-30px, -120px) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translate(80px, -40px) scale(1.05);
            opacity: 0.75;
          }
        }
        
        @keyframes orbFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translate(-60px, 50px) scale(1.15);
            opacity: 0.7;
          }
          50% {
            transform: translate(40px, 90px) scale(0.85);
            opacity: 0.6;
          }
          75% {
            transform: translate(-80px, 30px) scale(1.1);
            opacity: 0.65;
          }
        }
        
        @keyframes orbFloat3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0.4;
          }
          33% {
            transform: translate(-45%, -55%) scale(1.2) rotate(120deg);
            opacity: 0.6;
          }
          66% {
            transform: translate(-55%, -45%) scale(0.8) rotate(240deg);
            opacity: 0.5;
          }
        }
        
        @keyframes orbFloat4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translate(40px, -60px) scale(1.1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50px, -30px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translate(60px, -80px) scale(1.05);
            opacity: 0.65;
          }
        }
        
        @keyframes orbFloat5 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.45;
          }
          33% {
            transform: translate(-45px, 70px) scale(1.12) rotate(120deg);
            opacity: 0.65;
          }
          66% {
            transform: translate(55px, -40px) scale(0.88) rotate(240deg);
            opacity: 0.55;
          }
        }
        
        @keyframes orbFloat6 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translate(-70px, 40px) scale(1.08);
            opacity: 0.7;
          }
          50% {
            transform: translate(50px, 80px) scale(0.92);
            opacity: 0.6;
          }
          75% {
            transform: translate(30px, -50px) scale(1.06);
            opacity: 0.65;
          }
        }
        
        @keyframes orbFloat7 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.48;
          }
          30% {
            transform: translate(60px, -90px) scale(1.15) rotate(90deg);
            opacity: 0.68;
          }
          60% {
            transform: translate(-40px, 60px) scale(0.85) rotate(180deg);
            opacity: 0.58;
          }
          90% {
            transform: translate(-80px, -30px) scale(1.05) rotate(270deg);
            opacity: 0.63;
          }
        }
        
        @keyframes orbFloat8 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.52;
          }
          20% {
            transform: translate(80px, -50px) scale(1.1);
            opacity: 0.72;
          }
          40% {
            transform: translate(-60px, 100px) scale(0.9);
            opacity: 0.62;
          }
          60% {
            transform: translate(40px, 30px) scale(1.05);
            opacity: 0.67;
          }
          80% {
            transform: translate(-90px, -70px) scale(0.95);
            opacity: 0.57;
          }
        }
        
        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.25;
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -50px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-20px, -80px);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, -30px);
            opacity: 0.7;
          }
        }
        
        @keyframes wave1 {
          0%, 100% {
            transform: translateX(0) scaleY(1);
            opacity: 0.2;
          }
          50% {
            transform: translateX(-20px) scaleY(1.1);
            opacity: 0.25;
          }
        }
        
        @keyframes wave2 {
          0%, 100% {
            transform: translateX(0) scaleY(1);
            opacity: 0.15;
          }
          50% {
            transform: translateX(30px) scaleY(0.9);
            opacity: 0.2;
          }
        }
        
        @keyframes wave3 {
          0%, 100% {
            transform: translateX(0) scaleY(1);
            opacity: 0.12;
          }
          50% {
            transform: translateX(-25px) scaleY(1.05);
            opacity: 0.18;
          }
        }
        
        @keyframes wave4 {
          0%, 100% {
            transform: translateX(0) scaleY(1);
            opacity: 0.1;
          }
          50% {
            transform: translateX(35px) scaleY(0.95);
            opacity: 0.15;
          }
        }
        
        @keyframes raySweep {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
            opacity: 0.1;
          }
          25% {
            transform: rotate(90deg) translateY(-50px);
            opacity: 0.2;
          }
          50% {
            transform: rotate(180deg) translateY(-100px);
            opacity: 0.15;
          }
          75% {
            transform: rotate(270deg) translateY(-50px);
            opacity: 0.18;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        @keyframes shapeFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(40px, -60px) rotate(90deg) scale(1.2);
            opacity: 0.15;
          }
          50% {
            transform: translate(-30px, -100px) rotate(180deg) scale(0.8);
            opacity: 0.12;
          }
          75% {
            transform: translate(50px, -40px) rotate(270deg) scale(1.1);
            opacity: 0.14;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.4);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

