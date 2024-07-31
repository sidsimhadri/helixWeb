"use client";
import styles from "./page.module.css"
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent default form submission
      router.push("/asking");
    };
  return (
      <div className={styles.flexContainer}>
        <div className={styles.loginContainer}>
          <h3>Login</h3>
            <form className={styles.loginForm} onSubmit={handleLogin}>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="*******" />
            <button type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
  );
}
