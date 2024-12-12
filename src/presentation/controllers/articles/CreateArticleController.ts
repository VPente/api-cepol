import { CreateArticleUseCase } from 'application/use-cases/articles/CreateArticleUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ArticleRepository } from 'infrastructure/database/repositories/articles/ArticleRepository';
import { z } from 'zod';

const articleRepository = new ArticleRepository();

export class CreateArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Create a new article',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            title: z.string().min(1, { message: 'Title is required' }),
                            content: z.string().min(1, { message: 'Content is required' }),
                            fileUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Article created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                title: z.string(),
                                content: z.string(),
                                fileUrl: z.string().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            }),
                        }),
                    },
                },
            },
            '400': {
                description: 'Invalid input',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    };

    async handle(c) {
        const data = await this.getValidatedData<typeof this.schema>();

        const { title, content, fileUrl } = data.body;

        try {
            const createArticleUseCase = new CreateArticleUseCase(articleRepository);

            const article = await createArticleUseCase.execute({ title, content, fileUrl });

            return {
                success: true,
                result: {
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    fileUrl: article.fileUrl,
                    createdAt: article.createdAt.toISOString(),
                    updatedAt: article.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Article creation failed',
            };
        }
    }
}