declare interface R<T = string> {
  code: number
  msg: string
  data: T
}

declare type ReplaceField<T, K extends keyof T, NewType> = {
  [P in keyof T]: P extends K ? NewType : T[P]
}

declare interface ResponsePagination<T> {
  list: T
  total: number
}

declare type PR<T> = R<ResponsePagination<T>>
