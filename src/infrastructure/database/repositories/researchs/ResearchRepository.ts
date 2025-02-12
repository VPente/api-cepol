import { createClient } from '@supabase/supabase-js';
import { Professional } from 'domain/entities/professionals/Professional';
import { Research } from 'domain/entities/researchs/Research';
import { ResearchImage } from 'domain/entities/researchs/ResearchImage';
import { IResearchRepository } from 'domain/interfaces/researchs/IResearchRepository';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../../env';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class ResearchRepository implements IResearchRepository {
    async findById(id: number): Promise<Research | null> {
        const { data, error } = await supabase
            .from('Research')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        const { data: images, error: errorImages } = await supabase
            .from("ResearchImage")
            .select("*")
            .eq("researchId", id);

        if (errorImages) {
            console.error(errorImages);
            return null;
        }

        const { data: professionals, error: errorProfessionals } = await supabase
            .from("Professional")
            .select("*")
            .in("id", data.professionalId);

        if (errorProfessionals) {
            console.error(errorProfessionals);
            return null;
        }

        return data ? new Research(
            data.id,
            data.title,
            data.description,
            data.bodyText,
            data.secondText,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            data.professionalId,
            images ? images.map((image: any) =>
                new ResearchImage(
                    image.id,
                    image.researchId,
                    image.url,
                    image.title,
                    image.description
                )
            ) : null,
            professionals ? professionals.filter((professional: any) => professional.id === data.professionalId).map((professional: any) =>
                new Professional(
                    professional.id,
                    professional.name,
                    professional.email,
                    professional.phone,
                    professional.avatar,
                    professional.createdAt,
                    professional.updatedAt,
                )
            )[0] : null,
        ) : null;
    }

    async findAll(): Promise<Research[]> {
        const { data: researchs, error } = await supabase
            .from('Research')
            .select('*');

        if (error) {
            console.error(error);
            return [];
        }

        const researchIds = researchs.map(research => research.id);

        const { data: images, error: errorImages } = await supabase
            .from("ResearchImage")
            .select("*")
            .in("researchId", researchIds);

        if (errorImages) {
            console.error(errorImages);
            return [];
        }

        const professionalIds = researchs
            .map(research => research.professionalId)
            .filter(professionalId => professionalId !== null);

        const { data: professionals, error: errorProfessionals } = await supabase
            .from("Professional")
            .select("*")
            .in("id", professionalIds);

        if (errorProfessionals) {
            console.error("ErrorProfessionals: ", errorProfessionals);
            return null;
        }

        return researchs.map((research: any) =>
            new Research(
                research.id,
                research.title,
                research.description,
                research.bodyText,
                research.secondText,
                new Date(research.createdAt),
                new Date(research.updatedAt),
                research.professionalId,
                images ? images.filter((image: any) => image.researchId === research.id).map((image: any) =>
                    new ResearchImage(
                        image.id,
                        image.researchId,
                        image.url,
                        image.title,
                        image.description
                    )
                ) : null,
                professionals ? professionals.filter((professional: any) => professional.id === research.professionalId).map((professional: any) =>
                    new Professional(
                        professional.id,
                        professional.name,
                        professional.email,
                        professional.phone,
                        professional.avatar,
                        professional.createdAt,
                        professional.updatedAt,
                    )
                )[0] : null,
            )
        );
    }

    async create(research: Partial<Research & { images?: Partial<ResearchImage>[] }>): Promise<Research> {
        const { data: savedResearch, error } = await supabase
            .from('Research')
            .insert([
                {
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    professionalId: research.professionalId,
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create research');
        }

        if (research.images) {
            const { data: savedImages, error: errorImages }: { data: ResearchImage[] | null, error: any } = await supabase
                .from('ResearchImage')
                .insert(research.images.map(image => ({
                    researchId: savedResearch.id,
                    url: image.url,
                    title: image.title,
                    description: image.description,
                })))
                .select()
                .single();

            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to create research images');
            }

            return new Research(
                savedResearch.id,
                savedResearch.title,
                savedResearch.description,
                savedResearch.bodyText,
                savedResearch.secondText,
                new Date(savedResearch.createdAt),
                new Date(savedResearch.updatedAt),
                savedResearch.professionalId,
                (Array.isArray(savedImages) ? savedImages : []).map((image: any) =>
                    new ResearchImage(
                        image.id,
                        image.researchId,
                        image.url,
                        image.title,
                        image.description
                    )
                ),
                null
            );
        }

        return new Research(
            savedResearch.id,
            savedResearch.title,
            savedResearch.description,
            savedResearch.bodyText,
            savedResearch.secondText,
            new Date(savedResearch.createdAt),
            new Date(savedResearch.updatedAt),
            savedResearch.professionalId,
            null,
            null
        );
    }
    async update(research: Partial<Research & { images?: Partial<ResearchImage>[] }>): Promise<Research> {
        const updateData: any = {
            title: research.title,
            description: research.description,
            bodyText: research.bodyText,
            secondText: research.secondText,
            updatedAt: new Date(),
        };

        if (research.professionalId !== undefined) {
            updateData.professionalId = research.professionalId;
        }

        const { data: updatedResearch, error } = await supabase
            .from('Research')
            .update(updateData)
            .eq('id', research.id)
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to update research');
        }

        if (research.images) {
            // Delete existing images
            const { error: deleteError } = await supabase
                .from('ResearchImage')
                .delete()
                .eq('researchId', research.id);

            if (deleteError) {
                console.error(deleteError);
                throw new Error('Failed to delete existing research images');
            }

            // Insert new images
            const { data: savedImages, error: errorImages }: { data: ResearchImage[] | null, error: any } = await supabase
                .from('ResearchImage')
                .insert(research.images.map(image => ({
                    researchId: research.id,
                    url: image.url,
                    title: image.title,
                    description: image.description,
                })))
                .select(); // <-- Adicionado o .select() aqui
            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to update research images');
            }

            return new Research(
                updatedResearch.id,
                updatedResearch.title,
                updatedResearch.description,
                updatedResearch.bodyText,
                updatedResearch.secondText,
                new Date(updatedResearch.createdAt),
                new Date(updatedResearch.updatedAt),
                updatedResearch.professionalId,
                (Array.isArray(savedImages) ? savedImages : []).map((image: any) =>
                    new ResearchImage(
                        image.id,
                        image.researchId,
                        image.url,
                        image.title,
                        image.description
                    )
                ),
                null
            );
        }

        return new Research(
            updatedResearch.id,
            updatedResearch.title,
            updatedResearch.description,
            updatedResearch.bodyText,
            updatedResearch.secondText,
            new Date(updatedResearch.createdAt),
            new Date(updatedResearch.updatedAt),
            updatedResearch.professionalId,
            null,
            null
        );
    }


    async delete(id: number): Promise<void> {
        const { data: images, error: errorImages } = await supabase
            .from('ResearchImage')
            .delete()
            .eq('researchId', id);

        if (errorImages) {
            console.error(errorImages);
            throw new Error('Failed to delete research images');
        }

        const { error } = await supabase
            .from('Research')
            .delete()
            .eq('id', id);
        if (error) {
            console.error(error);
            throw new Error('Failed to delete research');
        }
    }
}