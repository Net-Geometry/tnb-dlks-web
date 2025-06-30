import { UserAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/signin',{replace:true}); // Redirect to sign-in page after sign out
            console.log("Sign out successful");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <div>
            <h1 className='text-2xl font-bold'>Welcome to the Dashboard</h1>
            {session ? (
                <div>
                    <p>Logged in as: {session.user.email}</p>
                    <button onClick={handleSignOut} className='bg-red-500 text-white p-2 rounded'>Sign Out</button>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    )
}

export default Dashboard