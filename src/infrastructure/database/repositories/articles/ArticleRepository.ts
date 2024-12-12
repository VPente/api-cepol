import { createClient } from '@supabase/supabase-js';
import { Article } from 'domain/entities/articles/Article';
import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';

import { SUPABASE_KEY, SUPABASE_URL } from '../../../../env';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class ArticleRepository implements IArticleRepository {

    async findById(id: number): Promise<Article | null> {
        const { data, error } = await supabase
            .from('Article')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data
            ? new Article(
                data.id,
                data.title,
                data.content,
                data.fileUrl,
                new Date(data.createdAt),
                new Date(data.updatedAt)
            )
            : null;
    }

    async findAll(): Promise<Article[]> {
        const { data, error } = await supabase
            .from('Article')
            .select('*');

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((article: any) =>
            new Article(
                article.id,
                article.title,
                article.content,
                article.fileUrl,
                new Date(article.createdAt),
                new Date(article.updatedAt)
            )
        );
    }

    async create(article: Partial<Article>): Promise<Article> {
        const { data, error } = await supabase
            .from('Article')
            .insert([
                {
                    title: article.title,
                    content: article.content,
                    fileUrl: article.fileUrl,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ])
            .select()
            .single();

        console.log(data, error);

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create article');
        }

        return new Article(
            data.id,
            data.title,
            data.content,
            data.fileUrl,
            new Date(data.createdAt),
            new Date(data.updatedAt)
        );
    }

    async update(article: Partial<Article>): Promise<Article> {
        const { data, error } = await supabase
            .from('Article')
            .update({
                title: article.title,
                content: article.content,
                fileUrl: article.fileUrl,
                updatedAt: article.updatedAt,
            })
            .eq('id', article.id)
            .single<Article>();

        if (error) {
            console.error(error);
            throw new Error('Failed to update article');
        }

        return new Article(
            data.id,
            data.title,
            data.content,
            data.fileUrl,
            new Date(data.createdAt),
            new Date(data.updatedAt)
        );
    }

    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from('Article')
            .delete()
            .eq('id', id);
        if (error) {
            console.error(error);
            throw new Error('Failed to delete article');
        }
    }
}
