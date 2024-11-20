// test/index.spec.ts

import { describe, it, expect } from 'vitest';

// 模拟 Env 类型
interface Env {
	ENVIRONMENT?: string;
}

// 首先定义响应数据的接口
interface ApiResponse {
	success: boolean;
	received: Record<string, any>;
}

// 测试 Cloudflare Worker
describe('Cloudflare Worker Test', () => {
	// 测试根路径
	it('should return welcome message', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/');
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(200);
		const text = await response.text();
		expect(text).toBe('Welcome to my Cloudflare Worker!');
		expect(response.headers.get('Content-Type')).toContain('text/plain');
	});

	// 测试 API 数据端点
	it('should return JSON data from /api/data', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/api/data');
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toContain('application/json');

		const data = await response.json();
		expect(data).toHaveProperty('message', 'Hello from the API!');
		expect(data).toHaveProperty('timestamp');
		expect(data).toHaveProperty('environment');
	});

	// 测试 POST 请求
	it('should handle POST with valid JSON', async () => {
		const worker = await import('../src/index');
		const testData = { test: 'value' };
		const req = new Request('http://localhost/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(testData),
		});
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(200);
		const data = (await response.json()) as ApiResponse;
		expect(data).toHaveProperty('success', true);
		expect(data.received).toEqual(testData);
	});

	// 测试无效 JSON
	it('should reject invalid JSON', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: 'invalid json',
		});
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data).toHaveProperty('error', 'Invalid JSON body');
	});

	// 测试 CORS
	it('should handle OPTIONS request', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/api/data', {
			method: 'OPTIONS',
		});
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
		expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
	});

	// 测试 404 错误
	it('should return 404 for unknown routes', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/unknown-route');
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(404);
		const data = await response.json();
		expect(data).toHaveProperty('error', 'Not found');
	});

	// 测试方法不允许
	it('should return 405 for unsupported methods', async () => {
		const worker = await import('../src/index');
		const req = new Request('http://localhost/api/data', {
			method: 'PUT',
		});
		const env = {} as Env;
		const ctx = {} as ExecutionContext;

		const response = await worker.default.fetch(req, env, ctx);
		expect(response.status).toBe(405);
		const data = await response.json();
		expect(data).toHaveProperty('error', 'Method not allowed');
	});
});
