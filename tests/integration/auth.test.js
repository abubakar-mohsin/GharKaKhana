import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../src/components/auth/AuthProvider';
import LoginPage from '../../src/app/(public)/login/page';

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays error on invalid login', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('redirects to protected route on successful login', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/welcome/i)).toBeInTheDocument(); // Assuming the protected route displays "welcome"
  });
});