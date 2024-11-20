/**
 * Enhanced Cloudflare Worker demonstrating common patterns and best practices
 *
 * Features:
 * - Route handling
 * - Request method checking
 * - Headers manipulation
 * - JSON responses
 * - Error handling
 * - CORS support
 */

// Define custom error class for API errors
class APIError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.name = 'APIError';
	}
}

// CORS headers for cross-origin requests
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			// Handle CORS preflight requests
			if (request.method === 'OPTIONS') {
				return new Response(null, {
					headers: corsHeaders,
				});
			}

			const url = new URL(request.url);

			// Basic routing based on pathname
			switch (url.pathname) {
				case '/':
					return new Response('Welcome to my Cloudflare Worker!', {
						headers: {
							'Content-Type': 'text/plain',
							...corsHeaders,
						},
					});

				case '/api/data':
					// Handle different HTTP methods
					switch (request.method) {
						case 'GET':
							const data = {
								message: 'Hello from the API!',
								timestamp: new Date().toISOString(),
								environment: env.ENVIRONMENT || 'development',
							};

							return new Response(JSON.stringify(data), {
								headers: {
									'Content-Type': 'application/json',
									...corsHeaders,
								},
							});

						case 'POST':
							// Parse JSON body
							const body = await request.json().catch(() => {
								throw new APIError(400, 'Invalid JSON body');
							});
							console.log(body);

							// Process the request...
							return new Response(
								JSON.stringify({
									success: true,
									received: body,
								}),
								{
									headers: {
										'Content-Type': 'application/json',
										...corsHeaders,
									},
								}
							);

						default:
							throw new APIError(405, 'Method not allowed');
					}

				default:
					throw new APIError(404, 'Not found');
			}
		} catch (error) {
			// Error handling
			console.error('Worker error:', error);

			if (error instanceof APIError) {
				return new Response(
					JSON.stringify({
						error: error.message,
						status: error.status,
					}),
					{
						status: error.status,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
					}
				);
			}

			// Handle unexpected errors
			return new Response(
				JSON.stringify({
					error: 'Internal server error',
					status: 500,
				}),
				{
					status: 5001,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;

// Type definition for environment variables
interface Env {
	ENVIRONMENT?: string;
	// Add other environment variables as needed
}
