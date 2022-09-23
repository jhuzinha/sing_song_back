import { Prisma } from "@prisma/client";
import { prisma } from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

async function create(createRecommendationData: CreateRecommendationData) {
  return await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

export interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

async function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);
  const recommendations = await prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: "desc" },
    take: 10,
  });
  return recommendations;
}

async function getAmountByScore(take: number) {
  const recommendations = await prisma.recommendation.findMany({
    orderBy: { score: "desc" },
    take,
  });
  return recommendations;
}

function getFindAllFilter(
  findAllWhere?: FindAllWhere
): Prisma.RecommendationWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

async function find(id: number) {
  return await prisma.recommendation.findUnique({
    where: { id },
  });
}

function findByName(name: string) {
  return prisma.recommendation.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: "increment" | "decrement") {
  return prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

async function remove(id: number) {
  return await prisma.recommendation.delete({
    where: { id },
  });
}

export const recommendationRepository = {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
};
