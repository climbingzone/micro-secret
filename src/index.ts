import { IncomingMessage, ServerResponse } from 'http';
import authReq from './authReq';

export interface MicroSecretOptions {
  whitelist?: string[];
  resAuthMissing?: string;
  resAuthInvalid?: string;
  headerKey?: string;
}

export const MISSING_KEY = 'missing_key';

export default (secrets: string[], options: MicroSecretOptions = {}) => (
  fn: Function
) => {
  if (!secrets || !secrets.length) {
    throw Error('API Auth must be initialized with an array of secrets');
  }
  const keyMissingMessage = options.resAuthMissing
    ? options.resAuthMissing
    : 'Missing Authorization header or query apiToken';
  const keyInvalidMessage = options.resAuthInvalid
    ? options.resAuthInvalid
    : 'Invalid API Secret';

  return (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Returns true if secret as Authorization Bearer header or throws
      authReq(req, secrets, options);
      return fn(req, res);
    } catch (e) {
      const missingKey = e.message === MISSING_KEY;
      res.writeHead(missingKey ? 401 : 403);
      res.end(missingKey ? keyMissingMessage : keyInvalidMessage);
    }
  };
};
