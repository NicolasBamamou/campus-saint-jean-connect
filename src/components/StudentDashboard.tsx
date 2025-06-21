
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Trophy, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture_url?: string;
}

interface StudentDashboardProps {
  user: Profile;
}

interface Grade {
  id: string;
  grade_value: number;
  grade_type: string;
  date_assigned: string;
  courses: {
    subjects: {
      name: string;
    };
  };
}

interface Course {
  id: string;
  subjects: {
    name: string;
    coefficient: number;
  };
  classes: {
    name: string;
    teacher_profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

interface Attendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance>({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [user.id]);

  const fetchStudentData = async () => {
    try {
      // Fetch recent grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select(`
          id,
          grade_value,
          grade_type,
          date_assigned,
          courses!inner(
            subjects!inner(name)
          )
        `)
        .eq('student_id', user.id)
        .order('date_assigned', { ascending: false })
        .limit(5);

      if (gradesData) setGrades(gradesData);

      // Fetch student's courses through student_classes
      const { data: studentClassesData } = await supabase
        .from('student_classes')
        .select(`
          class_id
        `)
        .eq('student_id', user.id);

      if (studentClassesData) {
        // Get courses for those classes
        const classIds = studentClassesData.map(sc => sc.class_id);
        
        if (classIds.length > 0) {
          const { data: coursesData } = await supabase
            .from('courses')
            .select(`
              id,
              subjects!inner(name, coefficient),
              classes!inner(
                name,
                profiles!classes_teacher_id_fkey(first_name, last_name)
              )
            `)
            .in('class_id', classIds);

          if (coursesData) {
            setCourses(coursesData as Course[]);
          }
        }
      }

      // Calculate attendance
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', user.id);

      if (attendanceData) {
        const stats = attendanceData.reduce((acc, record) => {
          acc[record.status as keyof Attendance]++;
          acc.total++;
          return acc;
        }, { present: 0, absent: 0, late: 0, total: 0 });
        
        setAttendance(stats);
      }

    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.grade_value, 0);
    return (sum / grades.length).toFixed(1);
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
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profile_picture_url} />
              <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                {user.first_name[0]}{user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800">{user.first_name} {user.last_name}</h2>
              <p className="text-gray-600">Élève - Année scolaire 2023-2024</p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Moyenne générale: {calculateAverage()}/20
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
              {grades.length > 0 ? (
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
                      {grades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {grade.courses.subjects.name}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={grade.grade_value >= 14 ? "default" : grade.grade_value >= 10 ? "secondary" : "destructive"}>
                              {grade.grade_value}/20
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-600 capitalize">{grade.grade_type}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(grade.date_assigned).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Aucune note disponible
                </div>
              )}
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
              {courses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900">{course.subjects.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {course.classes.teacher_profiles?.first_name} {course.classes.teacher_profiles?.last_name}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-green-100 text-green-800">
                            Coef. {course.subjects.coefficient}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {course.classes.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Aucun cours inscrit
                </div>
              )}
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
                <Badge variant="secondary">{attendance.late}</Badge>
              </div>
              {attendance.total > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Taux de présence</span>
                    <span className="text-green-600">
                      {((attendance.present / attendance.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
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
            <CardContent className="p-4">
              <div className="text-center text-gray-500">
                Aucune annonce récente
              </div>
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
