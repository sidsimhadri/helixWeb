"use client";
import styles from "./page.module.css"
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '../api/questionService';
import { useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password });
      if (response.message === 'Login successful') {
        router.push("/asking");
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser({ username, password });
      if (response.message === 'User created successfully') {
        setError('');
        alert('Registration successful');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, action: 'login' | 'register') => {
    e.preventDefault(); // Prevent default form submission
    if (action === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleLogin();
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleRegister();
  };

    return (
        <div className={styles.flexContainer}>
            <div className={styles.loginContainer}>
                <h3>Login or Register</h3>
                <form className={styles.loginForm} onSubmit={(e) => handleSubmit(e, 'login')}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="*******" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <div className={styles.buttonContainer}>
                        <button type="button" onClick={handleLoginClick} className={styles.button}>
                            Log In
                        </button>

            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleRegisterClick} className={styles.button}>
                    Register
                </button>
            </div>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
}
