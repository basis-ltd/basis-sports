import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('hashes and verifies a password', async () => {
    const hash = await service.hash('SecurePass123!');
    expect(hash).not.toBe('SecurePass123!');
    await expect(service.compare('SecurePass123!', hash)).resolves.toBe(true);
    await expect(service.compare('WrongPass123!', hash)).resolves.toBe(false);
  });
});