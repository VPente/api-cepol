import { CreateEquipmentUseCase } from 'application/use-cases/equipments/CreateEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { EquipmentRepository } from 'infrastructure/database/repositories/equipments/EquipmentRepository';
import { z } from 'zod';

const equipmentRepository = new EquipmentRepository();

export class CreateEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Create a new Equipment',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.string().min(1, { message: 'Name is required' }),
                            description: z.string().min(1, { message: 'Description is required' }),
                            imageUrl: z.string().url({ message: 'Invalid URL' }).optional(),
                            type: z.string().optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Equipment created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                description: z.string(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                type: z.string().nullable(),
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

        const { name, description, imageUrl, type } = data.body;

        try {
            const createEquipmentUseCase = new CreateEquipmentUseCase(equipmentRepository);

            const equipment = await createEquipmentUseCase.execute({ name, description, imageUrl, type });

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
                message: error.message || 'Equipment creation failed',
            };
        }
    }
}
