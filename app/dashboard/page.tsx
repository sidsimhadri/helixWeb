"use client";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { getQuestions, logoutUser } from "../../api/questionService";
import { Question } from "../../types";
import React from "react";
import { upvoteQuestion, downvoteQuestion } from "../../api/questionService";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();

  const handleUpvote = useCallback(async (id: number | undefined) => {
    if (id === undefined) {
      return;
    }
    try {
      await upvoteQuestion(id);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id
            ? { ...question, thumbs_up: question.thumbs_up + 1 }
            : question
        )
      );
    } catch (error) {
      console.error("Error updating question:", error);
    }
  }, []);
  

  const handleDownvote = useCallback(async (id: number | undefined) => {
    if (id === undefined) {
      return;
    }
    try {
      await downvoteQuestion(id);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id
            ? { ...question, thumbs_down: question.thumbs_down + 1 }
            : question
        )
      );
    } catch (error) {
      console.error("Error updating question:", error);
    }
  }, []);

  useEffect(() => {
    // Fetch the questions when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions();
        setQuestions(response.data); // Adjust depending on how the data is structured in the response
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [handleUpvote, handleDownvote]);

  function handleAskQuestion() {
    router.push("/asking");
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={styles.flexContainer}>
      <div className={styles.header}>
        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className={styles.question}>
            <h3>{question.title}</h3>
            <p>{question.text}</p>
            <h4>Asked by:</h4>
            <div className={styles.profileContainer}>
              <Image src="/icon.png" alt="profile pic" width={50} height={50} />
              <p>{question.user.username}</p>
              <FontAwesomeIcon
                className={styles.vote}
                onClick={() => handleUpvote(question.id)}
                icon={faThumbsUp}
              />
              <p>{question.thumbs_up}</p>
              <FontAwesomeIcon
                className={styles.vote}
                onClick={() => handleDownvote(question.id)}
                icon={faThumbsDown}
              />
              <p>{question.thumbs_down}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No questions available. Be the first to ask!</p>
      )}
    </div>
  );
}
