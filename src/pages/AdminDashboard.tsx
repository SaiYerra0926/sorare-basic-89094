import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Users, Shield, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  full_name?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  can_access_billing?: boolean;
  can_access_dashboard?: boolean;
  can_access_forms?: boolean;
  can_access_reports?: boolean;
  can_manage_users?: boolean;
}

const AdminDashboard = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    fullName: '',
    isActive: true,
    permissions: {
      can_access_billing: false,
      can_access_dashboard: true,
      can_access_forms: true,
      can_access_reports: false,
      can_manage_users: false,
    },
  });

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.getUsers(token);
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch users', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!token) return;

    if (!formData.username || !formData.email || (!formData.password && !editingUser)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingUser) {
        await api.updateUser(token, editingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          fullName: formData.fullName,
          isActive: formData.isActive,
          permissions: formData.permissions,
        });
        toast.success('User updated successfully');
      } else {
        await api.createUser(token, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          fullName: formData.fullName,
          permissions: formData.permissions,
        });
        toast.success('User created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(editingUser ? 'Failed to update user' : 'Failed to create user', {
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!token) return;

    try {
      await api.deleteUser(token, userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to delete user', {
        description: error.message,
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      fullName: user.full_name || '',
      isActive: user.is_active,
      permissions: {
        can_access_billing: user.can_access_billing || false,
        can_access_dashboard: user.can_access_dashboard !== undefined ? user.can_access_dashboard : true,
        can_access_forms: user.can_access_forms !== undefined ? user.can_access_forms : true,
        can_access_reports: user.can_access_reports || false,
        can_manage_users: user.can_manage_users || false,
      },
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      fullName: '',
      isActive: true,
      permissions: {
        can_access_billing: false,
        can_access_dashboard: true,
        can_access_forms: true,
        can_access_reports: false,
        can_manage_users: false,
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className="min-h-screen w-full py-8 px-4"
      style={{
        background: '#FFFEF7'
      }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                User Management
              </h1>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Manage users, roles, and permissions
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => resetForm()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {editingUser ? 'Edit User' : 'Create New User'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Username *</Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  {!editingUser && (
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Password *</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Full Name</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: 'admin' | 'user') => {
                          setFormData({ 
                            ...formData, 
                            role: value,
                            permissions: {
                              ...formData.permissions,
                              can_access_billing: value === 'admin',
                              can_access_reports: value === 'admin',
                              can_manage_users: value === 'admin',
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                      />
                      <Label htmlFor="isActive" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        Active
                      </Label>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold mb-3 block" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Permissions
                    </Label>
                    <div className="space-y-2">
                      {Object.entries(formData.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              permissions: { ...formData.permissions, [key]: !!checked }
                            })}
                            disabled={formData.role === 'admin'}
                          />
                          <Label htmlFor={key} className="text-sm" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {editingUser ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Users Table */}
        <Card className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Username</TableHead>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Email</TableHead>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Role</TableHead>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Status</TableHead>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Last Login</TableHead>
                    <TableHead style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          {user.username}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            {user.role === 'admin' ? <Shield className="w-3 h-3 inline mr-1" /> : <Users className="w-3 h-3 inline mr-1" />}
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          {formatDate(user.last_login)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={user.id === currentUser?.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete user "{user.username}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

