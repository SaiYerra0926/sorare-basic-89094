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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch completed referrals when filters change
  useEffect(() => {
    fetchCompletedReferrals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Ensure all referrals have valid data
        const validReferrals = referrals.filter(ref => ref && ref.id != null);
        
        if (validReferrals.length > 0) {
          console.log('Fetched referrals:', validReferrals.length);
        }
        setCompletedReferrals(validReferrals);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotal(response.pagination.total || 0);
        } else {
          setTotalPages(1);
          setTotal(validReferrals.length);
        }
      } else {
        setCompletedReferrals([]);
        setTotalPages(1);
        setTotal(0);
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
    // Convert referral ID to number - handle all possible types
    let numericId: number;
    
    try {
      if (referralId === null || referralId === undefined) {
        throw new Error('Referral ID is null or undefined');
      }
      
      if (typeof referralId === 'string') {
        const parsed = parseInt(referralId.trim(), 10);
        if (isNaN(parsed)) {
          throw new Error(`Cannot parse string ID: "${referralId}"`);
        }
        numericId = parsed;
      } else if (typeof referralId === 'number') {
        numericId = referralId;
      } else if (typeof referralId === 'bigint') {
        numericId = Number(referralId);
      } else {
        // Try to convert to string then parse
        const stringId = String(referralId);
        const parsed = parseInt(stringId, 10);
        if (isNaN(parsed)) {
          throw new Error(`Invalid ID type: ${typeof referralId}, value: ${referralId}`);
        }
        numericId = parsed;
      }
      
      // Final validation
      if (!Number.isInteger(numericId) || numericId <= 0 || !isFinite(numericId)) {
        throw new Error(`Invalid numeric ID: ${numericId}`);
      }
    } catch (error: any) {
      console.error('ID conversion error:', error.message, 'Original ID:', referralId, 'Type:', typeof referralId);
      toast.error('Invalid referral ID', {
        description: `Failed to process referral ID: ${referralId}`,
      });
      return;
    }
    
    console.log('Fetching referral details for ID:', numericId, '(converted from:', referralId, typeof referralId, ')');
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

  const formatDate = (dateString?: string | null) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString || 'N/A';
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
        <nav className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border/40 dark:border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
                  <img src={worxLogo} alt="The Worx Logo" className="h-10 w-auto drop-shadow-md" />
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                    <Home size={18} />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link to="/beginners-guide">
                  <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">Beginners Guide</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="gap-2 font-medium hover:bg-accent/50 transition-all duration-200 hover:scale-105 bg-accent/30">
                  <BarChart3 size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn">
          {/* Page Header */}
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-pink-400">
              Dashboard
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor and manage completed referral forms with comprehensive analytics
            </p>
          </div>

          {/* Completed Referrals Count Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            <Card 
              className="border-2 border-primary/30 dark:border-primary/40 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary/15 via-purple-500/15 to-pink-500/15 dark:from-primary/20 dark:via-purple-500/20 dark:to-pink-500/20 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 rounded-2xl overflow-hidden relative group"
              onClick={handleCountClick}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-extrabold">Completed Referrals</span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">Total forms with completed signatures</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{completedCount}</div>
                <p className="text-sm md:text-base text-muted-foreground font-medium">Click to view details</p>
              </CardContent>
            </Card>

            {/* Search and Filter Card */}
            <Card className="lg:col-span-2 border-border/50 dark:border-border/70 shadow-lg rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    Search & Filter
                  </span>
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
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
          <Card className="border-border/50 dark:border-border/70 shadow-lg rounded-2xl bg-card/80 dark:bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
              <CardTitle className="text-2xl md:text-3xl font-extrabold">Completed Referrals</CardTitle>
              <CardDescription className="text-base">
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
                              className="border-b hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 cursor-pointer group hover:shadow-md"
                              onClick={() => {
                                console.log('Row clicked, referral data:', referral);
                                console.log('Referral ID:', referral.id, 'Type:', typeof referral.id);
                                
                                // Always pass the ID as-is, let handleNameClick handle conversion
                                if (referral.id !== null && referral.id !== undefined) {
                                  handleNameClick(referral.id);
                                } else {
                                  console.error('Referral ID is null or undefined');
                                  toast.error('Invalid referral ID', {
                                    description: 'Referral ID is missing. Cannot load details.',
                                  });
                                }
                              }}
                            >
                              <td className="px-4 py-4">
                                <div className="font-bold text-base group-hover:text-primary transition-colors duration-200">{referral.name || 'N/A'}</div>
                                {referral.birth_date && (
                                  <div className="text-xs text-muted-foreground mt-1">
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
                              <td className="px-4 py-4 text-right">
                                <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
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
        <footer className="bg-gradient-to-t from-background via-background to-background/95 dark:from-background dark:via-background dark:to-background/98 border-t border-border/40 dark:border-border/60 py-10 md:py-12 mt-auto">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={worxLogo} alt="The Worx Logo" className="h-8 w-auto opacity-70" />
              </div>
              <p className="text-sm md:text-base text-foreground/60 dark:text-foreground/70 font-medium">
                © {new Date().getFullYear()} The Worx. All rights reserved.
              </p>
              <p className="text-xs text-foreground/50 dark:text-foreground/60">
                Supporting recovery journeys with comprehensive care and community partnerships
              </p>
            </div>
          </div>
        </footer>

        {/* Names Dialog - Shows when clicking on count */}
        <Dialog open={showNamesDialog} onOpenChange={setShowNamesDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Completed Referrals ({completedCount})
              </DialogTitle>
              <DialogDescription className="text-base">
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
                        
                        // Always pass the ID as-is, let handleNameClick handle conversion
                        if (referral.id !== null && referral.id !== undefined) {
                          setShowNamesDialog(false);
                          handleNameClick(referral.id);
                        } else {
                          console.error('Referral ID is null or undefined');
                          toast.error('Invalid referral ID', {
                            description: 'Referral ID is missing. Cannot load details.',
                          });
                        }
                      }}
                      className="p-4 rounded-xl border border-border/50 hover:bg-gradient-to-r hover:from-primary/10 hover:via-purple-500/10 hover:to-pink-500/10 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
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
          <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Referral Details
              </DialogTitle>
              <DialogDescription className="text-base">
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
                    <Card className="rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                          <div className="p-2 bg-primary rounded-lg">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold">{selectedReferral.personalInfo.name || 'N/A'}</p>
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
                          <p>{selectedReferral.personalInfo.gender || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Race</p>
                          <p>{selectedReferral.personalInfo.race || 'N/A'}</p>
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
                    <Card className="rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
                        <CardTitle className="text-xl font-bold">Referrer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold">{selectedReferral.referrer.name || 'N/A'}</p>
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
                    <Card className="rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
                        <CardTitle className="text-xl font-bold">Emergency Contact</CardTitle>
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
                    <Card className="rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
                        <CardTitle className="text-xl font-bold">Screening Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Drug of Choice</p>
                          <p className="whitespace-pre-wrap">{selectedReferral.screeningInfo.drug_of_choice || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                          <p className="whitespace-pre-wrap">{selectedReferral.screeningInfo.medical_conditions || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Mental Health Conditions</p>
                          <p className="whitespace-pre-wrap">{selectedReferral.screeningInfo.mental_health_conditions || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Priority Populations */}
                  {selectedReferral.priorityPopulations && selectedReferral.priorityPopulations.length > 0 && (
                    <Card className="rounded-xl border-2 border-primary/20 dark:border-primary/30 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10">
                        <CardTitle className="text-xl font-bold">Priority Populations</CardTitle>
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

