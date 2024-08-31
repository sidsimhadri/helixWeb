"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { createQuestion } from "../../api/questionService"; 
import { Question } from "../../types"
export default function Asking() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAsk = () => {
    router.push("/asking");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert("Please enter both a title and a question");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || typeof user.id !== 'number') {
        throw new Error('Invalid user data');
      }

      const newQuestion: Question = {
        title,
        text,
        thumbs_up: 0,
        thumbs_down: 0,
        user: user.id,  
      };

      const result = await createQuestion(newQuestion);
      
      console.log("Question created:", result);
      setTitle("");
      setText("");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating question:", err);
      setError("Failed to submit question. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    console.log("Text updated:", e.target.value);
  };

  return (
    <div className={styles.flexContainer}>
    <div className={styles.header}>
    <div className={styles.iconContainer}>
    <Image
    className={styles.icon}
    src="/icon.png"
    alt="profile pic"
    width={50}
    height={50}
    />
    Pseudo near expert
    </div>
    <div>
    <button className={styles.button} onClick={handleAsk}>
    Ask a question
    </button>
    </div>
    </div>
    <div className={styles.askContainer}>
    <h3 className={styles.askHeading}>New Question</h3>
    <form className={styles.askForm} onSubmit={handleSubmit}>
    <input
    type="text"
    placeholder="Question title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    />
    <textarea
    className={styles.textarea}
    placeholder="Enter your question here"
    value={text}
    onChange={handleTextChange}
    required
    />
    <button className={styles.button} type="submit" disabled={loading}>
    {loading ? "Submitting..." : "Post"}
    </button>
    {error && <p className="error">Error: {error}</p>}
    </form>
    </div>
    </div>
  );
}
