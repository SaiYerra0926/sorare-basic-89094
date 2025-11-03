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
      className={`rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/40 dark:border-border/60 hover:border-primary/50 dark:hover:border-primary/40 group flex flex-col min-h-[240px] md:min-h-[300px] relative cursor-pointer overflow-hidden ${isSupport ? "bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/30 border-yellow-200/60 dark:border-yellow-700/40 shadow-xl" : "bg-card/80 dark:bg-card/90 backdrop-blur-sm"} ${comingSoon ? "cursor-not-allowed opacity-75" : "hover:scale-[1.02] hover:-translate-y-1"}`}
    >
      {/* Animated background gradient */}
      {!comingSoon && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      )}
      
      {/* External link wrapper */}
      {!isInternal && !comingSoon && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-3xl"
          aria-label={`Open ${name}`}
        />
      )}
      
      {/* Card Content */}
      <div className="flex flex-col items-center text-center h-full justify-between relative z-0">
        <div className="flex flex-col items-center space-y-3 md:space-y-4">
          <div className={`p-3 md:p-4 rounded-2xl ${iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
            <Icon size={24} className={`md:w-7 md:h-7 ${comingSoon ? "text-muted-foreground" : "text-white"}`} />
          </div>
          
          <h3 className="text-base md:text-lg font-bold text-foreground dark:text-foreground/95 leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
        </div>
        
        <p className="text-foreground/70 dark:text-foreground/80 leading-relaxed text-xs md:text-sm my-3 md:my-4 flex-1 flex items-center justify-center text-center px-2">
          {description}
        </p>
        
        <div className="mt-auto w-full">
          {comingSoon ? (
            <div className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-muted/50 text-muted-foreground rounded-xl font-semibold cursor-not-allowed text-xs md:text-sm border border-border/50">
              Coming Soon
            </div>
          ) : isInternal ? (
            <div className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105 text-xs md:text-sm bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary border border-primary/20`}>
              {isConsentForm ? 'View Form' : 'Fill Form'}
            </div>
          ) : (
            <div className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105 text-xs md:text-sm ${isSupport ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 border border-yellow-300/50" : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary border border-primary/20"}`}>
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