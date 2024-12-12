import { UpdateEquipmentUseCase } from 'application/use-cases/equipments/UpdateEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { EquipmentRepository } from 'infrastructure/database/repositories/equipments/EquipmentRepository';
import { z } from 'zod';

const equipmentRepository = new EquipmentRepository();

export class UpdateEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Update an existing equipment',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number().min(1, { message: 'ID is required' }),
                            name: z.string().min(1, { message: 'Name is required' }),
                            description: z.string().optional(),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Equipment updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                description: z.string().nullable(),
                                imageUrl: z.string().nullable(),
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
                description: 'Equipment not found',
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

        const { id, name, description, imageUrl } = data.body;

        try {
            const updateEquipmentUseCase = new UpdateEquipmentUseCase(equipmentRepository);

            const equipment = await updateEquipmentUseCase.execute({ id, name, description, imageUrl });

            return {
                success: true,
                result: {
                    id: equipment.id,
                    name: equipment.name,
                    description: equipment.description,
                    imageUrl: equipment.imageUrl,
                    createdAt: equipment.createdAt.toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Equipment update failed',
            };
        }
    }
}