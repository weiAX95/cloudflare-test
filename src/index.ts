interface Env {
	MY_KV: KVNamespace;
}

interface ApiResponse {
	success: boolean;
	data?: any;
	error?: string;
	message?: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const corsHeaders = {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			};

			// 处理 CORS
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers: corsHeaders });
			}

			// API 路由处理
			const response: ApiResponse = await handleRequest(url.pathname, request.method, env.MY_KV, request);

			return new Response(JSON.stringify(response), {
				status: response.success ? 200 : 400,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		} catch (error) {
			console.error('Error:', error);
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Internal Server Error',
					message: error instanceof Error ? error.message : 'Unknown error',
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}
	},
};

async function handleRequest(path: string, method: string, kv: KVNamespace, request: Request): Promise<ApiResponse> {
	// 管理端点
	switch (path) {
		case '/api/status':
			return {
				success: true,
				data: {
					status: 'operational',
					timestamp: new Date().toISOString(),
				},
			};

		case '/api/init-demo-data':
			if (method === 'POST') {
				const demoData = {
					users: [
						{ id: '1', name: 'John Doe', email: 'john@example.com' },
						{ id: '2', name: 'Jane Smith', email: 'jane@example.com' },
					],
					products: [
						{ id: '1', name: 'Laptop Pro', price: 1299.99, stock: 50 },
						{ id: '2', name: 'Smartphone X', price: 799.99, stock: 100 },
					],
				};

				await kv.put('users', JSON.stringify(demoData.users));
				await kv.put('products', JSON.stringify(demoData.products));

				return {
					success: true,
					message: 'Demo data initialized successfully',
					data: demoData,
				};
			}
			break;

		case '/api/data':
			if (method === 'GET') {
				const users = await kv.get('users', 'json');
				const products = await kv.get('products', 'json');
				return {
					success: true,
					data: { users, products },
				};
			}
			break;

		case '/api/clear-data':
			if (method === 'POST') {
				await kv.delete('users');
				await kv.delete('products');
				return {
					success: true,
					message: 'All data cleared successfully',
				};
			}
			break;

		case '/api/list-keys':
			if (method === 'GET') {
				const list = await kv.list();
				return {
					success: true,
					data: list.keys,
				};
			}
			break;
	}

	return {
		success: false,
		error: 'Not Found',
		message: `Path ${path} with method ${method} not found`,
	};
}
