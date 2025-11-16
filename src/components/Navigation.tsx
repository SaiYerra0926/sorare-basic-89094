import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, BarChart3, Receipt, LogOut, User, Shield } from 'lucide-react';
import worxLogo from '@/assets/Worx-logo (2).png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const { user, logout, hasPermission, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#FFFEF7',
        borderBottom: 'none'
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto" />
            </Link>
            <Link 
              to="/" 
              className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#36454F'
              }}
            >
              Home
            </Link>
            <Link 
              to="/beginners-guide"
              className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#36454F'
              }}
            >
              Beginners Guide
            </Link>
            <Link 
              to="/dashboard"
              className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#36454F'
              }}
            >
              Dashboard
            </Link>
            {hasPermission('can_access_billing') && (
              <Link 
                to="/billing"
                className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#36454F'
                }}
              >
                Billing
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin"
                className="text-base font-normal no-underline hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  color: '#36454F'
                }}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.username || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {user?.fullName || user?.username}
                    </span>
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {user?.email}
                    </span>
                    <span className="text-xs mt-1">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-purple-600">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-600">User</span>
                      )}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

