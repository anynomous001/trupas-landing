const BASE_URL = 'http://localhost:8000/api/v1';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export const api = {
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, headers, ...rest } = options;

        // Construct URL with query parameters
        const url = new URL(`${BASE_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
        }

        // Prepare headers
        const requestHeaders = new Headers(headers);
        if (!(rest.body instanceof FormData)) {
            requestHeaders.set('Content-Type', 'application/json');
        }

        // Add authorization token if available
        const token = localStorage.getItem('access_token');
        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(url.toString(), {
            ...rest,
            headers: requestHeaders,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }

        return response.json();
    },

    get<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    },
};
