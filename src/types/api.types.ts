export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[] | any;
    pagination: Pagination;
  };
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      required_capability?: string;
      user_role?: string;
      resource_id?: string;
      [key: string]: any;
    };
    request_id: string;
  };
  timestamp: string;
}
