"use client";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_QUESTION = gql`
  mutation CreateQuestion($title: String!, $text: String!) {
    createQuestion(title: $title, text: $text) {
      question {
        id
        title
        text
      }
    }
  }
`;

export default function Asking() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [createQuestion, { loading, error }] = useMutation(CREATE_QUESTION);

  const handleAsk = () => {
    router.push("/asking");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert("Please enter both a title and a question");
      return;
    }
    try {
      const result = await createQuestion({ variables: { title, text } });
      console.log("Question created:", result.data.createQuestion);
      setTitle("");
      setText("");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Failed to submit question. Please try again.");
    }
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
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Post"}
          </button>
          {error && <p className="error">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
}
