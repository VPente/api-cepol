import { fromHono } from "chanfana";
import { Hono } from "hono";

import { config } from 'dotenv';
import { Authorization } from "infrastructure/middleware/authorization";
import corsMiddleware from "infrastructure/middleware/cors";
import { RateLimit } from "infrastructure/middleware/rateLimit";
import { CreateArticleController, DeleteArticleController, FindAllArticleController, FindByIdArticleController, UpdateArticleController } from "presentation/controllers/articles";
import { SignInController, SignOutController } from "presentation/controllers/auth/AuthController";
import { CreateEquipmentController, DeleteEquipmentController, FindAllEquipmentController, FindByIdEquipmentController, UpdateEquipmentController } from "presentation/controllers/equipments";
import { CreateProfessionalController, DeleteProfessionalController, FindAllProfessionalController, FindByIdProfessionalController, UpdateProfessionalController } from "presentation/controllers/professionals";
import { CreateResearchController, DeleteResearchController, FindAllResearchController, FindByIdResearchController, UpdateResearchController } from "presentation/controllers/researchs";

const app = new Hono();
const openapi = fromHono(app, {
	docs_url: "/",
	schema: {
		security: [
			{
				bearerAuth: [],
			},
		],
	},
});

openapi.registry.registerComponent(
	'securitySchemes',
	'bearerAuth',
	{
		type: 'http',
		scheme: 'bearer',
	},
);

config();

app.use('*', corsMiddleware)

app.use(RateLimit({ limit: 2, window: 1 }));
app.use(Authorization);

app.use((c, next) => {
	c.res.headers.set('Content-Security-Policy', "default-src 'self'");
	c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	c.res.headers.set('X-Content-Type-Options', 'nosniff');
	return next();
});

openapi.post('/auth/signin', SignInController);
openapi.post('/auth/signout', SignOutController);

// article
openapi.get('/public/article', FindAllArticleController);
openapi.get('/public/article/:id', FindByIdArticleController);
openapi.put('/article', UpdateArticleController);
openapi.post('/article', CreateArticleController);
openapi.delete('/article/:id', DeleteArticleController);

//equipment
openapi.get('/public/equipment', FindAllEquipmentController);
openapi.get('/public/equipment/:id', FindByIdEquipmentController);
openapi.put('/equipment', UpdateEquipmentController);
openapi.post('/equipment', CreateEquipmentController);
openapi.delete('/equipment/:id', DeleteEquipmentController);

//professional
openapi.get('/public/professional', FindAllProfessionalController);
openapi.get('/public/professional/:id', FindByIdProfessionalController);
openapi.put('/professional', UpdateProfessionalController);
openapi.post('/professional', CreateProfessionalController);
openapi.delete('/professional/:id', DeleteProfessionalController);

//research
openapi.get('/public/research', FindAllResearchController);
openapi.get('/public/research/:id', FindByIdResearchController);
openapi.put('/research', UpdateResearchController);
openapi.post('/research', CreateResearchController);
openapi.delete('/research/:id', DeleteResearchController);

export default app;
