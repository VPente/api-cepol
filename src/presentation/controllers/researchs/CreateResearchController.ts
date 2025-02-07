import { CreateResearchUseCase } from 'application/use-cases/researchs/CreateResearchUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ResearchRepository } from 'infrastructure/database/repositories/researchs/ResearchRepository';
import { z } from 'zod';

const researchRepository = new ResearchRepository();

export class CreateResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Create a new Research',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            title: z.string().min(1, { message: 'Title is required' }),
                            description: z.string().optional(),
                            bodyText: z.string().optional(),
                            secondText: z.string().optional(),
                            professionalId: z.number().optional(),
                            images: z.array(z.object({
                                url: z.string().url({ message: 'Invalid URL' }).optional(),
                                title: z.string().optional(),
                                description: z.string().optional(),
                            })).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Research created successfully',
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
                                professionalId: z.number().optional(),
                                images: z.array(z.object({
                                    id: z.number(),
                                    researchId: z.number(),
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
        },
    };

    async handle(c) {
        const data = await this.getValidatedData<typeof this.schema>();

        const { title, description, bodyText, secondText, professionalId, images } = data.body;

        try {
            const createResearchUseCase = new CreateResearchUseCase(researchRepository);

            const research = await createResearchUseCase.execute({
                title,
                description,
                bodyText,
                secondText,
                professionalId,
                images: images.map(image => ({
                    url: image.url,
                    title: image.title,
                    description: image.description
                }))
            });

            return {
                success: true,
                result: {
                    id: research.id,
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    images: research.image,
                    createdAt: research.createdAt.toISOString(),
                    updatedAt: research.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Research creation failed',
            };
        }
    }
}