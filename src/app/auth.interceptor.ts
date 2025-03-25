import { HttpInterceptorFn } from '@angular/common/http';

const EXCLUDED_PATHS = [
  '/users/authenticate',
  '/users/register'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldSkip = EXCLUDED_PATHS.some(path => req.url.includes(path));

  if (shouldSkip) {
    return next(req);
  }

  const token = sessionStorage.getItem('appManagerAuthToken');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
