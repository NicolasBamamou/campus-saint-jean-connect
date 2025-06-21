import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BookOpen, Settings, Edit, BarChart2, School, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditProfile } from "./EditProfile";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AddClassDialog } from "./AddClassDialog";
import { useNavigate } from "react-router-dom";
import { TeacherManagementSection } from "./TeacherManagementSection";
import { UserProfileCard } from "./UserProfileCard";

// Interfaces
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture_url?: string;
}

interface AdminDashboardProps {
  user: Profile;
}

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageGrade: number;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  profile_picture_url?: string;
  email: string;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  academic_year: string;
}

const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string | number, color: string }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

// InvitePopover component
function InvitePopover({ onSelectRole }: { onSelectRole: (role: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><UserPlus className="h-4 w-4 mr-2" /> Inviter</Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" onClick={() => onSelectRole('admin')}>Administrateur</Button>
          <Button variant="ghost" onClick={() => onSelectRole('teacher')}>Enseignant</Button>
          <Button variant="ghost" onClick={() => onSelectRole('student')}>Élève</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// UserSearchDialog component (UI only for now)
function UserSearchDialog({ open, onOpenChange, role, users, onSelectUser }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
  users: UserData[];
  onSelectUser: (user: UserData) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u =>
    (u.first_name + " " + u.last_name + " " + u.email).toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Choisir un {role === 'teacher' ? 'enseignant' : role === 'student' ? 'élève' : 'administrateur'}</DialogTitle>
        </DialogHeader>
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4" />
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filtered.length === 0 && <div className="text-gray-500 text-center">Aucun résultat</div>}
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => onSelectUser(u)}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={u.profile_picture_url} />
                <AvatarFallback>{u.first_name?.[0]}{u.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{u.first_name} {u.last_name}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [stats, setStats] = useState<SchoolStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    averageGrade: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
    const [inviteRole, setInviteRole] = useState<string | null>(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [allTeachers, setAllTeachers] = useState<UserData[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
        // Fetch all teachers for invite dialog
        (async () => {
          const { data } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role, created_at, profile_picture_url')
            .eq('role', 'teacher');
          if (data) setAllTeachers(data);
        })();
  }, []);

  const fetchAdminData = async () => {
        setLoading(true);
        try {
            const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
            const { count: teacherCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher');
            const { count: classCount } = await supabase.from('classes').select('*', { count: 'exact', head: true });

            const { data: gradesData } = await supabase.from('grades').select('grade_value');
      let averageGrade = 0;
      if (gradesData && gradesData.length > 0) {
                averageGrade = gradesData.reduce((sum, grade) => sum + grade.grade_value, 0) / gradesData.length;
      }

      setStats({
        totalStudents: studentCount || 0,
        totalTeachers: teacherCount || 0,
        totalClasses: classCount || 0,
        averageGrade,
            });

            const { data: recentUsersData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, role, created_at, profile_picture_url')
                .order('created_at', { ascending: false })
                .limit(5);

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
        return <div className="text-center p-8">Chargement des données...</div>;
  }

  return (
         <motion.div 
            className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-purple-50 pb-20 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
             <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                  <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 via-purple-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg mb-2">Tableau de bord Administrateur</h1>
                    <p className="text-gray-500 text-lg">Gestion globale de l'établissement</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <InvitePopover onSelectRole={(role) => {
                      setInviteRole(role);
                      setUserDialogOpen(true);
                    }} />
                    <Button variant="gradient" className="bg-gradient-to-r from-green-500 via-purple-500 to-green-300 text-white font-bold shadow-lg hover:scale-105 transition-transform" onClick={() => navigate("/admin/users")}>Gérer les utilisateurs</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <UserProfileCard user={user} />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-2 gap-6">
                    <StatCard icon={Users} title="Élèves" value={stats.totalStudents} color="text-green-600" />
                    <StatCard icon={School} title="Enseignants" value={stats.totalTeachers} color="text-purple-600" />
                    <StatCard icon={BookOpen} title="Classes" value={stats.totalClasses} color="text-green-500" />
                    <StatCard icon={BarChart2} title="Moyenne École" value={`${stats.averageGrade.toFixed(1)}/20`} color="text-purple-500" />
                  </div>
                </div>

                <Card className="shadow-2xl border-0 rounded-2xl bg-white/70 backdrop-blur-lg mt-10">
                  <CardHeader className="bg-gradient-to-r from-green-100 via-purple-100 to-green-50 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-700"><Users className="text-green-600" /> Utilisateurs Récents</CardTitle>
                      <Button variant="outline">Voir tout</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                       {recentUsers.length > 0 ? (
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Nom</TableHead>
                                      <TableHead>Rôle</TableHead>
                                      <TableHead>Date d'ajout</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {recentUsers.map((u) => (
                                      <TableRow key={u.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:via-purple-50 hover:to-green-100 transition-colors">
                                          <TableCell className="font-medium flex items-center gap-3 py-3">
                                              <Avatar className="h-9 w-9 shadow-md">
                                                  <AvatarImage src={u.profile_picture_url} />
                                                  <AvatarFallback>{u.first_name[0]}{u.last_name[0]}</AvatarFallback>
                                              </Avatar>
                                              <span className="font-semibold text-gray-800">{u.first_name} {u.last_name}</span>
                                          </TableCell>
                                          <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${u.role === "teacher" ? "bg-purple-100 text-purple-700" : u.role === "student" ? "bg-green-100 text-green-700" : "bg-purple-50 text-purple-700"}`}>{u.role}</span>
                                          </TableCell>
                                          <TableCell>{new Date(u.created_at).toLocaleDateString('fr-FR')}</TableCell>
                                          <TableCell className="text-right">
                                               <Button variant="ghost" size="icon">
                                                  <Settings className="h-4 w-4" />
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      ) : (
                          <p className="text-center text-gray-500 py-8">Aucun utilisateur récent.</p>
                      )}
                  </CardContent>
                </Card>
                {/* User search dialog for invite */}
                <UserSearchDialog
                  open={userDialogOpen && !!inviteRole}
                  onOpenChange={setUserDialogOpen}
                  role={inviteRole || ''}
                  users={inviteRole === 'teacher' ? allTeachers : []}
                  onSelectUser={u => {
                    setSelectedUser(u);
                    setUserDialogOpen(false);
                  }}
                />
                {/* Teacher management section */}
                {selectedUser && inviteRole === 'teacher' && (
                  <TeacherManagementSection teacher={selectedUser} onClose={() => setSelectedUser(null)} />
                )}
        </div>
        </motion.div>
  );
};

export default AdminDashboard;
