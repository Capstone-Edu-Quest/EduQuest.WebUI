export interface BaseReponse<TData = any> {
  isError: boolean;
  payload: TData | null;
  errors: IErrors;
  message: {content: string, values: object} | null;
}

export interface IErrors {
  statusCode: number;
  statusResponse: string;
  message: string;
  location: string;
  detail: string;
}

export interface IMessage {
  content: string;
  values: {
    [key: string]: string | number;
  };
}
