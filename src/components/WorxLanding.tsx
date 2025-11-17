import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { tools } from '@/data/tools';
import worxLogo from '@/assets/Worx-logo (2).png';
import worxBannerLogo from '@/assets/Worx-logo (2).png';
import { Navigation } from './Navigation';

export const WorxLanding = () => {
  return <div 
    className="min-h-screen w-full flex flex-col"
    style={{
      backgroundColor: '#FFFEF0'
    }}
  >
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Exact Match to Reference Image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${worxBannerLogo})`,
              filter: 'blur(8px) brightness(0.5)',
              transform: 'scale(1.1)'
            }}
          />
          {/* Gradient Overlay - Golden-brown to Olive-green (exact match to reference) */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(139, 110, 59, 0.75), rgba(47, 79, 79, 0.75))'
            }}
          />
        </div>
        
        {/* Hero Content - Professional Alignment */}
        <div className="relative z-10 container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Logo - Smaller and Professional */}
            <div className="flex justify-center mb-8 md:mb-10 relative">
              <img 
                src={worxBannerLogo} 
                alt="The Worx Banner Logo" 
                className="w-full max-w-xl md:max-w-xl h-auto rounded-2xl shadow-2xl relative z-10 transform hover:scale-[1.02] transition-transform duration-500"
                style={{
                  filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25))'
                }}
              />
            </div>
            
            {/* Description Text - Content Only, No Card */}
            <div className="max-w-4xl mx-auto">
              <p 
                className="text-base md:text-lg lg:text-xl leading-relaxed text-white font-normal text-left"
                style={{
                  fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  lineHeight: '1.8'
                }}
              >
                The Worx! operates with a holistic approach, integrating physical, mental, and social health to support individuals in their recovery journey. By maintaining a continuum of care and fostering community partnerships, we ensure that services are streamlined and effective. Here are some of the additional resources and adjunct services available in the community that will strengthen our initiative and assist the individuals we serve.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Forms Section - Full Width Background */}
      <div 
        className="w-full pb-24 flex-1"
        style={{
          backgroundColor: '#FFFEF0'
        }}
      >
        <div className="container mx-auto px-6 lg:px-8 py-8 md:py-12">
          {/* Forms Section - Professional Alignment */}
          <section className="mb-16 md:mb-20 animate-fadeIn">
            <div className="max-w-5xl mx-auto mb-10 md:mb-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight leading-tight text-gray-800 text-center"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Forms & Resources
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200" style={{ backgroundColor: '#FFFEF0' }}>
                  <p 
                    className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 font-normal text-center"
                    style={{
                      fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: '1.8'
                    }}
                  >
                    Access our comprehensive collection of forms and resources designed to support your recovery journey
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
                {tools.map((tool, index) => {
              const IconComponent = tool.icon;

              const content = (
                <div 
                  className="animate-fadeIn flex flex-col items-center cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Rounded Square Card with Gradient - Professional Style */}
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg mb-2 icon-card-hover"
                    style={{
                      background: 'linear-gradient(135deg, #A0826D 0%, #D4A574 100%)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    <IconComponent 
                      className="w-7 h-7 md:w-9 md:h-9 text-white transition-all duration-300" 
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                      }}
                    />
                  </div>
                  {/* Tool Name Text */}
                  <p 
                    className="text-xs md:text-sm font-semibold text-gray-800 mb-1 text-center leading-tight mt-1"
                    style={{ 
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {tool.name}
                  </p>
                </div>
              );

              return (
                <Link key={tool.name} to={tool.url || '#'}>
                  {content}
                </Link>
              );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer - Professional Design Matching Reference Image */}
      <footer 
        className="py-12 md:py-16 mt-auto"
        style={{
          background: 'linear-gradient(to bottom, #7A6B5A, #2F3F2F)'
        }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          {/* Three Column Layout - Perfectly Aligned */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-8">
            {/* First Column - Company Branding */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto" />
                <div className="flex flex-col">
                  <span 
                    className="text-2xl font-serif text-white font-bold leading-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    The Worx
                  </span>
                  <span 
                    className="text-xs font-sans text-white uppercase tracking-wider mt-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    GROUP
                  </span>
                </div>
              </div>
              <p 
                className="text-sm text-gray-200 leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Supporting recovery journeys with comprehensive care and community partnerships. Your trusted partner for holistic recovery support services.
              </p>
            </div>

            {/* Second Column - Quick Links */}
            <div className="space-y-4">
              <h3 
                className="text-base font-semibold text-white mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/beginners-guide" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Beginners Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/referrals" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Forms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/handbook" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Handbook
                  </Link>
                </li>
              </ul>
            </div>

            {/* Third Column - Services */}
            <div className="space-y-4">
              <h3 
                className="text-base font-semibold text-white mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/referrals" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Recovery Support
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/beginners-guide" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Case Management
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/handbook" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Resource Coordination
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="text-sm text-gray-200 hover:text-white transition-colors duration-200 inline-block"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Community Partnerships
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-500/30 my-8"></div>

          {/* Copyright Section */}
          <div className="text-center">
            <p 
              className="text-sm text-gray-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              © {new Date().getFullYear()} The Worx Group. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};