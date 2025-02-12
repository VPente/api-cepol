export const RateLimit = (options = { limit: 10, window: 1 }) => {
    const requests = new Map();

    return async (c, next) => {
        const ip = c.req.raw.headers.get('CF-Connecting-IP') || c.req.raw.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const entry = requests.get(ip) || { count: 0, startTime: now };

        if (now - entry.startTime > options.window * 1000) {
            requests.set(ip, { count: 1, startTime: now });
        } else {
            entry.count += 1;
            requests.set(ip, entry);
        }

        if (entry.count > options.limit) {
            return c.json({ error: 'Rate limit exceeded' }, 429);
        }

        await next();
    };
};
