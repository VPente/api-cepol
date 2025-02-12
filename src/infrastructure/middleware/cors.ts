import { MiddlewareHandler } from 'hono'

const corsMiddleware: MiddlewareHandler = async (c, next) => {
  const allowedOrigin = 'https://cepol.com.br'
  const requestOrigin = c.req.header('Origin') || ''

  // Verifica se a origem é permitida
  if (requestOrigin !== allowedOrigin) {
    return c.text('CORS: Not Allowed', 403)
  }

  // Adiciona os headers de CORS na resposta
  c.res.headers.append('Access-Control-Allow-Origin', allowedOrigin)
  c.res.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  c.res.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Se for um preflight request (OPTIONS), retorna 204 sem corpo
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }

  await next()
}

export default corsMiddleware
