import { UpdateArticleUseCase } from 'application/use-cases/articles/UpdateArticleUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ArticleRepository } from 'infrastructure/database/repositories/articles/ArticleRepository';
import { z } from 'zod';

const articleRepository = new ArticleRepository();

export class UpdateArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Update an existing article',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number().min(1, { message: 'ID is required' }),
                            title: z.string().min(1, { message: 'Title is required' }),
                            description: z.string().optional(),
                            bodyText: z.string().optional(),
                            secondText: z.string().optional(),
                            professionalId: z.number().nullable(),
                            images: z.array(z.object({
                                id: z.number().nullable().optional(),
                                articleId: z.number().nullable().optional(),
                                url: z.string().url({ message: 'Invalid URL' }).nonempty({ message: 'URL is required' }),
                                title: z.string().optional(),
                                description: z.string().optional(),
                            })).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Article updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                title: z.string(),
                                description: z.string().nullable(),
                                bodyText: z.string().nullable(),
                                secondText: z.string().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                                professionalId: z.number().nullable(),
                                images: z.array(z.object({
                                    id: z.number().nullable(),
                                    url: z.string().nullable(),
                                    title: z.string().nullable(),
                                    description: z.string().nullable(),
                                    articleId: z.number().nullable()
                                })).nullable(),
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
            '404': {
                description: 'Article not found',
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

        const { id, title, description, bodyText, secondText, professionalId, images } = data.body;

        try {
            const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);

            const article = await updateArticleUseCase.execute({
                id,
                title,
                description,
                bodyText,
                secondText,
                professionalId,
                image: images.map(image => ({
                    id: image.id,
                    url: image.url,
                    title: image.title,
                    description: image.description,
                    articleId: image.articleId
                })),
            });

            return {
                success: true,
                result: {
                    id: article.id,
                    title: article.title,
                    description: article.description,
                    bodyText: article.bodyText,
                    secondText: article.secondText,
                    images: article.images ? article.images.map(image => ({
                        id: image.id,
                        articleId: image.articleId,
                        url: image.url,
                        title: image.title,
                        description: image.description,
                    })) : null,
                    createdAt: article.createdAt.toISOString(),
                    updatedAt: article.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Article update failed',
            };
        }
    }
}