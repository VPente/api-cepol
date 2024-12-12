
import supabase from 'shared/config/supabaseClient';

export const Authorization = async (c: any, next: () => Promise<void>) => {
    const authHeader = c.req.headers?.get('authorization');

    if (!authHeader) {
        await c.json({ message: 'Authorization header is missing' }, 401);
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        await c.json({ message: 'Token is missing' }, 401);
        return;
    }

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
        await c.json({ message: 'Invalid token', error: error.message }, 403);
        return;
    }
    console.log('user', user);
    c.set('user', user);
    await next();
}
