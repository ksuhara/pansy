import { Result } from 'neverthrow';

type JsonError = {
  message: string,
};

const toJsonError = (e: Error): JsonError => ({ message: e.message });

export const safeJsonParse = Result.fromThrowable(JSON.parse, toJsonError);

export const safeJsonStringify = Result.fromThrowable(JSON.stringify, toJsonError);
