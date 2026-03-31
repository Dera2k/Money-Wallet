export interface ApiResponse<AT = any> { // AT here is my place holder for any data type
  status: 'success' | 'error';
  message: string;
  data?: AT;
  code?: string;
  details?: any;
}

export const successResponse = <AT>(  message: string,  data?: AT): ApiResponse<AT> => {
  return {
    status: 'success',
    message,
    ...(data !== undefined && {data}),
  };
};

export const errorResponse = (
  message: string,
  code: string,
  details?: any
): ApiResponse => {

  return {
    status: 'error', message, code, details,};
};