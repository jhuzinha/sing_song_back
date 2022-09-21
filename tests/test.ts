import { deleteData, disconnectPrisma } from "./Features/scenarioFactory"
import supertest from 'supertest';
import app from '../src/app';
import { recomendationRandom, manyRecomendationRandom } from "./Features/recommendationRandom";
import { verifyExitsRecommendation, createRecommendation, insertMany } from "./Features/recommendationFactory";

beforeEach(async () => {
    await deleteData();
});

describe("ROUTE RECOMMENDATIONS", () => {
    it('POST /recommendations', async () => {
        const recommendation = await recomendationRandom()
        const result = await supertest(app).post('/recommendations').send(recommendation)
        const existRecommendation = await verifyExitsRecommendation(recommendation.name)
        expect(result.status).toEqual(201)
        expect(existRecommendation).not.toBeNull()
    });
    it('POST /recommendations/:id/upvote', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).post(`/recommendations/${existRecommendation.id}/upvote`)
        const updateRecoomendation = await verifyExitsRecommendation(existRecommendation.name)
        expect(result.status).toEqual(200)
        expect(existRecommendation.score).toBeLessThan(updateRecoomendation.score)
    });

})

afterAll(async () => {
    await disconnectPrisma();
});