import { PrismaClient } from '@prisma/client';
import { initialSections } from '../src/data';

const prisma = new PrismaClient();

async function main() {
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.section.deleteMany();

  for (const section of initialSections) {
    await prisma.section.create({
      data: {
        id: section.id,
        title: section.title,
        description: section.description,
      },
    });
  }

  for (const section of initialSections) {
    for (const exercise of section.exercises) {
      await prisma.exercise.create({
        data: {
          id: exercise.id,
          sectionId: section.id,
          title: exercise.title,
          description: exercise.description,
          questions: {
            create: exercise.questions.map((question, index) => ({
              id: question.id,
              prompt: question.prompt,
              explanation: question.explanation,
              correctOptionId: question.correctOptionId,
              orderIndex: index + 1,
              options: {
                create: question.options.map((option) => ({
                  id: option.id,
                  label: option.label,
                  text: option.text,
                })),
              },
            })),
          },
        },
      });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
