
import { SignInUseCase } from 'application/use-cases/auth/SignInUseCase';
import { SignOutUseCase } from 'application/use-cases/auth/SignOutUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { SupabaseAuthService } from 'infrastructure/services/supabase/SupabaseAuthService';
import { z } from 'zod';

const authService = new SupabaseAuthService();

export class SignInController extends OpenAPIRoute {
    schema = {
        tags: ['Authentication'],
        summary: 'User Sign In',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            email: z.string().email({ message: 'Invalid email address' }),
                            password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
                        }),
                    },
                },
            },
        },
        responses: {
            '200': {
                description: 'Returns user authentication data',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                access_token: z.string(),
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

        const { email, password } = data.body;

        try {
            const signInUseCase = new SignInUseCase(authService);

            const result = await signInUseCase.execute(email, password);

            return {
                success: true,
                result: {
                    access_token: result.token,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Authentication failed',
            };
        }
    }
}


export class SignOutController extends OpenAPIRoute {
    schema = {
        tags: ['Authentication'],
        summary: 'User Sign Out',
        responses: {
            '200': {
                description: 'User signed out successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            '400': {
                description: 'Sign out failed',
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
        try {
            const signOutUseCase = new SignOutUseCase(authService);

            await signOutUseCase.execute();

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Sign out failed',
            };
        }
    }
}