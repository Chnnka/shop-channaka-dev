/** Body the backend sends with a failed request: { status, message, error } */
export type ApiErrorResponse = {
  /** The body's own status field, not the HTTP status code (use error.response.status for that) */
  status?: number | string;
  message?: string;
  /** Can be missing, e.g. when a proxy answers with an HTML error page */
  error?: string;
  /** Sent with request validation failures (400): one entry per invalid field */
  fieldErrors?: ApiFieldError[];
};

export type ApiFieldError = {
  /** Request field path, e.g. "title", "dimensions.unit", "images[0].alt"; "body" for the whole request */
  field: string;
  message: string;
};
