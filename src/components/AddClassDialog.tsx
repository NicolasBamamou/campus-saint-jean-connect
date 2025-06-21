import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COURSE_LIST } from '@/lib/courseList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AddClassDialogProps {
  onSuccess: () => void;
  teacherId: string;
}

export function AddClassDialog({ onSuccess, teacherId }: AddClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Sous-niveaux (levels) from course list
  const sousNiveaux = Array.from(new Set(COURSE_LIST.map(c => c.sousNiveau)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!level || !name) {
        toast.error('Veuillez remplir tous les champs.');
        setLoading(false);
        return;
      }
      // Compute current academic year (e.g., '2023-2024')
      const now = new Date();
      const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
      const academicYear = `${year}-${year + 1}`;
      const { error } = await supabase.from('classes').insert({
        name,
        level,
        academic_year: academicYear,
        teacher_id: teacherId,
      });
      if (error) throw error;
      toast.success('Classe ajoutée avec succès !');
      setOpen(false);
      setLevel('');
      setName('');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'ajout de la classe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Ajouter une classe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une classe</DialogTitle>
        </DialogHeader>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="block mb-1 font-medium">Sous-niveau</label>
            <Select value={level} onValueChange={setLevel} required>
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
            <label className="block mb-1 font-medium">Nom de la classe</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: 6ème A" required />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter la classe'}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
} 