import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Trophy, Bell, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditProfile } from "./EditProfile";
import { Button } from "@/components/ui/button";
import { UserProfileCard } from "./UserProfileCard";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture_url?: string;
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
    profiles: {
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

interface StudentDashboardProps {
  user: Profile;
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

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance>({ present: 0, absent: 0, late: 0, total: 0 });
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

      if (gradesData) setGrades(gradesData as Grade[]);

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
          if (record.status === 'present' || record.status === 'absent' || record.status === 'late') {
            acc[record.status]++;
          }
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
    if (grades.length === 0) return "N/A";
    const sum = grades.reduce((acc, grade) => acc + grade.grade_value, 0);
    return (sum / grades.length).toFixed(1);
  };
  
  const attendancePercentage = attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0;

  if (loading) {
    return <div className="text-center p-8">Chargement des données...</div>;
  }

  const getGradeBadgeVariant = (grade: number): "default" | "secondary" | "destructive" => {
    if (grade >= 14) return "default"; // Corresponds to 'success'
    if (grade >= 10) return "secondary"; // Corresponds to 'warning'
    return "destructive";
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-purple-50 pb-20 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 via-purple-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg mb-2">Tableau de bord Étudiant</h1>
            <p className="text-gray-500 text-lg">Bienvenue, {user.first_name}!</p>
          </div>
        </div>

        {/* Profile & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-1">
            <UserProfileCard user={user} />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={Trophy} title="Moyenne Générale" value={`${calculateAverage()}/20`} color="text-yellow-500" />
            <StatCard icon={Calendar} title="Présence" value={`${attendancePercentage}%`} color="text-green-500" />
            <StatCard icon={BookOpen} title="Matières" value={courses.length} color="text-blue-500" />
          </div>
        </div>

        {/* Recent Grades & Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-2xl border-0 rounded-2xl bg-white/70 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-green-100 via-purple-100 to-green-50 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-700"><Trophy className="text-yellow-500" /> Notes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:via-purple-50 hover:to-green-100 transition-colors">
                        <TableCell className="font-medium">{grade.courses?.subjects?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getGradeBadgeVariant(grade.grade_value)}>
                            {grade.grade_value}/20
                          </Badge>
                        </TableCell>
                        <TableCell>{grade.grade_type}</TableCell>
                        <TableCell>{new Date(grade.date_assigned).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune note pour le moment.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 rounded-2xl bg-white/70 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-green-100 via-purple-100 to-green-50 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-700"><BookOpen className="text-blue-500" /> Mes Matières</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière</TableHead>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Coefficient</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:via-purple-50 hover:to-green-100 transition-colors">
                        <TableCell className="font-medium">{course.subjects?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {course.classes?.profiles?.first_name} {course.classes?.profiles?.last_name}
                        </TableCell>
                        <TableCell>{course.subjects?.coefficient || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune matière inscrite.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
