import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// POST /api/tests/[testId]/submit — submit test attempt
export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const session = await requireAuth(req);
    const { answers, timeTaken } = await req.json();

    const test = await prisma.test.findUnique({
      where: { id: params.testId },
      include: { questions: true },
    });

    if (!test) return errorResponse('Test not found', 404);
    if (!test.isPublished) return errorResponse('Test is not published', 403);

    // Check attempts limit
    if (test.maxAttempts) {
      const existingAttempts = await prisma.testAttempt.count({
        where: { testId: params.testId, userId: session.userId, submittedAt: { not: null } },
      });
      if (existingAttempts >= test.maxAttempts) {
        return errorResponse('Maximum attempts reached', 403);
      }
    }

    // Auto-evaluate objective questions
    let score = 0;
    const evaluatedAnswers: Record<string, { answer: string; correct: boolean; correctAnswer: string }> = {};

    for (const question of test.questions) {
      const userAnswer = answers[question.id];
      evaluatedAnswers[question.id] = {
        answer: userAnswer || '',
        correct: false,
        correctAnswer: question.correctAnswer || '',
      };

      if (['MCQ', 'TRUE_FALSE'].includes(question.questionType)) {
        if (userAnswer && question.correctAnswer) {
          if (userAnswer === question.correctAnswer) {
            score += question.marks;
            evaluatedAnswers[question.id].correct = true;
          } else if (test.negativeMarking > 0) {
            score -= test.negativeMarking;
          }
        }
      }
    }

    score = Math.max(0, score); // No negative total
    const isPassed = test.passingMarks ? score >= test.passingMarks : null;

    const attempt = await prisma.testAttempt.create({
      data: {
        testId: params.testId,
        userId: session.userId,
        answers: evaluatedAnswers,
        score,
        totalMarks: test.totalMarks,
        timeTaken,
        submittedAt: new Date(),
        isPassed,
      },
    });

    return successResponse(
      {
        attemptId: attempt.id,
        score,
        totalMarks: test.totalMarks,
        isPassed,
        percentage: test.totalMarks > 0 ? Math.round((score / test.totalMarks) * 100) : 0,
        ...(test.showAnswers && { evaluatedAnswers }),
      },
      'Test submitted successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
