import express from 'express';
import cors from 'cors';
import { prisma } from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/exercises', async (_req, res) => {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: 'desc' },
    include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: true } } },
  });
  res.json(exercises);
});

app.get('/api/sections', async (_req, res) => {
  const sections = await prisma.section.findMany({
    orderBy: { title: 'asc' },
    include: {
      exercises: {
        orderBy: { createdAt: 'asc' },
        include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: true } } },
      },
    },
  });
  res.json(
    sections.map((section) => ({
      ...section,
      exercises: section.exercises.map((exercise) => ({
        ...exercise,
        sectionTitle: section.title,
      })),
    })),
  );
});

app.get('/api/exercises/:id', async (req, res) => {
  const exercise = await prisma.exercise.findUnique({
    where: { id: req.params.id },
    include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: true } } },
  });
  if (!exercise) return res.status(404).json({ message: 'Not found' });
  res.json(exercise);
});

app.post('/api/exercises', async (req, res) => {
  const { title, description, question } = req.body as {
    title: string;
    description?: string;
    questions: {
      prompt: string;
      explanation: string;
      correctOptionIndex: number;
      options: { label: string; text: string }[];
    }[];
    question?: {
      prompt: string;
      explanation: string;
      correctOptionIndex: number;
      options: { label: string; text: string }[];
    };
  };

  const sourceQuestions = req.body.questions ?? (question ? [question] : []);
  const exerciseId = `ex-${Date.now()}`;
  const created = await prisma.exercise.create({
    data: {
      id: exerciseId,
      sectionId: (req.body.sectionTitle as string) || 'black-box-testing',
      title,
      description: description || 'New exercise',
      questions: {
        create: sourceQuestions.map((item, questionIndex) => ({
          id: `q-${Date.now()}-${questionIndex}`,
          prompt: item.prompt,
          explanation: item.explanation,
          correctOptionId: 'pending',
          orderIndex: questionIndex + 1,
          options: {
            create: item.options.map((option, optionIndex) => ({
              id: `o-${Date.now()}-${questionIndex}-${optionIndex}`,
              label: option.label,
              text: option.text,
            })),
          },
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });

  for (let index = 0; index < created.questions.length; index += 1) {
    const createdQuestion = created.questions[index];
    const originalQuestion = sourceQuestions[index];
    await prisma.question.update({
      where: { id: createdQuestion.id },
      data: { correctOptionId: createdQuestion.options[originalQuestion.correctOptionIndex].id },
    });
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: true } } },
  });
  res.status(201).json(exercise);
});

app.put('/api/exercises/:id', async (req, res) => {
  const { title, description, sectionTitle } = req.body as { title: string; description: string; sectionTitle?: string };
  const updated = await prisma.exercise.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      sectionId: sectionTitle
        ? (await prisma.section.findUnique({ where: { title: sectionTitle } }))?.id
        : undefined,
    },
  });
  res.json(updated);
});

app.delete('/api/exercises/:id', async (req, res) => {
  await prisma.exercise.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

app.put('/api/questions/:id', async (req, res) => {
  const { prompt, explanation, correctOptionIndex, options } = req.body as {
    prompt: string;
    explanation: string;
    correctOptionIndex: number;
    options: { label: string; text: string }[];
  };

  const existing = await prisma.question.findUnique({
    where: { id: req.params.id },
    include: { options: true },
  });
  if (!existing) return res.status(404).json({ message: 'Not found' });

  await prisma.option.deleteMany({ where: { questionId: existing.id } });
  const recreated = await prisma.question.update({
    where: { id: existing.id },
    data: {
      prompt,
      explanation,
      options: {
        create: options.map((option, index) => ({
          id: `o-${Date.now()}-${index}`,
          label: option.label,
          text: option.text,
        })),
      },
    },
    include: { options: true },
  });

  await prisma.question.update({
    where: { id: existing.id },
    data: { correctOptionId: recreated.options[correctOptionIndex].id },
  });

  const updated = await prisma.question.findUnique({
    where: { id: existing.id },
    include: { options: true },
  });
  res.json(updated);
});

app.delete('/api/questions/:id', async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
