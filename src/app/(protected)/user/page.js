import { useSession } from 'next-auth/react';

const UserPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>You need to be logged in to view this page.</p>;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>This is your user-specific content.</p>
    </div>
  );
};

export default UserPage;