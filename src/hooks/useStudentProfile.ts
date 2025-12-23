import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useStudentProfile() {
    const { user } = useAuth();
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function checkProfile() {
            if (!user) {
                if (mounted) {
                    setHasProfile(false);
                    setLoading(false);
                }
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('students')
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (mounted) {
                    if (data) {
                        setHasProfile(true);
                    } else {
                        setHasProfile(false);
                    }
                }
            } catch (error) {
                console.error('Error checking student profile:', error);
                if (mounted) setHasProfile(false);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        checkProfile();

        return () => {
            mounted = false;
        };
    }, [user]);

    return { hasProfile, loading };
}
