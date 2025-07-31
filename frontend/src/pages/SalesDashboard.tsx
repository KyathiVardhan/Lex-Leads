import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Users, LogOut, User, Settings, BarChart3, Target, TrendingUp, Plus, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface SalesUser {
  userName: string;
  role: string;
}

// Activity interface to track different types of activities
interface Activity {
  id: string;
  type: 'lead_created' | 'follow_up_updated' | 'status_changed';
  leadName: string;
  leadEmail: string;
  description: string;
  timestamp: string;
  details?: {
    oldValue?: string;
    newValue?: string;
    followUpText?: string;
    projectName?: string;
    companyName?: string;
  };
}

export default function SalesDashboard() {
  const [user, setUser] = useState<SalesUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      console.log('SalesDashboard auth check:', { token: !!token, role });

      if (!token || role !== 'sales') {
        console.log('Auth failed - redirecting to login');
        navigate('/');
        return;
      }

      try {
        console.log('Verifying token with backend...');
        // Verify token with backend
        const response = await API.get('/login-sales/welcome-sales', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Token verification successful:', response.data);
        setUser(response.data.user);
        
        // Fetch recent activities
        await fetchRecentActivities();
      } catch (error) {
        console.error('Authentication failed:', error);
        console.log('Removing auth data and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Function to fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      // First, get all leads to create activity data
      const leadsResponse = await API.get('/sales/leads');
      const leads = leadsResponse.data.leads || [];
      
      // Create activity data from leads
      const activityData: Activity[] = [];
      
      leads.forEach((lead: any) => {
        // Add lead creation activity
        activityData.push({
          id: `created_${lead._id}`,
          type: 'lead_created',
          leadName: lead.name_of_lead,
          leadEmail: lead.email_of_lead,
          description: 'New lead added',
          timestamp: lead.created_at,
          details: {
            projectName: lead.project_name,
            companyName: lead.company_name
          }
        });

        // Add follow-up conversation activity if it exists
        if (lead.follow_up_conversation && lead.follow_up_conversation.trim()) {
          activityData.push({
            id: `followup_${lead._id}`,
            type: 'follow_up_updated',
            leadName: lead.name_of_lead,
            leadEmail: lead.email_of_lead,
            description: 'Follow-up conversation updated',
            timestamp: lead.updated_at,
            details: {
              followUpText: lead.follow_up_conversation
            }
          });
        }

        // Add status change activity if lead is closed
        if (lead.status === 'Close') {
          activityData.push({
            id: `status_${lead._id}`,
            type: 'status_changed',
            leadName: lead.name_of_lead,
            leadEmail: lead.email_of_lead,
            description: 'Lead status changed to Closed',
            timestamp: lead.updated_at,
            details: {
              oldValue: 'Open',
              newValue: 'Close'
            }
          });
        }
      });

      // Sort activities by timestamp (most recent first)
      activityData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Take only the 5 most recent activities
      setActivities(activityData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback to sample data if API fails
      setActivities([
        {
          id: '1',
          type: 'lead_created',
          leadName: 'John Smith',
          leadEmail: 'john.smith@techcorp.com',
          description: 'New lead added',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          details: {
            projectName: 'Tech Conference 2024',
            companyName: 'TechCorp Solutions'
          }
        },
        {
          id: '2',
          type: 'follow_up_updated',
          leadName: 'Sarah Johnson',
          leadEmail: 'sarah.johnson@innovateai.com',
          description: 'Follow-up conversation updated',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          details: {
            followUpText: 'Discussed pricing options and timeline. Client showed strong interest in premium package.'
          }
        },
        {
          id: '3',
          type: 'status_changed',
          leadName: 'Mike Wilson',
          leadEmail: 'mike.wilson@startup.com',
          description: 'Lead status changed to Closed',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          details: {
            oldValue: 'Open',
            newValue: 'Close'
          }
        }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Function to get activity icon based on type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lead_created':
        return <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />;
      case 'follow_up_updated':
        return <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" />;
      case 'status_changed':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />;
      default:
        return <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />;
    }
  };

  // Function to get activity icon background color
  const getActivityIconBg = (type: Activity['type']) => {
    switch (type) {
      case 'lead_created':
        return 'bg-green-600';
      case 'follow_up_updated':
        return 'bg-blue-600';
      case 'status_changed':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours === 1) {
      return '1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sales Dashboard</h1>
                <p className="text-blue-600 text-sm sm:text-base">Welcome back, {user?.userName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Leads</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="bg-blue-600 p-2 sm:p-3 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-xs sm:text-sm font-medium">Converted</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">456</p>
              </div>
              <div className="bg-emerald-500 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-xs sm:text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">37%</p>
              </div>
              <div className="bg-indigo-500 p-2 sm:p-3 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-xs sm:text-sm font-medium">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="bg-amber-500 p-2 sm:p-3 rounded-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Activities will appear here when you add or update leads</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className={`${getActivityIconBg(activity.type)} p-2 rounded-full flex-shrink-0 mt-1`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium text-sm sm:text-base">
                        {activity.description}
                      </p>
                      <p className="text-blue-600 text-xs sm:text-sm truncate">
                        {activity.leadName} - {activity.leadEmail}
                      </p>
                      
                      {/* Show additional details based on activity type */}
                      {activity.type === 'lead_created' && activity.details?.projectName && (
                        <p className="text-gray-600 text-xs mt-1">
                          Project: {activity.details.projectName} • Company: {activity.details.companyName}
                        </p>
                      )}
                      
                      {activity.type === 'follow_up_updated' && activity.details?.followUpText && (
                        <p className="text-gray-600 text-xs mt-1 italic">
                          "{truncateText(activity.details.followUpText, 80)}"
                        </p>
                      )}
                      
                      {activity.type === 'status_changed' && (
                        <p className="text-gray-600 text-xs mt-1">
                          Status changed from <span className="font-medium text-green-600">{activity.details?.oldValue}</span> to <span className="font-medium text-red-600">{activity.details?.newValue}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/addlead')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <User className="w-4 h-4" />
                <span>Add New Lead</span>
              </button>
              <button onClick={() => navigate('/salespersonreport')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Target className="w-4 h-4" />
                <span>View Reports</span>
              </button>
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 