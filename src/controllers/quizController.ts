import type { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";

interface AuthRequest extends Request {
  user?: {
    userID: string;
    userEmail: string;
  };
}

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { id: course } = req.params;
    const { title, questions } = req.body;

    if (
      typeof course !== "string" ||
      !title ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Course, title, and questions are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const quiz = await Quiz.create({
      course,
      title,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    if (
      typeof courseId !== "string" ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const quizzes = await Quiz.find({ course: courseId });

    return res.status(200).json({
      success: true,
      total: quizzes.length,
      quizzes,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id: quizId } = req.params;
    const { answers } = req.body;
    const studentId = req.user?.userID;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (
      typeof quizId !== "string" ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let score = 0;

    const results = quiz.questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer: { questionId: string; answer: string }) =>
          answer.questionId === question._id.toString(),
      );

      const isCorrect = submittedAnswer?.answer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question._id,
        yourAnswer: submittedAnswer?.answer ?? null,
        correct: isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;

    if (totalQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: "This quiz has no questions",
      });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        quizId: quiz._id,
        studentId,
        score,
        totalQuestions,
        percentage,
        results,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
