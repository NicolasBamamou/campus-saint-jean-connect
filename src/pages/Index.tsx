
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/AuthPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Calendar, BookOpen, Trophy, Bell } from "lucide-react";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useState } from "react";

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (user && profile) {
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
              <span className="text-sm">Bienvenue, {profile.first_name} {profile.last_name}</span>
              <Button onClick={signOut} variant="outline" className="text-green-600 border-white hover:bg-green-50">
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {profile.role === 'student' && <StudentDashboard user={profile} />}
        {profile.role === 'teacher' && <TeacherDashboard user={profile} />}
        {profile.role === 'admin' && <AdminDashboard user={profile} />}
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
          {/* Login Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl">Accès au Système</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-6">
                Connectez-vous pour accéder à votre espace personnel
              </p>
              <Button 
                onClick={() => setShowAuth(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Se connecter / S'inscrire
              </Button>
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
