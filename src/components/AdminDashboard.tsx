
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BookOpen, Calendar, Settings, Plus, TrendingUp, School, UserPlus } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
}

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  // Mock data - will be replaced with real data from Supabase
  const schoolStats = {
    totalStudents: 342,
    totalTeachers: 28,
    totalClasses: 15,
    averageGrade: 13.8,
    attendanceRate: 94.2
  };

  const recentUsers = [
    { nom: "Sophie Martin", role: "Élève", classe: "2nde A", dateInscription: "2024-01-15" },
    { nom: "Pierre Dubois", role: "Enseignant", matiere: "Sciences", dateInscription: "2024-01-10" },
    { nom: "Claire Bernard", role: "Élève", classe: "1ère L", dateInscription: "2024-01-08" }
  ];

  const systemAlerts = [
    { type: "warning", message: "5 élèves ont plus de 3 absences ce mois", urgent: true },
    { type: "info", message: "Mise à jour système programmée dimanche", urgent: false },
    { type: "success", message: "Sauvegarde automatique effectuée", urgent: false }
  ];

  const classesOverview = [
    { niveau: "6ème", eleves: 78, classes: 3, moyenne: 14.2 },
    { niveau: "5ème", eleves: 72, classes: 3, moyenne: 13.8 },
    { niveau: "4ème", eleves: 69, classes: 3, moyenne: 13.1 },
    { niveau: "3ème", eleves: 65, classes: 3, moyenne: 12.9 },
    { niveau: "2nde", eleves: 58, classes: 3, moyenne: 13.5 }
  ];

  const monthlyStats = [
    { mois: "Oct", eleves: 340, moyenne: 13.5 },
    { mois: "Nov", eleves: 341, moyenne: 13.7 },
    { mois: "Déc", eleves: 342, moyenne: 13.8 },
    { mois: "Jan", eleves: 342, moyenne: 13.8 }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Section */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-green-800">{user.name}</h2>
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
            <div className="text-2xl font-bold text-green-800">{schoolStats.totalStudents}</div>
            <div className="text-sm text-gray-600">Élèves</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <School className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{schoolStats.totalTeachers}</div>
            <div className="text-sm text-gray-600">Enseignants</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{schoolStats.totalClasses}</div>
            <div className="text-sm text-gray-600">Classes</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{schoolStats.averageGrade}</div>
            <div className="text-sm text-gray-600">Moyenne école</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{schoolStats.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Présences</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Classes Overview */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center justify-between text-green-800">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Vue d'ensemble des classes</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle classe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Niveau</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Élèves</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Classes</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Moyenne</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {classesOverview.map((niveau, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{niveau.niveau}</td>
                        <td className="px-4 py-3 text-gray-600">{niveau.eleves}</td>
                        <td className="px-4 py-3 text-gray-600">{niveau.classes}</td>
                        <td className="px-4 py-3">
                          <Badge variant={niveau.moyenne >= 14 ? "default" : niveau.moyenne >= 12 ? "secondary" : "destructive"}>
                            {niveau.moyenne}/20
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">Gérer</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Users className="h-5 w-5" />
                <span>Nouveaux utilisateurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {user.nom.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.nom}</p>
                        <p className="text-sm text-gray-600">
                          {user.role} {user.classe && `- ${user.classe}`} {user.matiere && `- ${user.matiere}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{user.dateInscription}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Gérer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Settings className="h-5 w-5" />
                <span>Alertes système</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'info' ? 'border-blue-500 bg-blue-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-800">{alert.message}</p>
                    {alert.urgent && (
                      <Badge variant="destructive" className="ml-2 text-xs">Urgent</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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

          {/* Monthly Evolution */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                <span>Évolution mensuelle</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{stat.mois}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{stat.eleves} élèves</div>
                      <div className="text-xs text-green-600">{stat.moyenne}/20</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
