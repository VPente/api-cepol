import { fromHono } from "chanfana";
import { Hono } from "hono";
import { SignInController, SignOutController } from "presentation/controllers/auth/AuthController";

const app = new Hono();

const openapi = fromHono(app, {
	docs_url: "/",
});

openapi.post('/auth/signin', SignInController);
openapi.post('/auth/signout', SignOutController);

const port = process.env.PORT || 3000;

export default app;
