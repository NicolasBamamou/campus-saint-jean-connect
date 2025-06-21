
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, BookOpen, Calendar, Settings, Plus, TrendingUp, School, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AdminDashboardProps {
  user: Profile;
}

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageGrade: number;
  attendanceRate: number;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [stats, setStats] = useState<SchoolStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch user statistics
      const { data: studentsData, count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'student');

      const { data: teachersData, count: teacherCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'teacher');

      const { data: classesData, count: classCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact' });

      // Fetch recent users
      const { data: recentUsersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate average grade
      const { data: gradesData } = await supabase
        .from('grades')
        .select('grade_value');

      let averageGrade = 0;
      if (gradesData && gradesData.length > 0) {
        const sum = gradesData.reduce((acc, grade) => acc + grade.grade_value, 0);
        averageGrade = sum / gradesData.length;
      }

      // Calculate attendance rate
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status');

      let attendanceRate = 0;
      if (attendanceData && attendanceData.length > 0) {
        const presentCount = attendanceData.filter(record => record.status === 'present').length;
        attendanceRate = (presentCount / attendanceData.length) * 100;
      }

      setStats({
        totalStudents: studentCount || 0,
        totalTeachers: teacherCount || 0,
        totalClasses: classCount || 0,
        averageGrade,
        attendanceRate
      });

      if (recentUsersData) {
        setRecentUsers(recentUsersData);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Section */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                  {user.first_name[0]}{user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-green-800">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-600">Administrateur - Groupe Scolaire Saint Jean</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Accès complet au système
                </Badge>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
              <Button variant="outline" className="text-green-600 border-green-600">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Statistics */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.totalStudents}</div>
            <div className="text-sm text-gray-600">Élèves</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <School className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.totalTeachers}</div>
            <div className="text-sm text-gray-600">Enseignants</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.totalClasses}</div>
            <div className="text-sm text-gray-600">Classes</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.averageGrade.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Moyenne école</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.attendanceRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Présences</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Users */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Users className="h-5 w-5" />
                <span>Nouveaux utilisateurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-100 text-gray-600">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        <Button variant="outline" size="sm" className="mt-1">
                          Gérer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Aucun nouvel utilisateur
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Management */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Gestion rapide</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter utilisateur
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <BookOpen className="h-4 w-4 mr-2" />
                Gérer les cours
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <Calendar className="h-4 w-4 mr-2" />
                Emplois du temps
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                Rapports & Stats
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
