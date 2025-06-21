import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddClassDialog } from "./AddClassDialog";
import { supabase } from "@/integrations/supabase/client";
import { AddCourseDialog } from "./AddCourseDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Trash2 } from "lucide-react";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
}

interface CourseData {
  id: string;
  subject: string;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  academic_year: string;
  courses: CourseData[];
}

export function TeacherManagementSection({ teacher, onClose }: { teacher: UserData, onClose: () => void }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassesAndCourses();
    // eslint-disable-next-line
  }, [teacher.id]);

  const fetchClassesAndCourses = async () => {
    setLoading(true);
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, name, level, academic_year')
      .eq('teacher_id', teacher.id);

    if (classError) {
      console.error("Error fetching classes:", classError);
      setClasses([]);
      setLoading(false);
      return;
    }

    if (!classData) {
      setClasses([]);
      setLoading(false);
      return;
    }

    const classesWithCourses = await Promise.all(
      classData.map(async (cls) => {
        const { data: courseData } = await supabase
          .from('courses')
          .select('id, subject')
          .eq('class_id', cls.id);
        return {
          ...cls,
          courses: courseData || []
        };
      })
    );

    setClasses(classesWithCourses);
    setLoading(false);
  };

  const handleRemoveClass = async (classId: string) => {
    await supabase.from('classes').update({ teacher_id: null }).eq('id', classId);
    fetchClassesAndCourses();
  };

  const handleRemoveCourse = async (courseId: string) => {
    await supabase.from('courses').delete().eq('id', courseId);
    fetchClassesAndCourses();
  };

  return (
    <Card className="shadow-lg border-t-4 border-purple-500 mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={teacher.profile_picture_url} />
            <AvatarFallback>{teacher.first_name[0]}{teacher.last_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-bold">{teacher.first_name} {teacher.last_name}</div>
            <div className="text-gray-500 text-sm">{teacher.email}</div>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>Fermer</Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-lg">Classes assignées</div>
          <AddClassDialog onSuccess={fetchClassesAndCourses} teacherId={teacher.id} />
        </div>
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : classes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Aucune classe assignée.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année scolaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(cls => (
                <Collapsible asChild key={cls.id}>
                  <>
                    <TableRow>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={cls.courses.length === 0}>
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{cls.level}</TableCell>
                      <TableCell>{cls.academic_year}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <AddCourseDialog teacherId={teacher.id} classId={cls.id} className={cls.name} onSuccess={fetchClassesAndCourses} />
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveClass(cls.id)}>Retirer</Button>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800">
                            <h4 className="font-semibold mb-2 ml-4">Matières enseignées:</h4>
                            {cls.courses.length > 0 ? (
                              <ul className="space-y-1">
                                {cls.courses.map(course => (
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
        )}
      </CardContent>
    </Card>
  );
} 