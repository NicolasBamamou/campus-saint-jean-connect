import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COURSE_LIST, CourseListEntry } from '@/lib/courseList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AddCourseDialogProps {
  teacherId: string;
  onSuccess: () => void;
  classId?: string;
  className?: string;
}

interface ClassOption {
  id: string;
  name: string;
  level: string;
}

export function AddCourseDialog({ teacherId, onSuccess, classId, className }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [niveau, setNiveau] = useState('');
  const [sousNiveau, setSousNiveau] = useState('');
  const [matiere, setMatiere] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classId || '');
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtered options
  const niveaux = Array.from(new Set(COURSE_LIST.map(c => c.niveau)));
  const sousNiveaux = Array.from(new Set(COURSE_LIST.filter(c => c.niveau === niveau).map(c => c.sousNiveau)));
  const matieres = Array.from(new Set(COURSE_LIST.filter(c => c.niveau === niveau && c.sousNiveau === sousNiveau).map(c => c.matiere)));

  useEffect(() => {
    if (niveau && sousNiveau && !classId) {
      fetchClasses();
    } else if (classId) {
      setSelectedClassId(classId);
    } else {
      setClasses([]);
      setSelectedClassId('');
    }
  }, [niveau, sousNiveau, classId]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, level')
      .eq('level', sousNiveau);
    if (!error && data) {
      setClasses(data);
    } else {
      setClasses([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subject = COURSE_LIST.find(
        c => c.niveau === niveau && c.sousNiveau === sousNiveau && c.matiere === matiere
      );
      if (!subject || !selectedClassId) {
        toast.error('Veuillez remplir tous les champs.');
        setLoading(false);
        return;
      }

      // Compute current academic year (e.g., '2023-2024')
      const now = new Date();
      const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
      const academicYear = `${year}-${year + 1}`;
      const semester = now.getMonth() >= 7 ? '1' : '2';

      const { error } = await supabase.from('courses').insert({
        class_id: selectedClassId,
        teacher_id: teacherId,
        subject: matiere,
        niveau,
        sous_niveau: sousNiveau,
        academic_year: academicYear,
        semester: semester,
      });
      if (error) {
        // Check for specific RLS error
        if (error.message.includes('violates row-level security policy')) {
          toast.error("Erreur de permission: Vous n'êtes pas autorisé à ajouter ce cours.");
        } else {
          throw error;
        }
      } else {
        toast.success('Cours ajouté avec succès !');
        setOpen(false);
        setNiveau('');
        setSousNiveau('');
        setMatiere('');
        if (!classId) setSelectedClassId('');
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ajout du cours.");
    } finally {
      setLoading(false);
    }
  };

  // If classId is provided, fetch its info for display (if className not provided)
  useEffect(() => {
    if (classId && !className) {
      (async () => {
        const { data } = await supabase.from('classes').select('name, level').eq('id', classId).single();
        if (data) {
          setNiveau(getNiveauFromSousNiveau(data.level));
          setSousNiveau(data.level);
        }
      })();
    } else if (classId && className) {
      // If className is provided, still need to set niveau and sousNiveau
      (async () => {
        const { data } = await supabase.from('classes').select('level').eq('id', classId).single();
        if (data) {
          setNiveau(getNiveauFromSousNiveau(data.level));
          setSousNiveau(data.level);
        }
      })();
    }
  }, [classId, className]);

  // Helper to get niveau from sous-niveau
  function getNiveauFromSousNiveau(sousNiveau: string) {
    const found = COURSE_LIST.find(c => c.sousNiveau === sousNiveau);
    return found ? found.niveau : '';
  }

  // Only enable matiere selection if sousNiveau is set (for classId, this will be auto-set)
  const matiereDisabled = !sousNiveau;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={classId ? 'ghost' : 'default'} className={classId ? '' : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold shadow-lg'}>
          {classId ? 'Ajouter un cours' : 'Ajouter un cours'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un cours {className ? `à ${className}` : ''}</DialogTitle>
        </DialogHeader>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="block mb-1 font-medium">Niveau</label>
            <Select value={niveau} onValueChange={setNiveau} required disabled>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le niveau" />
              </SelectTrigger>
              <SelectContent>
                {niveaux.map(n => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Sous-niveau</label>
            <Select value={sousNiveau} onValueChange={setSousNiveau} required disabled>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le sous-niveau" />
              </SelectTrigger>
              <SelectContent>
                {sousNiveaux.map(sn => (
                  <SelectItem key={sn} value={sn}>{sn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Matière</label>
            <Select value={matiere} onValueChange={setMatiere} required disabled={matiereDisabled}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir la matière" />
              </SelectTrigger>
              <SelectContent>
                {matieres.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!classId && (
            <div>
              <label className="block mb-1 font-medium">Classe</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId} required disabled={!matiere || classes.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={classes.length === 0 ? 'Aucune classe disponible' : 'Choisir la classe'} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name} ({cls.level})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter le cours'}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
} 