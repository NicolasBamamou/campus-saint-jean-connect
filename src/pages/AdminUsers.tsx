import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Settings, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TeacherManagementSection } from "../components/TeacherManagementSection";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
}

const roleLabels: Record<string, string> = {
  teacher: "Enseignant",
  student: "Élève",
  admin: "Administrateur",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [manageTeacher, setManageTeacher] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, profile_picture_url");
    setUsers(data || []);
  };

  const filtered = users.filter(u =>
    (filter === "all" || u.role === filter) &&
    (u.first_name + " " + u.last_name + " " + u.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-purple-50 pb-20">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 via-purple-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg mb-2">Gérer les utilisateurs</h1>
            <p className="text-gray-500 text-lg">Administrez tous les membres de l'établissement avec style.</p>
          </div>
          <Button
            variant="gradient"
            className="bg-gradient-to-r from-green-500 via-purple-500 to-green-300 text-white font-bold shadow-lg hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Retour au tableau de bord
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-80 shadow-md focus:ring-2 focus:ring-green-400"
          />
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Tous</Button>
            <Button variant={filter === "teacher" ? "default" : "outline"} onClick={() => setFilter("teacher")}>Enseignants</Button>
            <Button variant={filter === "student" ? "default" : "outline"} onClick={() => setFilter("student")}>Élèves</Button>
            <Button variant={filter === "admin" ? "default" : "outline"} onClick={() => setFilter("admin")}>Administrateurs</Button>
          </div>
        </div>
        <Card className="shadow-2xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-green-100 via-purple-100 to-green-50 rounded-t-2xl">
            <CardTitle className="text-xl font-bold text-gray-700">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">Aucun utilisateur trouvé.</TableCell>
                  </TableRow>
                ) : filtered.map(u => (
                  <TableRow key={u.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:via-purple-50 hover:to-green-100 transition-colors">
                    <TableCell className="flex items-center gap-3 py-4">
                      <Avatar className="h-10 w-10 shadow-md">
                        <AvatarImage src={u.profile_picture_url} />
                        <AvatarFallback>{u.first_name[0]}{u.last_name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-gray-800">{u.first_name} {u.last_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${u.role === "teacher" ? "bg-purple-100 text-purple-700" : u.role === "student" ? "bg-green-100 text-green-700" : "bg-purple-50 text-purple-700"}`}>{roleLabels[u.role] || u.role}</span>
                    </TableCell>
                    <TableCell><span className="text-gray-600">{u.email}</span></TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-purple-100"><Settings className="h-5 w-5" /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="flex flex-col gap-2">
                            {u.role === "teacher" && <Button variant="outline" onClick={() => setManageTeacher(u)}>Gérer les classes/cours</Button>}
                            {u.role === "student" && <Button variant="outline">Gérer la scolarité</Button>}
                            {u.role === "admin" && <Button variant="outline">Gérer l'admin</Button>}
                            <Button variant="destructive">Supprimer</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={!!manageTeacher} onOpenChange={open => !open && setManageTeacher(null)}>
          <DialogContent className="max-w-2xl">
            {manageTeacher && <TeacherManagementSection teacher={manageTeacher} onClose={() => setManageTeacher(null)} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 