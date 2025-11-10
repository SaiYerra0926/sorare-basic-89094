import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
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
import worxLogo from '@/assets/Worx-logo (2).png';

interface CompletedReferral {
  id: number;
  name: string;
  pronouns?: string;
  legal_name?: string;
  birth_date?: string;
  is_homeless?: boolean;
  address?: string;
  city_state_zip?: string;
  home_phone?: string;
  phone?: string;
  cell_phone?: string;
  ssn?: string;
  email?: string;
  medical_assistance_id?: string;
  medical_assistance_provider?: string;
  gender?: string;
  gender_other?: string;
  race?: string;
  race_other?: string;
  referral_date: string;
  services?: string[];
  completed_date?: string;
  referrer_name?: string;
  referrer_title?: string;
  referrer_agency?: string;
  referrer_phone?: string;
  referrer_email?: string;
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
  const limit = 5;

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
      const validLimit = (limit > 0 && !isNaN(limit) && isFinite(limit)) ? limit : 5;
      
      // Ensure we're passing valid numbers
      const pageParam = Number.isInteger(validPage) ? validPage : 1;
      const limitParam = Number.isInteger(validLimit) ? validLimit : 5;
      
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

      <div 
        className="min-h-screen w-full flex flex-col"
        style={{
          background: '#FFFEF7'
        }}
      >
        {/* Navigation */}
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
                <span 
                  className="text-base font-normal"
                  style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: '#36454F'
                  }}
                >
                  Dashboard
                </span>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 lg:px-8 py-8 md:py-12 flex-1 animate-fadeIn">
          {/* Page Header */}
          <div className="mb-8 md:mb-12 text-center">
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-gray-800"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              Dashboard
            </h1>
            <p 
              className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto"
              style={{
                fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 400,
                letterSpacing: '0.01em'
              }}
            >
              Monitor and manage completed referral forms with comprehensive analytics
            </p>
          </div>

          {/* Completed Referrals Count Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            <Card 
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 rounded-2xl overflow-hidden relative group backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={handleCountClick}
            >
              <CardHeader className="pb-3 relative z-10">
                <CardTitle 
                  className="flex items-center gap-3 text-xl md:text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  <div className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span>Completed Referrals</span>
                </CardTitle>
                <CardDescription 
                  className="text-sm md:text-base text-gray-100"
                  style={{
                    fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Total forms with completed signatures
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div 
                  className="text-5xl md:text-6xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  {completedCount}
                </div>
                <p 
                  className="text-sm md:text-base text-gray-100 font-medium"
                  style={{
                    fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Click to view details
                </p>
              </CardContent>
            </Card>

            {/* Search and Filter Card */}
            <Card 
              className="lg:col-span-2 border-0 shadow-lg rounded-2xl backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between flex-wrap gap-4 text-white"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    Search & Filter
                  </span>
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-white text-gray-800 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 font-medium"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="text-sm font-semibold">Filters</span>
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
          <Card 
            className="border-0 shadow-lg rounded-2xl overflow-hidden backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardHeader 
              className="backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <CardTitle 
                className="text-2xl md:text-3xl font-extrabold text-white"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Completed Referrals
              </CardTitle>
              <CardDescription 
                className="text-base text-gray-100"
                style={{
                  fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 400
                }}
              >
                Showing {completedReferrals.length} of {total} completed referral forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : completedReferrals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed referrals found</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border border-gray-300/20 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-200/20 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Contact</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Referral Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Completed Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Referrer</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedReferrals.map((referral) => (
                          <tr
                            key={referral.id}
                            className="border-b border-gray-300/20 hover:bg-gray-100/10 transition-all duration-200 cursor-pointer group"
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
                                <div 
                                  className="font-bold text-base text-gray-200 group-hover:text-white transition-colors duration-200"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                >
                                  {referral.name || 'N/A'}
                                </div>
                                {referral.birth_date && (
                                  <div className="text-xs text-gray-200 mt-1 font-medium">
                                    DOB: {formatDate(referral.birth_date)}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm space-y-1">
                                  {referral.address && (
                                    <div className="text-xs text-gray-200 mb-1 font-medium">
                                      <MapPin className="h-3.5 w-3.5 inline mr-1.5 text-gray-200" />
                                      {referral.address}{referral.city_state_zip ? `, ${referral.city_state_zip}` : ''}
                                    </div>
                                  )}
                                  {referral.cell_phone && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                                      <Phone className="h-3.5 w-3.5 text-gray-200" />
                                      {referral.cell_phone}
                                    </div>
                                  )}
                                  {referral.home_phone && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                                      <Phone className="h-3.5 w-3.5 text-gray-200" />
                                      Home: {referral.home_phone}
                                    </div>
                                  )}
                                  {referral.email && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                                      <Mail className="h-3.5 w-3.5 text-gray-200" />
                                      {referral.email}
                                    </div>
                                  )}
                                  {referral.medical_assistance_provider && (
                                    <div className="text-xs text-gray-100 mt-1.5 font-semibold">
                                      Provider: <span className="font-normal">{referral.medical_assistance_provider}</span>
                                    </div>
                                  )}
                                  {referral.gender && (
                                    <div className="text-xs text-gray-100 font-semibold">
                                      Gender: <span className="font-normal">{referral.gender}</span>
                                    </div>
                                  )}
                                  {referral.race && (
                                    <div className="text-xs text-gray-100 font-semibold">
                                      Race: <span className="font-normal">{referral.race}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-200 font-medium">{formatDate(referral.referral_date)}</td>
                              <td className="px-4 py-3 text-sm text-gray-200 font-medium">{formatDate(referral.completed_date)}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="font-semibold text-gray-200 text-base">{referral.referrer_name || 'N/A'}</div>
                                {referral.referrer_title && (
                                  <div className="text-xs text-gray-200 font-medium mt-0.5">{referral.referrer_title}</div>
                                )}
                                {referral.referrer_agency && (
                                  <div className="text-xs text-gray-200 font-medium mt-0.5">{referral.referrer_agency}</div>
                                )}
                                {referral.referrer_email && (
                                  <div className="text-xs text-gray-200 font-medium flex items-center gap-1.5 mt-1">
                                    <Mail className="h-3.5 w-3.5 text-gray-200" />
                                    {referral.referrer_email}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-100 hover:bg-white/20 hover:text-white transition-all duration-200 font-medium"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  {/* Pagination - Always visible at bottom */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300/20">
                    <div 
                      className="text-sm text-gray-300"
                      style={{
                        fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      Showing {completedReferrals.length} of {total} completed referral forms
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                          className="bg-white/10 border-gray-300/30 text-gray-200 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="bg-white/10 border-gray-300/30 text-gray-200 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div 
                          className="px-4 py-2 text-sm text-gray-200 font-medium bg-white/5 rounded-lg"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Page {page} of {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="bg-white/10 border-gray-300/30 text-gray-200 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                          className="bg-white/10 border-gray-300/30 text-gray-200 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer 
          className="py-12 md:py-16 mt-auto"
          style={{
            background: 'linear-gradient(to bottom, #7A6B5A, #2F3F2F)'
          }}
        >
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={worxLogo} alt="The Worx Logo" className="h-8 w-auto" />
                <div className="flex flex-col">
                  <span 
                    className="text-xl font-serif text-white font-bold leading-none"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    The Worx
                  </span>
                  <span 
                    className="text-xs font-sans text-white uppercase tracking-wider mt-1"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    GROUP
                  </span>
                </div>
              </div>
              <p 
                className="text-sm text-gray-300"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                © {new Date().getFullYear()} The Worx Group. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Names Dialog - Shows when clicking on count */}
        <Dialog open={showNamesDialog} onOpenChange={setShowNamesDialog}>
          <DialogContent 
            className="max-w-2xl max-h-[80vh] rounded-2xl border-0 backdrop-blur-md [&>button]:text-gray-700 [&>button]:hover:text-gray-900 [&>button]:hover:bg-gray-100"
            style={{
              background: '#FDFBF2',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <DialogHeader>
              <DialogTitle 
                className="text-2xl md:text-3xl font-extrabold text-gray-800"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Completed Referrals ({completedCount})
              </DialogTitle>
              <DialogDescription 
                className="text-base text-gray-700"
                style={{
                  fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 400
                }}
              >
                Click on a name to view full details
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-700" />
                </div>
              ) : completedReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-700" />
                  <p className="text-gray-700">No completed referrals found</p>
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
                      className="p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      style={{
                        background: '#827C75',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8B857D';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#827C75';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div className="font-semibold text-lg text-white">{referral.name || 'N/A'}</div>
                      <div className="text-sm text-gray-100 mt-1">
                        {referral.email && (
                          <span className="flex items-center gap-1 text-gray-100">
                            <Mail className="h-3 w-3 text-gray-100" />
                            {referral.email}
                          </span>
                        )}
                        {referral.cell_phone && (
                          <span className="flex items-center gap-1 mt-1 text-gray-100">
                            <Phone className="h-3 w-3 text-gray-100" />
                            {referral.cell_phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 mt-1 text-gray-100">
                          <Calendar className="h-3 w-3 text-gray-100" />
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
          <DialogContent 
            className="max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col p-0"
            style={{
              background: '#FDFBF2',
              display: 'flex',
              flexDirection: 'column',
              height: '90vh'
            }}
          >
            {/* Fixed Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <DialogHeader>
                <DialogTitle 
                  className="text-2xl md:text-3xl font-extrabold text-gray-800"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Referral Details
                </DialogTitle>
                <DialogDescription 
                  className="text-base text-gray-700 mt-2"
                  style={{
                    fontFamily: "'Inter', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Complete information for referral #{selectedReferral?.referral?.id}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-hidden min-h-0">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12 h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
                </div>
              ) : selectedReferral ? (
                <ScrollArea className="h-full" style={{ height: 'calc(90vh - 180px)' }}>
                  <div className="px-6 py-6 space-y-6">
                  {/* Referral Information */}
                  {selectedReferral.referral && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Referral Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Referral Date</p>
                          <p className="text-white">{formatDate(selectedReferral.referral.referral_date) || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Services</p>
                          <p className="text-white break-words">
                            {selectedReferral.referral.services && Array.isArray(selectedReferral.referral.services) 
                              ? selectedReferral.referral.services.join(', ')
                              : (selectedReferral.referral.services || 'N/A')}
                          </p>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Created At</p>
                          <p className="text-white">{formatDate(selectedReferral.referral.created_at) || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Personal Information */}
                  {selectedReferral.personalInfo && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="flex items-center gap-2 text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          <div className="p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                            <User className="h-5 w-5 text-white" />
                          </div>
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Name</p>
                          <p className="font-semibold text-white">{selectedReferral.personalInfo.name || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Legal Name</p>
                          <p className="text-white">{selectedReferral.personalInfo.legal_name || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Pronouns</p>
                          <p className="text-white">{selectedReferral.personalInfo.pronouns || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Date of Birth</p>
                          <p className="text-white">{formatDate(selectedReferral.personalInfo.birth_date)}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Gender</p>
                          <p className="text-white">
                            {selectedReferral.personalInfo.gender || 'N/A'}
                            {selectedReferral.personalInfo.gender_other && ` (${selectedReferral.personalInfo.gender_other})`}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Race</p>
                          <p className="text-white">
                            {selectedReferral.personalInfo.race || 'N/A'}
                            {selectedReferral.personalInfo.race_other && ` (${selectedReferral.personalInfo.race_other})`}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Email</p>
                          <p className="flex items-center gap-1 text-white">
                            <Mail className="h-3 w-3" />
                            {selectedReferral.personalInfo.email || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Cell Phone</p>
                          <p className="flex items-center gap-1 text-white">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.personalInfo.cell_phone || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Home Phone</p>
                          <p className="flex items-center gap-1 text-white">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.personalInfo.home_phone || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Address</p>
                          <p className="flex items-center gap-1 text-white break-words">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {selectedReferral.personalInfo.address || 'N/A'}
                            {selectedReferral.personalInfo.city_state_zip && `, ${selectedReferral.personalInfo.city_state_zip}`}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Is Homeless</p>
                          <p className="text-white">{selectedReferral.personalInfo.is_homeless ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Medical Assistance ID</p>
                          <p className="text-white">{selectedReferral.personalInfo.medical_assistance_id || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Medical Assistance Provider</p>
                          <p className="text-white break-words">{selectedReferral.personalInfo.medical_assistance_provider || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Referrer Information */}
                  {selectedReferral.referrer && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Referrer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Name</p>
                          <p className="font-semibold text-white">{selectedReferral.referrer.name || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Title</p>
                          <p className="text-white">{selectedReferral.referrer.title || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Agency</p>
                          <p className="text-white break-words">{selectedReferral.referrer.agency || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Phone</p>
                          <p className="flex items-center gap-1 text-white">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.referrer.phone || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Email</p>
                          <p className="flex items-center gap-1 text-white">
                            <Mail className="h-3 w-3" />
                            {selectedReferral.referrer.email || 'N/A'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Emergency Contact */}
                  {selectedReferral.emergencyContact && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Emergency Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Name</p>
                          <p className="font-semibold text-white">{selectedReferral.emergencyContact.name || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Relationship</p>
                          <p className="text-white">{selectedReferral.emergencyContact.relationship || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Phone</p>
                          <p className="flex items-center gap-1 text-white">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.emergencyContact.phone || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Cell Phone</p>
                          <p className="flex items-center gap-1 text-white">
                            <Phone className="h-3 w-3" />
                            {selectedReferral.emergencyContact.cell_phone || 'N/A'}
                          </p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Address</p>
                          <p className="flex items-center gap-1 text-white break-words">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {selectedReferral.emergencyContact.address || 'N/A'}
                            {selectedReferral.emergencyContact.city_state_zip && `, ${selectedReferral.emergencyContact.city_state_zip}`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Screening Information */}
                  {selectedReferral.screeningInfo && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Screening Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Is Pregnant</p>
                          <p className="text-white">{selectedReferral.screeningInfo.is_pregnant || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Drug of Choice</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.drug_of_choice || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Last Date of Use</p>
                          <p className="text-white">{formatDate(selectedReferral.screeningInfo.last_date_of_use) || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Mental Health Conditions</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.mental_health_conditions || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Diagnosis</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.diagnosis || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Medical Conditions</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.medical_conditions || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Allergies</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.allergies || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Physical Limitations</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.physical_limitations || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Medications</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.medications || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Tobacco User</p>
                          <p className="text-white">{selectedReferral.screeningInfo.tobacco_user || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Criminal Offenses</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.criminal_offenses || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Probation/Parole</p>
                          <p className="whitespace-pre-wrap text-white break-words">{selectedReferral.screeningInfo.probation_parole || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Priority Populations */}
                  {selectedReferral.priorityPopulations && selectedReferral.priorityPopulations.length > 0 && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Priority Populations
                        </CardTitle>
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

                  {/* Applicant Signature */}
                  {selectedReferral.applicantSignature && (
                    <Card 
                      className="rounded-xl border-0 shadow-lg backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(122, 107, 90, 0.7) 0%, rgba(95, 85, 72, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <CardHeader 
                        className="backdrop-blur-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <CardTitle 
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          Applicant Signature
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Signature Date</p>
                          <p className="text-white">{formatDate(selectedReferral.applicantSignature.signature_date) || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
                          <p className="text-sm font-semibold text-gray-200">Signature</p>
                          <p className="text-white">{selectedReferral.applicantSignature.signature ? '✓ Signed' : 'N/A'}</p>
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;

