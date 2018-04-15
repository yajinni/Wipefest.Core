export abstract class Result<T> {
  constructor(public value: T, public error: string) {}

  get isFailure(): boolean {
    return !!this.error;
  }

  get isSuccess(): boolean {
    return !this.isFailure;
  }
}

export class OkResult<T> extends Result<T> {
  constructor(value: T) {
    super(value, null);
  }
}

export class ErrorResult<T> extends Result<T> {
  constructor(error: string) {
    super(null, error);
  }
}

export abstract class HttpResult<T> extends Result<T> {
  constructor(value: T, error: string, public status: number) {
    super(value, error);
  }
}

export class OkHttpResult<T> extends HttpResult<T> {
  constructor(status: number, value: T) {
    super(value, null, status);
  }
}

export class ErrorHttpResult<T> extends HttpResult<T> {
  constructor(status: number, error: string) {
    super(null, error, status);
  }
}
