
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Calendar, FileText, Plus, Edit } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
}

interface TeacherDashboardProps {
  user: User;
}

const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
  // Mock data - will be replaced with real data from Supabase
  const teacherInfo = {
    matiere: "Mathématiques",
    classes: ["1ère S1", "1ère S2", "Terminale S"],
    photo: ""
  };

  const myClasses = [
    { id: 1, nom: "1ère S1", eleves: 28, prochainCours: "Aujourd'hui 10h00" },
    { id: 2, nom: "1ère S2", eleves: 25, prochainCours: "Demain 14h00" },
    { id: 3, nom: "Terminale S", eleves: 22, prochainCours: "Aujourd'hui 15h30" }
  ];

  const recentActivities = [
    { action: "Notes ajoutées", classe: "1ère S1", date: "Il y a 2h", type: "grade" },
    { action: "Présences marquées", classe: "Terminale S", date: "Il y a 3h", type: "attendance" },
    { action: "Devoir créé", classe: "1ère S2", date: "Hier", type: "assignment" }
  ];

  const upcomingTasks = [
    { tache: "Corriger les devoirs de géométrie", classe: "1ère S1", echeance: "Dans 2 jours" },
    { tache: "Préparer le contrôle de trigonométrie", classe: "Terminale S", echeance: "Dans 1 semaine" },
    { tache: "Réunion parents-professeurs", classe: "Toutes", echeance: "Vendredi 16h00" }
  ];

  const quickStats = {
    totalStudents: 75,
    averageGrade: 13.2,
    attendanceRate: 92.5,
    assignmentsPending: 8
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Section */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={teacherInfo.photo} />
                <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-green-800">{user.name}</h2>
                <p className="text-gray-600">Professeur de {teacherInfo.matiere}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacherInfo.classes.map((classe, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {classe}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{quickStats.totalStudents}</div>
            <div className="text-sm text-gray-600">Élèves total</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{quickStats.averageGrade}</div>
            <div className="text-sm text-gray-600">Moyenne générale</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{quickStats.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Taux présence</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{quickStats.assignmentsPending}</div>
            <div className="text-sm text-gray-600">Devoirs à corriger</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center justify-between text-green-800">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Mes Classes</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4">
                {myClasses.map((classe) => (
                  <Card key={classe.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{classe.nom}</h3>
                          <p className="text-sm text-gray-600">{classe.eleves} élèves</p>
                          <p className="text-sm text-green-600 font-medium">{classe.prochainCours}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Présences
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Notes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <FileText className="h-5 w-5" />
                <span>Activités Récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`h-3 w-3 rounded-full ${
                      activity.type === 'grade' ? 'bg-blue-500' :
                      activity.type === 'attendance' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.classe}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Calendar className="h-5 w-5" />
                <span>Tâches à venir</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-3 py-2">
                  <h4 className="font-medium text-sm text-gray-900">{task.tache}</h4>
                  <p className="text-xs text-gray-600">{task.classe}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{task.echeance}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 text-green-600 border-green-600 hover:bg-green-50">
                Voir toutes les tâches
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Créer un devoir
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <Edit className="h-4 w-4 mr-2" />
                Saisir des notes
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <Calendar className="h-4 w-4 mr-2" />
                Marquer présences
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50">
                <FileText className="h-4 w-4 mr-2" />
                Envoyer annonce
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
