import { checkPermissions } from '../../src/lib/rbac';

describe('Role-Based Access Control', () => {
  test('Admin should have access to admin resources', () => {
    const user = { role: 'admin' };
    const resource = 'admin';
    const result = checkPermissions(user, resource);
    expect(result).toBe(true);
  });

  test('User should not have access to admin resources', () => {
    const user = { role: 'user' };
    const resource = 'admin';
    const result = checkPermissions(user, resource);
    expect(result).toBe(false);
  });

  test('User should have access to user resources', () => {
    const user = { role: 'user' };
    const resource = 'user';
    const result = checkPermissions(user, resource);
    expect(result).toBe(true);
  });

  test('Guest should not have access to any resources', () => {
    const user = { role: 'guest' };
    const resource = 'admin';
    const result = checkPermissions(user, resource);
    expect(result).toBe(false);
  });
});