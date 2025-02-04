import { CreateProfessionalUseCase } from 'application/use-cases/professionals/CreateProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ProfessionalRepository } from 'infrastructure/database/repositories/professionals/ProfessionalRepository';
import { z } from 'zod';

const professionalRepository = new ProfessionalRepository();

export class CreateProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Create a new Professional',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.string().min(1, { message: 'Name is required' }),
                            role: z.string().min(1, { message: 'Role is required' }),
                            bio: z.string().optional(),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                            hierarchy: z.number().nullable(),
                        }),
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Professional created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                role: z.string(),
                                bio: z.string().nullable(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                hierarchy: z.number().nullable(),
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

        const { name, role, bio, imageUrl, hierarchy } = data.body;

        try {
            const createProfessionalUseCase = new CreateProfessionalUseCase(professionalRepository);

            const professional = await createProfessionalUseCase.execute({ name, role, bio, imageUrl, hierarchy });

            return {
                success: true,
                result: {
                    id: professional.id,
                    name: professional.name,
                    role: professional.role,
                    bio: professional.bio,
                    imageUrl: professional.imageUrl,
                    createdAt: professional.createdAt.toISOString(),
                    hierarchy: professional.hierarchy,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Professional creation failed',
            };
        }
    }
}