import { IncomingMessage } from 'http';
import url from 'url';

import { MicroSecretOptions, MISSING_KEY } from './index';

export default (
  req: IncomingMessage,
  secrets: string[],
  { whitelist, headerKey }: MicroSecretOptions = {}
) => {
  const urlParts = url.parse(req.url, true);
  const apiToken = urlParts.query.apiToken as string;
  const reqHeaderKey = headerKey ? headerKey : 'authorization';
  const bearerSecret = req.headers[reqHeaderKey] as string;
  const pathname = url.parse(req.url).pathname;
  const whitelisted = whitelist
    ? Array.isArray(whitelist) && whitelist.indexOf(pathname) >= 0
    : false;

  if (!bearerSecret && !apiToken && !whitelisted) {
    throw new Error(MISSING_KEY);
  }

  if (whitelisted) {
    return true;
  }

  const secret = apiToken || bearerSecret.replace('Bearer ', '');

  if (secrets.indexOf(secret) < 0) {
    throw new Error();
  }

  return true;
};
