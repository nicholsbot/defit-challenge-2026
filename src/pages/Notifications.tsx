import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Loader2, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare,
  Trash2,
  CheckCheck,
  Filter,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  log_id: string | null;
  log_type: string | null;
  log_date: string | null;
  admin_comment: string | null;
  is_read: boolean;
  created_at: string;
}

type ReadFilter = 'all' | 'unread';
type TypeFilter = 'all' | 'verified' | 'flagged';
type DateGroup = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'older';

const DATE_GROUP_LABELS: Record<DateGroup, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  older: 'Older',
};

const ITEMS_PER_PAGE = 10;

export default function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;

      try {
        setLoading(true);
        let query = supabase
          .from('notifications')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (readFilter === 'unread') {
          query = query.eq('is_read', false);
        }

        if (typeFilter !== 'all') {
          query = query.eq('type', typeFilter);
        }

        // Pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) throw error;
        setNotifications((data as Notification[]) || []);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchNotifications();
    }
  }, [user, readFilter, typeFilter, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [readFilter, typeFilter]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (currentPage === 1) {
            setNotifications((prev) => [payload.new as Notification, ...prev.slice(0, ITEMS_PER_PAGE - 1)]);
            setTotalCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentPage]);

  const markAsRead = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', ids);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, is_read: true } : n))
      );
      setSelectedIds(new Set());
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotifications = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
      setTotalCount((prev) => prev - ids.length);
      setSelectedIds(new Set());
      toast.success('Notifications deleted');
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }

    // Navigate to workout history with highlight params if log exists
    if (notification.log_id && notification.log_type) {
      navigate(`/workout-history?highlight=${notification.log_id}&type=${notification.log_type}`);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === notifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'flagged':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>;
      case 'flagged':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Flagged</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{type}</Badge>;
    }
  };

  const getDateGroup = (dateStr: string): DateGroup => {
    const date = new Date(dateStr);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOfWeek = new Date(startOfToday.getTime() - 7 * 86400000);
    const startOfMonth = new Date(startOfToday.getTime() - 30 * 86400000);

    if (date >= startOfToday) return 'today';
    if (date >= startOfYesterday) return 'yesterday';
    if (date >= startOfWeek) return 'thisWeek';
    if (date >= startOfMonth) return 'thisMonth';
    return 'older';
  };

  const groupedNotifications = useMemo(() => {
    const groups: Record<DateGroup, Notification[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };

    notifications.forEach((notification) => {
      const group = getDateGroup(notification.created_at);
      groups[group].push(notification);
    });

    return groups;
  }, [notifications]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background texture-canvas flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background texture-canvas">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="container px-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                <span>Notification <span className="text-gradient">Center</span></span>
              </h1>
              <p className="text-muted-foreground mt-2">
                {totalCount > 0
                  ? `${totalCount} notification${totalCount > 1 ? 's' : ''} total`
                  : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="pb-4">
        <div className="container px-4">
          <div className="glass rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedIds.size === notifications.length && notifications.length > 0}
                  onCheckedChange={selectAll}
                  aria-label="Select all"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
                </span>
              </div>
              
              {selectedIds.size > 0 ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(Array.from(selectedIds))}
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteNotifications(Array.from(selectedIds))}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ) : unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark All Read
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={readFilter} onValueChange={(v) => setReadFilter(v as ReadFilter)}>
                <SelectTrigger className="w-28 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                <SelectTrigger className="w-32 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="pb-8">
        <div className="container px-4">
          {notifications.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-heading font-bold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {readFilter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : typeFilter !== 'all'
                  ? `No ${typeFilter} notifications found.`
                  : 'No notifications yet. They will appear here when your logs are reviewed.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(['today', 'yesterday', 'thisWeek', 'thisMonth', 'older'] as DateGroup[]).map((group) => {
                const groupNotifications = groupedNotifications[group];
                if (groupNotifications.length === 0) return null;

                return (
                  <div key={group}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
                      {DATE_GROUP_LABELS[group]}
                    </h3>
                    <div className="space-y-3">
                      {groupNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`glass rounded-xl p-4 border transition-all ${
                            notification.is_read
                              ? 'border-border/50 opacity-80'
                              : 'border-primary/30 bg-primary/5'
                          } ${selectedIds.has(notification.id) ? 'ring-2 ring-primary' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={selectedIds.has(notification.id)}
                              onCheckedChange={() => toggleSelect(notification.id)}
                              className="mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            <button
                              onClick={() => handleNotificationClick(notification)}
                              className="flex-1 text-left flex items-start gap-4 min-w-0"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {getTypeIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h3>
                                  {getTypeBadge(notification.type)}
                                  {!notification.is_read && (
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                
                                {notification.admin_comment && (
                                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-2">
                                    <p className="text-sm text-amber-200">
                                      <strong>Admin Comment:</strong> {notification.admin_comment}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>{formatDate(notification.created_at)}</span>
                                  {notification.log_type && notification.log_date && (
                                    <span className="capitalize">
                                      {notification.log_type} • {new Date(notification.log_date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {notification.log_id && (
                                    <span className="text-primary flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3" />
                                      View Log
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead([notification.id]);
                                  }}
                                  title="Mark as read"
                                >
                                  <CheckCheck className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotifications([notification.id]);
                                }}
                                className="text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="pb-16">
          <div className="container px-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
