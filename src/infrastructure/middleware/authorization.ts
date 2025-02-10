import supabase from 'shared/config/supabaseClient';

export const Authorization = async (c: any, next: () => Promise<void>) => {
    if (c.req.url.includes('/auth') || c.req.url.includes('/public')) {
        return await next();
    }

    const authHeader = c.req.header('authorization') || c.req.header('Authorization');

    if (!authHeader) {
        return await c.json({ message: 'Authorization header is missing' }, 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return await c.json({ message: 'Token is missing' }, 401);
    }

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
        return await c.json({ message: 'Invalid token', error: error.message }, 403);
    }

    c.set('user', user);
    return await next();
}
