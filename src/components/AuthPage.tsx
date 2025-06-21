import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (value: 'student' | 'teacher' | 'admin') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: formData.role
            }
          }
        });

        if (error) throw error;
        setSuccess("Compte créé avec succès! Vérifiez votre email pour confirmer votre inscription.");
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess(null);
        }, 3000);

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        // Automatically close the auth page/modal after login
        onBack(); // <-- Add this line
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Une erreur s'est produite");
      } else {
        setError("Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-blue-300 to-purple-400 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blurred circles for glassmorphism */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-300 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl mx-auto">
        {/* Left Side: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="hidden lg:flex flex-col justify-center items-center bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 mr-8 min-w-[350px] max-w-[400px]"
        >
          <GraduationCap className="h-24 w-24 text-green-700 mb-6 drop-shadow-lg" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
            Groupe Scolaire Saint Jean
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Votre portail numérique pour une éducation connectée et simplifiée.
          </p>
          <Button
            onClick={onBack}
            variant="ghost"
            className="mt-4 text-green-700 hover:bg-green-100/60 font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <div className="absolute bottom-8 text-xs text-gray-500 w-full text-center">
            &copy; {new Date().getFullYear()} Groupe Scolaire Saint Jean.
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "login"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {isSignUp ? "Créer un compte" : "Connexion"}
                  </h2>
                  <p className="text-gray-500 mb-4">
                    {isSignUp
                      ? "Rejoignez la communauté Saint Jean."
                      : "Connectez-vous à votre espace."}
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500 text-green-700">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <AnimatePresence>
                  {isSignUp && (
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Jean" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Dupont" required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="role">Type d'utilisateur</Label>
                        <Select value={formData.role} onValueChange={handleRoleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Élève</SelectItem>
                            <SelectItem value="teacher">Enseignant</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="m@exemple.com"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    {!isSignUp && (
                      <a href="#" className="text-xs font-medium text-green-600 hover:underline">
                        Mot de passe oublié?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-green-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold shadow-lg hover:from-green-600 hover:to-purple-500 transition-all"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : isSignUp ? "Créer le compte" : "Se connecter"}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Vous avez déjà un compte?" : "Vous n'avez pas de compte?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="font-semibold text-green-600 hover:underline"
            >
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </div>

          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full mt-4 text-green-700 hover:text-green-800 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
