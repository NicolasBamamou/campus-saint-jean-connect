import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

export const EditProfile = () => {
    const { user, profile } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.profile_picture_url || null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            if (!user) {
                throw new Error('User not found');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_picture_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                throw updateError;
            }

            setAvatarUrl(publicUrl);
            toast.success('Profile picture updated successfully!');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative w-32 h-32 mx-auto">
                <Avatar className="w-32 h-32 text-4xl">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback>
                        {profile?.first_name?.[0]}
                        {profile?.last_name?.[0]}
                    </AvatarFallback>
                </Avatar>
                <Label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <Camera className="w-5 h-5" />
                    <Input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        accept="image/*"
                        disabled={uploading}
                    />
                </Label>
            </div>
            {uploading && <p className="text-center">Uploading...</p>}
            
            {/* Add other profile fields here if needed */}
        </div>
    );
}; 