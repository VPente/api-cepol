import { IAuthService } from "domain/interfaces/auth/IAuthService";
import supabase from "shared/config/supabaseClient";

export class SupabaseAuthService implements IAuthService {
    async signIn(email: string, password: string): Promise<{ token: string; error?: string }> {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(error.message);
        }

        return { token: data.session?.access_token || '', error: error?.message };
    }

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }
    }
}
