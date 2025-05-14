import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");

  if (typeof title !== "string" || title.trim() === "") {
    return json({ error: "Title is required" }, { status: 400 });
  }

  const quiz = await db.quiz.create({
    data: {
      title,
      description,
      shop: "dev-shop", // you can update this to use session.shop
    },
  });

  return redirect(`/admin/quizzes/${quiz.id}`);
};

export default function NewQuizPage() {
  const actionData = useActionData();

  return (
    <div style={{ padding: 24 }}>
      <h1>Create New Quiz</h1>
      <Form method="post">
        <div>
          <label>
            Title:
            <input type="text" name="title" required />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>
            Description:
            <textarea name="description" rows={4} />
          </label>
        </div>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <div style={{ marginTop: 16 }}>
          <button type="submit">Create Quiz</button>
        </div>
      </Form>
    </div>
  );
}
