import { AuthProvider } from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ProtectedLayout = ({ children }) => {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                    {children}
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
};

export default ProtectedLayout;