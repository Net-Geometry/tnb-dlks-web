import { UserAuth } from '@/context/AuthContext';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();
  console.log(email, password, session);
  // console.log(session);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await signUpNewUser(email, password);
      if (response.success) {
        console.log("Sign up successful:", response.data);
        // Redirect or show success message
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
      <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
        <h2 className='font-bold pb-2'>Sign up!</h2>
        <p>
          Already have an account? <Link to={"/signin"}>Sign in</Link>
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
            Sign Up
          </button>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
      </form>
    </div>
  )
}

export default SignUp