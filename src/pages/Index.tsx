import AuthPage from "@/components/AuthPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Calendar, BookOpen, Trophy, Bell, LogOut, UserCircle, Settings, LayoutDashboard } from "lucide-react";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useState } from "react";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Index = ({ user, profile, signOut }: { user: any, profile: any, signOut: () => void }) => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (user && profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Groupe Scolaire Saint Jean
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline">
                  Bienvenue, {profile.first_name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.first_name} {profile.last_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {profile.role === 'student' && <StudentDashboard user={profile} />}
          {profile.role === 'teacher' && <TeacherDashboard user={profile} />}
          {profile.role === 'admin' && <AdminDashboard user={profile} />}
        </main>
      </div>
    );
  }

  const featureCards = [
    { icon: Users, title: "Gestion des Utilisateurs", description: "Élèves, enseignants et administrateurs" },
    { icon: BookOpen, title: "Gestion des Cours", description: "Matières, emplois du temps et ressources" },
    { icon: Trophy, title: "Suivi des Notes", description: "Évaluations et bulletins scolaires" },
    { icon: Calendar, title: "Présences", description: "Suivi de l'assiduité des élèves" },
    { icon: Bell, title: "Annonces", description: "Communication école-famille" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 text-gray-800 overflow-x-hidden">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center my-16"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="flex justify-center items-center space-x-4 mb-6"
          >
            <GraduationCap className="h-20 w-20 text-green-600 drop-shadow-lg" />
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                Groupe Scolaire Saint Jean
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Système de Gestion Scolaire Moderne
              </p>
            </div>
          </motion.div>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
            Une plateforme unifiée pour une expérience éducative transparente,
            connectant les élèves, les enseignants et l'administration.
          </p>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              onClick={() => setShowAuth(true)}
              size="lg"
              className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Accéder au portail
            </Button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="my-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Fonctionnalités Clés
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/50 backdrop-blur-lg border-gray-200/50 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-gradient-to-br from-green-200 to-blue-200 rounded-full mb-4">
                      <feature.icon className="h-10 w-10 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
             <motion.div
                key="and-more"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: featureCards.length * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/50 backdrop-blur-lg border-gray-200/50 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <p className="text-2xl font-bold text-gray-700">Et bien plus encore...</p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </section>
        
      </div>
       <footer className="text-center py-8 text-gray-600">
        &copy; {new Date().getFullYear()} Groupe Scolaire Saint Jean. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Index;
