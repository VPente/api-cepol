import { UpdateProfessionalUseCase } from 'application/use-cases/professionals/UpdateProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ProfessionalRepository } from 'infrastructure/database/repositories/professionals/ProfessionalRepository';
import { z } from 'zod';

const professionalRepository = new ProfessionalRepository();

export class UpdateProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Update an existing professional',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number().min(1, { message: 'ID is required' }),
                            name: z.string().min(1, { message: 'Name is required' }),
                            role: z.string().min(1, { message: 'Role is required' }),
                            bio: z.string().optional(),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Professional updated successfully',
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
                description: 'Professional not found',
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

        const { id, name, role, bio, imageUrl } = data.body;

        try {
            const updateProfessionalUseCase = new UpdateProfessionalUseCase(professionalRepository);

            const professional = await updateProfessionalUseCase.execute({ id, name, role, bio, imageUrl });

            return {
                success: true,
                result: {
                    id: professional.id,
                    name: professional.name,
                    role: professional.role,
                    bio: professional.bio,
                    imageUrl: professional.imageUrl,
                    createdAt: professional.createdAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Professional update failed',
            };
        }
    }
}