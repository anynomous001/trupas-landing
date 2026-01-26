const BASE_URL = 'http://localhost:8000/api/v1';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export const api = {
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, headers, ...rest } = options;

        const makeRequest = async (token?: string | null) => {
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
            const effectiveToken = token !== undefined ? token : localStorage.getItem('access_token');
            if (effectiveToken) {
                requestHeaders.set('Authorization', `Bearer ${effectiveToken}`);
            }

            const response = await fetch(url.toString(), {
                ...rest,
                headers: requestHeaders,
            });

            return response;
        };

        let response = await makeRequest();

        // Handle 401 Unauthorized - Attempt Refresh
        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Try to refresh the token
                    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh_token: refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        localStorage.setItem('access_token', data.access_token);
                        // Retry the original request with the new token
                        response = await makeRequest(data.access_token);
                    } else {
                        // Refresh failed (e.g., refresh token expired), clear tokens and throw
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('auth-storage');
                        window.location.href = '/login'; // Redirect to login
                        throw new Error('Session expired. Please login again.');
                    }
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth-storage');
                    window.location.href = '/login';
                    throw error;
                }
            } else {
                // No refresh token, clear access token if it exists (invalid state)
                localStorage.removeItem('access_token');
                // Don't redirect immediately to allow public APIs if any, but usually 401 means auth needed
            }
        }

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
