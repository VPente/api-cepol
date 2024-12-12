import { UpdateResearchUseCase } from 'application/use-cases/researchs/UpdateResearchUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ResearchRepository } from 'infrastructure/database/repositories/researchs/ResearchRepository';
import { z } from 'zod';

const researchRepository = new ResearchRepository();

export class UpdateResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Update an existing research',
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
                            images: z.array(z.object({
                                id: z.number().nullable().optional(),
                                researchId: z.number().nullable().optional(),
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
                description: 'Research updated successfully',
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
                                images: z.array(z.object({
                                    id: z.number().nullable(),
                                    url: z.string().nullable(),
                                    title: z.string().nullable(),
                                    description: z.string().nullable(),
                                })).nullable(),
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
            '404': {
                description: 'Research not found',
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

        const { id, title, description, bodyText, secondText, images } = data.body;

        try {
            const updateResearchUseCase = new UpdateResearchUseCase(researchRepository);

            const research = await updateResearchUseCase.execute({
                id,
                title,
                description,
                bodyText,
                secondText,
                images: images.map(image => ({
                    id: image.id,
                    url: image.url,
                    title: image.title,
                    description: image.description
                })),
            });

            return {
                success: true,
                result: {
                    id: research.id,
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    images: research.image ? research.image.map(image => ({
                        id: image.id,
                        researchId: image.researchId,
                        url: image.url,
                        title: image.title,
                        description: image.description,
                    })) : null,
                    createdAt: research.createdAt.toISOString(),
                    updatedAt: research.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Research update failed',
            };
        }
    }
}