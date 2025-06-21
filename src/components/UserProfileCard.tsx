import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditProfile } from "./EditProfile";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture_url?: string;
}

export const UserProfileCard = ({ user }: { user: Profile }) => (
    <Card className="shadow-2xl border-0 rounded-2xl bg-white/70 backdrop-blur-lg overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-green-400 via-purple-500 to-green-300" />
      <div className="p-6 flex flex-col items-center -mt-16">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={user.profile_picture_url} />
          <AvatarFallback className="text-3xl bg-gray-200">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mt-4">{user.first_name} {user.last_name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <Badge className={`mt-2 text-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{user.role}</Badge>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              <Edit className="h-4 w-4 mr-2" />
              Modifier le profil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier votre profil</DialogTitle>
            </DialogHeader>
            <EditProfile />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
); 