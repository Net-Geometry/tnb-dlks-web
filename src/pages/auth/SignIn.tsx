import { UserAuth } from '@/context/AuthContext';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {signInUser } = UserAuth();
  const navigate = useNavigate();
  // console.log(email, password, session);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await signInUser(email, password);
      if (response.success) {
        navigate('/dashboard'); // Assuming you want to redirect to the home page after sign up
      } else {
        setError(response.error || "An error occurred during sign up.");
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <form onSubmit={handleSignIn} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2'>Sign In</h2>
        <p>
          Dont Have account? <Link to={"/signup"}>Sign Up!</Link>
        </p>
        <div className='flex flex-col py-4'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-6"
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-6"
            type='password'
            id='password'
            name='password'
            placeholder='Password'
            required
          />
          <button type='submit' disabled={loading} className='mt-4 w-full'>
            Sign In
          </button>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
      </form>
    </div>
  )
}

export default SignUp