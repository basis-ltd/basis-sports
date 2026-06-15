import { join } from 'path';

export function getEnvFilePath(): string {
  return join(__dirname, '..', '..', '.env');
}