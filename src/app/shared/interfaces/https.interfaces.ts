export interface BaseReponse<TData = any> {
  isError: boolean;
  payload: TData | null;
  errors: IErrors;
  message: string | null;
}

export interface IErrors {
  StatusCode: number;
  StatusResponse: string;
  Message: string;
  Location: string;
  Detail: string;
}

export interface IMessage {
  content: string;
  values: {
    [key: string]: string | number;
  };
}
