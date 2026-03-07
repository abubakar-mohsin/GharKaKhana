import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || (allowedRoles && !allowedRoles.includes(user.role)))) {
            router.push('/forbidden');
        }
    }, [user, loading, allowedRoles, router]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return children;
};

export default ProtectedRoute;