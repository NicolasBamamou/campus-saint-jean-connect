
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Trophy, Users, Bell, FileText } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
}

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  // Mock data - will be replaced with real data from Supabase
  const studentInfo = {
    classe: "1ère S",
    annee: "2023-2024",
    photo: "",
    moyenne: 14.5
  };

  const courses = [
    { id: 1, nom: "Mathématiques", professeur: "M. Dubois", moyenne: 15.2, coefficient: 4 },
    { id: 2, nom: "Physique-Chimie", professeur: "Mme Martin", moyenne: 13.8, coefficient: 3 },
    { id: 3, nom: "Français", professeur: "M. Bernard", moyenne: 14.5, coefficient: 4 },
    { id: 4, nom: "Histoire-Géographie", professeur: "Mme Petit", moyenne: 16.1, coefficient: 3 },
    { id: 5, nom: "Anglais", professeur: "M. Wilson", moyenne: 12.9, coefficient: 3 }
  ];

  const recentGrades = [
    { matiere: "Mathématiques", note: 16, sur: 20, date: "2024-01-15", type: "Contrôle" },
    { matiere: "Physique", note: 14, sur: 20, date: "2024-01-12", type: "TP" },
    { matiere: "Français", note: 15, sur: 20, date: "2024-01-10", type: "Dissertation" }
  ];

  const attendance = {
    present: 142,
    absent: 3,
    retard: 1,
    total: 146
  };

  const announcements = [
    { id: 1, titre: "Réunion parents-professeurs", date: "2024-01-20", urgent: true },
    { id: 2, titre: "Sortie pédagogique - Musée des Sciences", date: "2024-01-25", urgent: false },
    { id: 3, titre: "Examens de mi-trimestre", date: "2024-02-01", urgent: true }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Section */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={studentInfo.photo} />
              <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800">{user.name}</h2>
              <p className="text-gray-600">Classe: {studentInfo.classe}</p>
              <p className="text-gray-600">Année scolaire: {studentInfo.annee}</p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Moyenne générale: {studentInfo.moyenne}/20
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Grades */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Trophy className="h-5 w-5" />
                <span>Notes Récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Matière</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Note</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentGrades.map((grade, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{grade.matiere}</td>
                        <td className="px-4 py-3">
                          <Badge variant={grade.note >= 14 ? "default" : grade.note >= 10 ? "secondary" : "destructive"}>
                            {grade.note}/{grade.sur}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{grade.type}</td>
                        <td className="px-4 py-3 text-gray-600">{grade.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Courses */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <BookOpen className="h-5 w-5" />
                <span>Mes Matières</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900">{course.nom}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.professeur}</p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-green-100 text-green-800">
                          Coef. {course.coefficient}
                        </Badge>
                        <span className="font-medium text-green-600">
                          {course.moyenne}/20
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Attendance */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Calendar className="h-5 w-5" />
                <span>Présences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Présent</span>
                <Badge className="bg-green-100 text-green-800">{attendance.present}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Absent</span>
                <Badge variant="destructive">{attendance.absent}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retard</span>
                <Badge variant="secondary">{attendance.retard}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Taux de présence</span>
                  <span className="text-green-600">
                    {((attendance.present / attendance.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Bell className="h-5 w-5" />
                <span>Annonces</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-green-500 pl-3 py-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm text-gray-900">{announcement.titre}</h4>
                    {announcement.urgent && (
                      <Badge variant="destructive" className="ml-2 text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{announcement.date}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 text-green-600 border-green-600 hover:bg-green-50">
                Voir toutes les annonces
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
