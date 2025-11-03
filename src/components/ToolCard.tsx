import { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  iconColor: string;
  comingSoon?: boolean;
  isSupport?: boolean;
  isInternal?: boolean;
  isConsentForm?: boolean;
  onConsentFormClick?: () => void;
}

const ToolCardComponent = ({
  name,
  description,
  url,
  icon: Icon,
  iconColor,
  comingSoon,
  isSupport,
  isInternal = false,
  isConsentForm = false,
  onConsentFormClick
}: ToolCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if (comingSoon) {
      e.preventDefault();
      return;
    }
    
    if (isConsentForm && onConsentFormClick) {
      e.preventDefault();
      e.stopPropagation();
      onConsentFormClick();
      return;
    }
    
    if (isInternal) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Navigating to:', url); // Debug log
      navigate(url);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`rounded-2xl p-3 md:p-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-500 border border-border/50 dark:border-border/70 hover:border-border dark:hover:border-border/90 group flex flex-col min-h-[220px] md:min-h-[280px] relative cursor-pointer ${isSupport ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 dark:border-yellow-700/30 shadow-apple-xl" : "bg-card dark:bg-card/95"} ${comingSoon ? "cursor-not-allowed" : ""}`}
    >
      {/* External link wrapper */}
      {!isInternal && !comingSoon && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-2xl"
          aria-label={`Open ${name}`}
        />
      )}
      
      {/* Card Content */}
      <div className="flex flex-col items-center text-center h-full justify-between relative z-0">
        <div className="flex flex-col items-center space-y-2 md:space-y-3">
          <div className={`p-2 md:p-3 rounded-2xl ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={`md:w-6 md:h-6 ${comingSoon ? "text-muted-foreground" : "text-white"}`} />
          </div>
          
          <h3 className="text-sm md:text-base font-semibold text-foreground dark:text-foreground/95 leading-tight">
            {name}
          </h3>
        </div>
        
        <p className="text-foreground/70 dark:text-foreground/80 leading-snug text-xs md:text-sm my-2 md:my-3 flex-1 flex items-center justify-center text-center">
          {description}
        </p>
        
        <div className="mt-auto">
          {comingSoon ? (
            <div className="inline-flex items-center justify-center px-2 md:px-4 py-1 md:py-2 bg-muted text-muted-foreground rounded-xl font-medium cursor-not-allowed text-xs md:text-sm">
              Coming Soon
            </div>
          ) : isInternal ? (
            <div className={`inline-flex items-center justify-center px-2 md:px-4 py-1 md:py-2 rounded-xl font-medium transition-all duration-300 shadow-apple-sm hover:shadow-apple group-hover:scale-105 text-xs md:text-sm bg-primary text-primary-foreground hover:bg-button-hover`}>
              {isConsentForm ? 'View Form' : 'Fill Form'}
            </div>
          ) : (
            <div className={`inline-flex items-center justify-center px-2 md:px-4 py-1 md:py-2 rounded-xl font-medium transition-all duration-300 shadow-apple-sm hover:shadow-apple group-hover:scale-105 text-xs md:text-sm ${isSupport ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600" : "bg-primary text-primary-foreground hover:bg-button-hover"}`}>
              {isSupport ? "Send a card" : "Visit"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ToolCard = memo(ToolCardComponent);

ToolCard.displayName = 'ToolCard';