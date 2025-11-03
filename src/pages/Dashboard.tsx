import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  BookOpen,
  BarChart3,
  Users,
  Search,
  Filter,
  Calendar,
  X,
  Loader2,
  FileText,
  Phone,
  Mail,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from '@/lib/api';
import { toast } from 'sonner';
import worxLogo from '@/assets/worx-logo.png';

interface CompletedReferral {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  cell_phone?: string;
  email?: string;
  medical_assistance_provider?: string;
  gender?: string;
  birth_date?: string;
  referral_date: string;
  completed_date?: string;
  referrer_name?: string;
  referrer_agency?: string;
  created_at: string;
}

interface ReferralDetails {
  referral: any;
  personalInfo: any;
  screeningInfo: any;
  priorityPopulations: string[];
  emergencyContact: any;
  referrer: any;
  applicantSignature: any;
}

const Dashboard = () => {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [completedReferrals, setCompletedReferrals] = useState<CompletedReferral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<ReferralDetails | null>(null);
  const [showNamesDialog, setShowNamesDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch completed referrals count
  useEffect(() => {
    fetchCompletedCount();
  }, []);

  // Fetch completed referrals when filters change
  useEffect(() => {
    fetchCompletedReferrals();
  }, [page, search, startDate, endDate]);

  const fetchCompletedCount = async () => {
    try {
      const response = await api.getCompletedReferralsCount();
      if (response.success && response.data) {
        setCompletedCount(response.data.count);
      }
    } catch (error: any) {
      console.error('Error fetching count:', error);
      toast.error('Failed to load count', {
        description: error.message || 'Please check your connection',
      });
    }
  };

  const fetchCompletedReferrals = async () => {
    setLoading(true);
    try {
      // Ensure page and limit are valid numbers
      const validPage = (page > 0 && !isNaN(page) && isFinite(page)) ? page : 1;
      const validLimit = (limit > 0 && !isNaN(limit) && isFinite(limit)) ? limit : 10;
      
      // Ensure we're passing valid numbers
      const pageParam = Number.isInteger(validPage) ? validPage : 1;
      const limitParam = Number.isInteger(validLimit) ? validLimit : 10;
      
      const response = await api.getCompletedReferrals({
        search: search && search.trim() ? search.trim() : undefined,
        startDate: startDate && startDate.trim() ? startDate.trim() : undefined,
        endDate: endDate && endDate.trim() ? endDate.trim() : undefined,
        page: pageParam,
        limit: limitParam,
      });

      if (response.success && response.data) {
        const referrals = Array.isArray(response.data) ? response.data : [];
        // Log first referral to debug ID format
        if (referrals.length > 0) {
          console.log('Fetched referrals:', referrals.length);
          console.log('First referral data:', referrals[0]);
          console.log('First referral ID:', referrals[0].id, 'Type:', typeof referrals[0].id);
        }
        setCompletedReferrals(referrals);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotal(response.pagination.total || 0);
        }
      } else {
        setCompletedReferrals([]);
      }
    } catch (error: any) {
      console.error('Error fetching completed referrals:', error);
      toast.error('Failed to load referrals', {
        description: error.message || 'Please check your connection',
      });
      setCompletedReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountClick = () => {
    setShowNamesDialog(true);
    if (completedReferrals.length === 0) {
      fetchCompletedReferrals();
    }
  };

  const handleNameClick = async (referralId: number | string | null | undefined) => {
    // Convert referral ID to number if it's a string
    let numericId: number;
    
    if (typeof referralId === 'string') {
      numericId = parseInt(referralId, 10);
    } else if (typeof referralId === 'number') {
      numericId = referralId;
    } else {
      console.error('Invalid referral ID type:', typeof referralId, referralId);
      toast.error('Invalid referral ID', {
        description: 'The referral ID is invalid. Please try again.',
      });
      return;
    }
    
    // Validate referral ID
    if (!numericId || isNaN(numericId) || !isFinite(numericId) || numericId <= 0) {
      console.error('Invalid referral ID after conversion:', numericId, 'Original:', referralId);
      toast.error('Invalid referral ID', {
        description: 'The referral ID is invalid. Please try again.',
      });
      return;
    }
    
    console.log('Fetching referral details for ID:', numericId);
    setLoadingDetails(true);
    setShowDetailsDialog(true);
    try {
      const response = await api.getReferralById(numericId);
      if (response.success && response.data) {
        setSelectedReferral(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load details', {
        description: error.message || 'Please check your connection',
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - The Worx</title>
        <meta name="description" content="The Worx dashboard with completed referrals analytics." />
      </Helmet>

      <div className="min-h-screen bg-background w-full flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/95 dark:bg-background/98 backdrop-blur-md border-b border-border/50 dark:border-border/70 shadow-sm">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto" />
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium">
                    <Home size={18} />
                    Home
                  </Button>
                </Link>
                <Link to="/beginners-guide">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent">
                    <BookOpen size={18} />
                    Beginners Guide
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent">
                  <BarChart3 size={18} />
                  Dashboard
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 lg:px-8 py-8 flex-1">
          {/* Completed Referrals Count Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card 
              className="border-2 border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 cursor-pointer transform hover:scale-105"
              onClick={handleCountClick}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-primary rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Completed Referrals
                </CardTitle>
                <CardDescription>Total forms with completed signatures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-primary mb-2">{completedCount}</div>
                <p className="text-sm text-muted-foreground">Click to view details</p>
              </CardContent>
            </Card>

            {/* Search and Filter Card */}
            <Card className="lg:col-span-2 border-border/50 dark:border-border/70 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search & Filter
                  </span>
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Filter Options</SheetTitle>
                        <SheetDescription>
                          Filter completed referrals by date range and search criteria
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Search</label>
                          <Input
                            placeholder="Search by name, email, phone, or agency..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Start Date</label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">End Date</label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={clearFilters} variant="outline" className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                          <Button onClick={() => setShowFilters(false)} className="flex-1">
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, email, phone, or agency..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => fetchCompletedReferrals()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Referrals Table */}
          <Card className="border-border/50 dark:border-border/70 shadow-lg">
            <CardHeader>
              <CardTitle>Completed Referrals</CardTitle>
              <CardDescription>
                Showing {completedReferrals.length} of {total} completed referral forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completedReferrals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed referrals found</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <ScrollArea className="h-[500px]">
                      <table className="w-full">
                        <thead className="bg-muted/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Referral Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Completed Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Referrer</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedReferrals.map((referral) => (
                            <tr
                              key={referral.id}
                              className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => {
                                console.log('Row clicked, referral data:', referral);
                                console.log('Referral ID:', referral.id, 'Type:', typeof referral.id);
                                
                                // Convert to number if it's a string
                                const idToCheck = typeof referral.id === 'string' 
                                  ? parseInt(referral.id, 10) 
                                  : referral.id;
                                
                                if (idToCheck && !isNaN(idToCheck) && isFinite(idToCheck) && idToCheck > 0) {
                                  handleNameClick(idToCheck);
                                } else {
                                  console.error('Invalid referral ID in row click:', referral.id, 'Converted:', idToCheck);
                                  toast.error('Invalid referral ID', {
                                    description: `Cannot load details for this referral. ID: ${referral.id}`,
                                  });
                                }
                              }}
                            >
                              <td className="px-4 py-3">
                                <div className="font-medium">{referral.name || 'N/A'}</div>
                                {referral.birth_date && (
                                  <div className="text-xs text-muted-foreground">
                                    DOB: {formatDate(referral.birth_date)}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm space-y-1">
                                  {referral.address && (
                                    <div className="text-xs text-muted-foreground mb-1">{referral.address}</div>
                                  )}
                                  {referral.phone && (
                                    <div className="flex items-center gap-1 text-xs">
                                      <Phone className="h-3 w-3" />
                                      {referral.phone}
                                    </div>
                                  )}
                                  {referral.email && (
                                    <div className="flex items-center gap-1 text-xs">
                                      <Mail className="h-3 w-3" />
                                      {referral.email}
                                    </div>
                                  )}
                                  {referral.medical_assistance_provider && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Provider: {referral.medical_assistance_provider}
                                    </div>
                                  )}
                                  {referral.gender && (
                                    <div className="text-xs text-muted-foreground">
                                      Gender: {referral.gender}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">{formatDate(referral.referral_date)}</td>
                              <td className="px-4 py-3 text-sm">{formatDate(referral.completed_date)}</td>
                              <td className="px-4 py-3 text-sm">
                                <div>{referral.referrer_name || 'N/A'}</div>
                                {referral.referrer_agency && (
                                  <div className="text-xs text-muted-foreground">{referral.referrer_agency}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-background dark:bg-background/98 border-t border-border/50 dark:border-border/70 py-8 mt-auto">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm text-foreground/70 dark:text-foreground/80">
              © {new Date().getFullYear()} The Worx. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Names Dialog - Shows when clicking on count */}
        <Dialog open={showNamesDialog} onOpenChange={setShowNamesDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Completed Referrals ({completedCount})</DialogTitle>
              <DialogDescription>
                Click on a name to view full details
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : completedReferrals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed referrals found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedReferrals.map((referral) => (
                    <div
                      key={referral.id}
                      onClick={() => {
                        console.log('Dialog name clicked, referral data:', referral);
                        console.log('Referral ID:', referral.id, 'Type:', typeof referral.id);
                        
                        // Convert to number if it's a string
                        const idToCheck = typeof referral.id === 'string' 
                          ? parseInt(referral.id, 10) 
                          : referral.id;
                        
                        if (idToCheck && !isNaN(idToCheck) && isFinite(idToCheck) && idToCheck > 0) {
                          setShowNamesDialog(false);
                          handleNameClick(idToCheck);
                        } else {
                          console.error('Invalid referral ID in dialog click:', referral.id, 'Converted:', idToCheck);
                          toast.error('Invalid referral ID', {
                            description: `Cannot load details for this referral. ID: ${referral.id}`,
                          });
                        }
                      }}
                      className="p-4 rounded-lg border border-border hover:bg-primary/10 hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <div className="font-semibold text-lg">{referral.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {referral.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {referral.email}
                          </span>
                        )}
                        {referral.cell_phone && (
                          <span className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {referral.cell_phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Completed: {formatDate(referral.completed_date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Details Dialog - Shows full referral details */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Referral Details</DialogTitle>
              <DialogDescription>
                Complete information for referral #{selectedReferral?.referral?.id}
              </DialogDescription>
            </DialogHeader>
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedReferral ? (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {/* Personal Information */}
                  {selectedReferral.personalInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold">{selectedReferral.personalInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pronouns</p>
                          <p>{selectedReferral.personalInfo.pronouns || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                          <p>{formatDate(selectedReferral.personalInfo.birth_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Gender</p>
                          <p>{selectedReferral.personalInfo.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Race</p>
                          <p>{selectedReferral.personalInfo.race}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedReferral.personalInfo.email || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cell Phone</p>
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.personalInfo.cell_phone || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Address</p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedReferral.personalInfo.address || 'N/A'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Referrer Information */}
                  {selectedReferral.referrer && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Referrer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold">{selectedReferral.referrer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Title</p>
                          <p>{selectedReferral.referrer.title || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Agency</p>
                          <p>{selectedReferral.referrer.agency || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p>{selectedReferral.referrer.email || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Emergency Contact */}
                  {selectedReferral.emergencyContact && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold">{selectedReferral.emergencyContact.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                          <p>{selectedReferral.emergencyContact.relationship || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p>{selectedReferral.emergencyContact.phone || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Screening Information */}
                  {selectedReferral.screeningInfo && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Screening Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Drug of Choice</p>
                          <p>{selectedReferral.screeningInfo.drug_of_choice || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                          <p>{selectedReferral.screeningInfo.medical_conditions || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Mental Health Conditions</p>
                          <p>{selectedReferral.screeningInfo.mental_health_conditions || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Priority Populations */}
                  {selectedReferral.priorityPopulations && selectedReferral.priorityPopulations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Priority Populations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedReferral.priorityPopulations.map((pop, idx) => (
                            <Badge key={idx} variant="secondary">{pop}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No details available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;

