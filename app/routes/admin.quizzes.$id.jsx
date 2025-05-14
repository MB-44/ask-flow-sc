import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import db from "../db.server";

export const loader = async ({ params }) => {
  const quiz = await db.quiz.findUnique({
    where: { id: params.id },
    include: { questions: true },
  });

  return json({ quiz });
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  const text = form.get("text");
  const nextQuestionId = form.get("nextQuestionId");
  const weight = form.get("weight");
  const productId = form.get("productId");

  if (typeof text !== "string" || text.trim() === "") {
    return json({ error: "Question text is required" }, { status: 400 });
  }

  const question = await db.question.create({
    data: {
      quizId: params.id,
      text,
    },
  });

  if (productId && weight) {
    await db.productWeight.create({
      data: {
        answerId: question.id,
        productId,
        weight: parseInt(weight, 10),
      },
    });
  }

  return redirect(`/admin/quizzes/${params.id}`);
};

export default function QuizEditor() {
  const { quiz } = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1>Edit Quiz: {quiz.title}</h1>

      <Form method="post">
        <label>
          Question:
          <input type="text" name="text" required />
        </label>
        <label>
          Next Question ID:
          <input type="text" name="nextQuestionId" />
        </label>
        <label>
          Product ID:
          <input type="text" name="productId" />
        </label>
        <label>
          Weight:
          <input type="number" name="weight" />
        </label>
        {actionData?.error && <p>{actionData.error}</p>}
        <button type="submit">Add Question</button>
      </Form>

      <h2>Questions</h2>
      <ul>
        {quiz.questions.map((question) => (
          <li key={question.id}>{question.text}</li>
        ))}
      </ul>
    </div>
  );
}