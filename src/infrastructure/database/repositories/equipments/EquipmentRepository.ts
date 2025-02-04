import { createClient } from '@supabase/supabase-js';
import { Equipment } from 'domain/entities/equipments/Equipment';
import { IEquipmentRepository } from 'domain/interfaces/equipments/IEquipmentRepository';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../env';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class EquipmentRepository implements IEquipmentRepository {

    async findById(id: number): Promise<Equipment | null> {
        const { data, error } = await supabase
            .from('Equipment')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data
            ? new Equipment(
                data.id,
                data.name,
                data.description,
                data.imageUrl,
                new Date(data.createdAt),
                data.type
            )
            : null;
    }

    async findAll(): Promise<Equipment[]> {
        const { data, error } = await supabase
            .from('Equipment')
            .select('*');

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((equipment: any) =>
            new Equipment(
                equipment.id,
                equipment.name,
                equipment.description,
                equipment.imageUrl,
                new Date(equipment.createdAt),
                equipment.type
            )
        );
    }

    async create(equipment: Partial<Equipment>): Promise<Equipment> {
        const { data, error } = await supabase
            .from('Equipment')
            .insert([
                {
                    name: equipment.name,
                    description: equipment.description,
                    imageUrl: equipment.imageUrl,
                    createdAt: new Date(),
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create equipment');
        }

        return new Equipment(
            data.id,
            data.name,
            data.description,
            data.imageUrl,
            new Date(data.createdAt),
            data.type
        );
    }

    async update(equipment: Partial<Equipment>): Promise<Equipment> {
        const { data, error } = await supabase
            .from('Equipment')
            .update({
                name: equipment.name,
                description: equipment.description,
                imageUrl: equipment.imageUrl,
            })
            .eq('id', equipment.id)
            .single<Equipment>();

        if (error) {
            console.error(error);
            throw new Error('Failed to update equipment');
        }

        return new Equipment(
            data.id,
            data.name,
            data.description,
            data.imageUrl,
            new Date(data.createdAt),
            data.type
        );
    }

    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from('Equipment')
            .delete()
            .eq('id', id);
        if (error) {
            console.error(error);
            throw new Error('Failed to delete equipment');
        }
    }
}