
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, Calendar, BookOpen, Trophy, Bell } from "lucide-react";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    email: string;
  } | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'student' as 'student' | 'teacher' | 'admin' });

  // Mock login function - will be replaced with Supabase auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock user data - will be replaced with real authentication
    setCurrentUser({
      id: '1',
      name: loginForm.role === 'student' ? 'Marie Dubois' : loginForm.role === 'teacher' ? 'Prof. Martin' : 'Admin Principal',
      role: loginForm.role,
      email: loginForm.email
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ email: '', password: '', role: 'student' });
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-green-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Groupe Scolaire Saint Jean</h1>
                <p className="text-green-100 text-sm">Système de Gestion Scolaire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Bienvenue, {currentUser.name}</span>
              <Button onClick={handleLogout} variant="outline" className="text-green-600 border-white hover:bg-green-50">
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {currentUser.role === 'student' && <StudentDashboard user={currentUser} />}
        {currentUser.role === 'teacher' && <TeacherDashboard user={currentUser} />}
        {currentUser.role === 'admin' && <AdminDashboard user={currentUser} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <GraduationCap className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-4xl font-bold text-green-800">Groupe Scolaire Saint Jean</h1>
              <p className="text-green-600 text-lg">Système de Gestion Scolaire Moderne</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl">Connexion</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="role">Type d'utilisateur</Label>
                  <Select value={loginForm.role} onValueChange={(value: 'student' | 'teacher' | 'admin') => 
                    setLoginForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Élève</SelectItem>
                      <SelectItem value="teacher">Enseignant</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Se connecter
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800 text-center">Fonctionnalités Principales</h2>
            <div className="grid gap-4">
              <Card className="bg-white/80 backdrop-blur border-green-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Gestion des Utilisateurs</h3>
                    <p className="text-sm text-gray-600">Élèves, enseignants et administrateurs</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-green-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Gestion des Cours</h3>
                    <p className="text-sm text-gray-600">Matières, emplois du temps et ressources</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-green-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Trophy className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Suivi des Notes</h3>
                    <p className="text-sm text-gray-600">Évaluations et bulletins scolaires</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-green-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Présences</h3>
                    <p className="text-sm text-gray-600">Suivi de l'assiduité des élèves</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-green-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Bell className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Annonces</h3>
                    <p className="text-sm text-gray-600">Communication école-famille</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
