import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Calendar, Edit, BarChart2, ChevronDown, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditProfile } from "./EditProfile";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCourseDialog } from './AddCourseDialog';
import { AddClassDialog } from './AddClassDialog';
import { UserProfileCard } from "./UserProfileCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Interfaces
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture_url?: string;
}

interface TeacherDashboardProps {
  user: Profile;
}

interface CourseData {
    id: string;
    subject: string;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  student_count: number;
  courses: CourseData[];
  subject_name: string;
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

const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalClasses: 0,
        averageGrade: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeacherData();
    }, [user.id]);

    const handleRemoveCourse = async (courseId: string) => {
        await supabase.from('courses').delete().eq('id', courseId);
        fetchTeacherData();
    };

    const fetchTeacherData = async () => {
        setLoading(true);
        try {
            const { data: classList, error: classError } = await supabase
                .from('classes')
                .select('id, name, level')
                .eq('teacher_id', user.id);
            if (classError) throw classError;

            const classesWithDetails = await Promise.all(
                (classList || []).map(async (cls) => {
                    const { data: courseList } = await supabase
                        .from('courses')
                        .select('id, subject')
                        .eq('class_id', cls.id)
                        .eq('teacher_id', user.id);

                    const { count } = await supabase
                        .from('student_classes')
                        .select('*', { count: 'exact', head: true })
                        .eq('class_id', cls.id);

                    return {
                        id: cls.id,
                        name: cls.name,
                        level: cls.level,
                        student_count: count || 0,
                        courses: (courseList as CourseData[]) || [],
                        subject_name: courseList?.map(c => c.subject).join(', ') || '',
                    };
                })
            );
            setClasses(classesWithDetails);

            // Stats
            const totalStudents = classesWithDetails.reduce((sum, cls) => sum + cls.student_count, 0);
            const totalClasses = classesWithDetails.length;
            // Average grade (same as before)
            const { data: gradesData } = await supabase
                .from('grades')
                .select('grade_value, courses!inner(teacher_id)')
                .eq('courses.teacher_id', user.id);
            let avgGrade = 0;
            if (gradesData && gradesData.length > 0) {
                avgGrade = gradesData.reduce((sum, grade) => sum + grade.grade_value, 0) / gradesData.length;
            }
            setStats({
                totalStudents,
                totalClasses,
                averageGrade: avgGrade,
            });
        } catch (error) {
            console.error('Error fetching teacher data:', error);
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
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 via-purple-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg mb-2">Tableau de bord Enseignant</h1>
                        <p className="text-gray-500 text-lg">Bienvenue, {user.first_name}!</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="md:col-span-1">
                        <UserProfileCard user={user} />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard icon={Users} title="Élèves" value={stats.totalStudents} color="text-green-600" />
                        <StatCard icon={BookOpen} title="Classes" value={stats.totalClasses} color="text-purple-600" />
                        <StatCard icon={BarChart2} title="Moy. des notes" value={`${stats.averageGrade.toFixed(1)}/20`} color="text-green-500" />
                    </div>
                </div>

                <Card className="shadow-2xl border-0 rounded-2xl bg-white/70 backdrop-blur-lg">
                    <CardHeader className="bg-gradient-to-r from-green-100 via-purple-100 to-green-50 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-700"><BookOpen className="text-purple-600" /> Mes Classes</CardTitle>
                            <AddClassDialog onSuccess={fetchTeacherData} teacherId={user.id} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {classes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]"></TableHead>
                                        <TableHead>Classe</TableHead>
                                        <TableHead>Niveau</TableHead>
                                        <TableHead>Matières Principales</TableHead>
                                        <TableHead className="text-center">Élèves</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {classes.map((c) => (
                                      <Collapsible asChild key={c.id}>
                                        <>
                                          <TableRow className="hover:bg-gradient-to-r hover:from-green-50 hover:via-purple-50 hover:to-green-100 transition-colors">
                                            <TableCell>
                                              <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm" disabled={c.courses.length === 0}>
                                                  <ChevronDown className="h-4 w-4" />
                                                  <span className="sr-only">Toggle</span>
                                                </Button>
                                              </CollapsibleTrigger>
                                            </TableCell>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell>{c.level}</TableCell>
                                            <TableCell>{c.subject_name || 'N/A'}</TableCell>
                                            <TableCell className="text-center">{c.student_count}</TableCell>
                                            <TableCell className="text-right flex gap-2 justify-end">
                                                <AddCourseDialog teacherId={user.id} classId={c.id} className={c.name} onSuccess={fetchTeacherData} />
                                                <Button variant="ghost" size="icon" className="mr-2">
                                                    <Calendar className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                          </TableRow>
                                          <CollapsibleContent asChild>
                                            <TableRow>
                                              <TableCell colSpan={6} className="p-0">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                                  <h4 className="font-semibold mb-2 ml-4">Matières enseignées:</h4>
                                                  {c.courses.length > 0 ? (
                                                    <ul className="space-y-1">
                                                      {c.courses.map(course => (
                                                        <li key={course.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                          <span className="ml-4">{course.subject}</span>
                                                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveCourse(course.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                          </Button>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  ) : (
                                                    <p className="text-center text-gray-500 py-4">Aucune matière assignée.</p>
                                                  )}
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          </CollapsibleContent>
                                        </>
                                      </Collapsible>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-gray-500 py-8">Aucune classe assignée pour le moment.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default TeacherDashboard;
