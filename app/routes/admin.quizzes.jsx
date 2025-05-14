import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import db from "../db.server.js";
// import db from "~/db.server";

export const loader = async () => {
  const quizzes = await db.quiz.findMany({
    orderBy: { createdAt: "desc" },
  });
  return json({ quizzes });
};

export default function QuizzesPage() {
  const { quizzes } = useLoaderData();

  return (
    <div style={{ padding: 24 }}>
      <h1>All Quizzes</h1>
      <Link to="/admin/quizzes/new" style={{ display: "block", margin: "16px 0", color: "blue" }}>
        ➕ Create New Quiz
      </Link>

      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link to={`/admin/quizzes/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
