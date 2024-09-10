export function formatResponse(statusCode: number, message: string, data: any) {
  return {
    status: statusCode,
    message: message,
    data: data,
  };
}
