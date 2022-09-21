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
    it('POST POST /recommendations/:id/downvote', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).post(`/recommendations/${existRecommendation.id}/downvote`)
        const updateRecoomendation = await verifyExitsRecommendation(existRecommendation.name)
        expect(result.status).toEqual(200)
        expect(updateRecoomendation.score).toBeLessThan(existRecommendation.score)
    })
    it('GET /recommendations', async () => {
        const recommendations = await manyRecomendationRandom()
        const existRecommendation = await insertMany(recommendations)
        const result = await supertest(app).get('/recommendations')
        const totalLength = existRecommendation.count
        expect(result.body).toHaveLength(totalLength)
    })
    it('GET /recommendations/:id', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).get(`/recommendations/${existRecommendation.id}`)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
        expect(result.body).toMatchObject(existRecommendation)
    })
    it('GET /recommendations/random', async () => {
        const recommendations = await manyRecomendationRandom()
        await insertMany(recommendations)
        const result = await supertest(app).get('/recommendations/random')
        const existRecommendation = await verifyExitsRecommendation(result.body.name)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
        expect(existRecommendation).not.toBeFalsy()
    })
    // it('GET /recommendations/top/:amount', async () => {
    //     const recommendations = await manyRecomendationRandom()
    //     await insertMany(recommendations)

    // })
})

afterAll(async () => {
    await disconnectPrisma();
});