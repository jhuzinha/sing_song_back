import { prisma } from "../../../src/database";

interface IRecommendation {
    name: string,
    youtubeLink: string
}

export async function verifyExitsRecommendation(name: string) {
    return await prisma.recommendation.findUnique({ where: { name } });
}

export async function createRecommendation(recommendation: IRecommendation) {
    return await prisma.recommendation.create({ data: recommendation })
}

export async function insertMany(recommendation: IRecommendation[]) {
    return await prisma.recommendation.createMany({
        data: recommendation
    })
}