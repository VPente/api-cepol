type RateLimitStore = {
    [key: string]: { count: number; lastRequestTime: number };
};

const rateLimitStore: RateLimitStore = {};
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 1;

export const RateLimit = async (c, next) => {
    const clientIp = c.req.headers?.['x-real-ip'] || c.req.headers?.['x-forwarded-for'] || c.req.socket?.remoteAddress || c.req.ip;

    console.log("clientIp: ", clientIp);

    if (!clientIp) {
        return c.json({ message: 'Não foi possível identificar o IP do cliente.' }, 400);
    }

    const currentTime = Date.now();
    const clientData = rateLimitStore[clientIp] || { count: 0, lastRequestTime: currentTime };

    if (currentTime - clientData.lastRequestTime > WINDOW_MS) {
        clientData.count = 0;
        clientData.lastRequestTime = currentTime;
    }

    clientData.count += 1;

    rateLimitStore[clientIp] = clientData;

    if (clientData.count > MAX_REQUESTS) {
        await c.json({ message: 'Muitas requisições. Tente novamente mais tarde.' }, 429);
        return;
    }

    await next();
};