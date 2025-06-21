
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Calendar, Plus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface TeacherDashboardProps {
  user: Profile;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  student_count: number;
  subject_name: string;
}

const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, [user.id]);

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher's courses and classes
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          id,
          classes!inner(id, name, level),
          subjects!inner(name)
        `)
        .eq('teacher_id', user.id);

      if (coursesData) {
        // Get student counts for each class
        const classesWithCounts = await Promise.all(
          coursesData.map(async (course) => {
            const { count } = await supabase
              .from('student_classes')
              .select('*', { count: 'exact' })
              .eq('class_id', course.classes.id);

            return {
              id: course.classes.id,
              name: course.classes.name,
              level: course.classes.level,
              student_count: count || 0,
              subject_name: course.subjects.name
            };
          })
        );

        setClasses(classesWithCounts);

        // Calculate total students
        const totalStudents = classesWithCounts.reduce((sum, cls) => sum + cls.student_count, 0);
        
        setStats(prev => ({
          ...prev,
          totalStudents,
          totalClasses: classesWithCounts.length
        }));
      }

      // Fetch average grades for teacher's courses
      const { data: gradesData } = await supabase
        .from('grades')
        .select('grade_value, courses!inner(teacher_id)')
        .eq('courses.teacher_id', user.id);

      if (gradesData && gradesData.length > 0) {
        const avgGrade = gradesData.reduce((sum, grade) => sum + grade.grade_value, 0) / gradesData.length;
        setStats(prev => ({ ...prev, averageGrade: avgGrade }));
      }

    } catch (error) {
      console.error('Error fetching teacher data:', error);
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
                <p className="text-gray-600">Enseignant</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {classes.map((cls) => (
                    <Badge key={cls.id} className="bg-green-100 text-green-800">
                      {cls.name}
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
            <div className="text-2xl font-bold text-green-800">{stats.totalStudents}</div>
            <div className="text-sm text-gray-600">Élèves total</div>
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
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.averageGrade.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Moyenne générale</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{stats.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Taux présence</div>
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
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {classes.length > 0 ? (
                <div className="grid gap-4">
                  {classes.map((classe) => (
                    <Card key={classe.id} className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{classe.name}</h3>
                            <p className="text-sm text-gray-600">{classe.student_count} élèves</p>
                            <p className="text-sm text-green-600 font-medium">{classe.subject_name}</p>
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
              ) : (
                <div className="text-center text-gray-500">
                  Aucune classe assignée
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
