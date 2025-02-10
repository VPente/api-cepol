import { createClient } from '@supabase/supabase-js';
import { Article } from 'domain/entities/articles/Article';
import { ArticleImage } from 'domain/entities/articles/ArticleImage';
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

        if (error) {
            console.error(error);
            return null;
        }

        const { data: images, error: errorImages } = await supabase
            .from("ArticleImage")
            .select("*")
            .eq("articleId", id);

        if (errorImages) {
            console.error(errorImages);
            return null;
        }

        return data ? new Article(
            data.id,
            data.title,
            data.description,
            data.bodyText,
            data.secondText,
            new Date(data.createdAt),
            new Date(data.updatedAt),
            images ? images.map((image: any) =>
                new ArticleImage(
                    image.id,
                    image.articleId,
                    image.url,
                    image.title,
                    image.description
                )
            ) : null
        ) : null;
    }

    async findAll(): Promise<Article[]> {
        const { data: articles, error } = await supabase
            .from('Article')
            .select('*');

        if (error) {
            console.error(error);
            return [];
        }

        const articleIds = articles.map(article => article.id);

        const { data: images, error: errorImages } = await supabase
            .from("ArticleImage")
            .select("*")
            .in("articleId", articleIds);

        if (errorImages) {
            console.error(errorImages);
            return [];
        }

        return articles.map((article: any) =>
            new Article(
                article.id,
                article.title,
                article.description,
                article.bodyText,
                article.secondText,
                new Date(article.createdAt),
                new Date(article.updatedAt),
                images ? images.filter((image: any) => image.articleId === article.id).map((image: any) =>
                    new ArticleImage(
                        image.id,
                        image.articleId,
                        image.url,
                        image.title,
                        image.description
                    )
                ) : null
            )
        );
    }

    async create(article: Partial<Article & { images?: Partial<ArticleImage>[] }>): Promise<Article> {
        const { data: savedArticle, error } = await supabase
            .from('Article')
            .insert([
                {
                    title: article.title,
                    description: article.description,
                    bodyText: article.bodyText,
                    secondText: article.secondText,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ])
            .select()
            .single();

        if (error !== null) {
            console.error(error);
            throw new Error('Failed to create article');
        }

        if (article.images) {
            const { data: savedImages, error: errorImages }: { data: ArticleImage[] | null, error: any } = await supabase
                .from('ArticleImage')
                .insert(article.images.map(image => ({
                    articleId: savedArticle.id,
                    url: image.url,
                    title: image.title,
                    description: image.description,
                })))
                .select();

            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to create article images');
            }

            return new Article(
                savedArticle.id,
                savedArticle.title,
                savedArticle.description,
                savedArticle.bodyText,
                savedArticle.secondText,
                new Date(savedArticle.createdAt),
                new Date(savedArticle.updatedAt),
                (Array.isArray(savedImages) ? savedImages : []).map((image: any) =>
                    new ArticleImage(
                        image.id,
                        image.articleId,
                        image.url,
                        image.title,
                        image.description
                    )
                )
            );
        }

        return new Article(
            savedArticle.id,
            savedArticle.title,
            savedArticle.description,
            savedArticle.bodyText,
            savedArticle.secondText,
            new Date(savedArticle.createdAt),
            new Date(savedArticle.updatedAt),
            null
        );
    }

    async update(article: Partial<Article & { images?: Partial<ArticleImage>[] }>): Promise<Article> {
        const { data: updatedArticle, error } = await supabase
            .from('Article')
            .update({
                title: article.title,
                description: article.description,
                bodyText: article.bodyText,
                secondText: article.secondText,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .eq('id', article.id)
            .select()
            .single<Article>();


        if (error !== null) {
            console.error(error);
            throw new Error('Failed to update article');
        }

        if (article.images) {
            // Delete existing images
            const { error: deleteError } = await supabase
                .from('ArticleImage')
                .delete()
                .eq('articleId', article.id);

            if (deleteError) {
                console.error(deleteError);
                throw new Error('Failed to delete existing article images');
            }

            // Insert new images
            const { data: savedImages, error: errorImages }: { data: ArticleImage[] | null, error: any } = await supabase
                .from('ArticleImage')
                .insert(article.images.map(image => ({
                    articleId: article.id,
                    url: image.url,
                    title: image.title,
                    description: image.description,
                })))
                .select(); 

            if (!savedImages || errorImages !== null) {
                console.error(errorImages);
                throw new Error('Failed to update article images');
            }

            return new Article(
                updatedArticle.id,
                updatedArticle.title,
                updatedArticle.description,
                updatedArticle.bodyText,
                updatedArticle.secondText,
                new Date(updatedArticle.createdAt),
                new Date(updatedArticle.updatedAt),
                (Array.isArray(savedImages) ? savedImages : []).map((image: any) =>
                    new ArticleImage(
                        image.id,
                        image.articleId,
                        image.url,
                        image.title,
                        image.description
                    )
                )
            );
        }

        return new Article(
            updatedArticle.id,
            updatedArticle.title,
            updatedArticle.description,
            updatedArticle.bodyText,
            updatedArticle.secondText,
            new Date(updatedArticle.createdAt),
            new Date(updatedArticle.updatedAt),
            null
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
