import { ErrorMessages } from "./error-messages";
import { ErrorSource } from "./error-source";

export type ErrorMessageId<T extends ErrorSource> = keyof (typeof ErrorMessages[T]);
