"use client";
import styles from "./page.module.css"
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import Image from "next/image"; 
import { useRouter } from "next/navigation";

// Define the Question type
interface Question {
  id: string;
  title: string;
  text: string;
}

const GET_ALL_QUESTIONS = gql`
  query GetAllQuestions {
    questions {
      id
      title
      text
    }
  }
`;

export default function Home() {
    const { loading, error, data, refetch } = useQuery(GET_ALL_QUESTIONS);

    useEffect(() => {
      refetch();
    }, [refetch]);

    const router = useRouter();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: Failed to fetch questions. Please try again later.</p>;
  
    function handleAskQuestion() {
      router.push("/asking");
    }

    return (
      <div className={styles.flexContainer}>
          <div className={styles.header}>
            <button className={styles.button} onClick={handleAskQuestion}>
              Ask a question
            </button>
        </div>
        {data && data.questions && data.questions.length > 0 ? (
          data.questions.map((question: Question) => (
            <div key={question.id} className={styles.question}>
              <h3>{question.title}</h3>
              <p>{question.text}</p>
              <h4>Asked by:</h4>
                <div className={styles.profileContainer}>
                <Image
                  src="/icon.png"
                  alt="profile pic"
                  width={50}
                  height={50}
                />
                <p>Pseudo near expert</p>
              </div>
            </div>
          ))
        ) : (
          <p>No questions available. Be the first to ask!</p>
        )}
      </div>
    );
}