import { deleteData, disconnectPrisma } from "./Features/scenarioFactory"
import supertest from 'supertest';
import app from '../../src/app';
import { recomendationRandom, manyRecomendationRandom, manyRecomendationWithScore, randomAmount } from "./Features/recommendationRandom";
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

    it('POST CONFLICT  /recommendations', async () => {
        const recommendation = await recomendationRandom()
        await createRecommendation(recommendation)
        const result = await supertest(app).post('/recommendations').send(recommendation)
        await verifyExitsRecommendation(recommendation.name)
        expect(result.status).toEqual(409)
    });

    it('POST WRONG BODY /recommendations', async () => {
        const result = await supertest(app).post('/recommendations').send({})
        expect(result.status).toEqual(422)
    });

    it('POST /recommendations/:id/upvote', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).post(`/recommendations/${existRecommendation.id}/upvote`)
        const updateRecoomendation = await verifyExitsRecommendation(existRecommendation.name)
        expect(result.status).toEqual(200)
        expect(existRecommendation.score).toBeLessThan(updateRecoomendation!.score)
    });

    it('POST WRONG ID /recommendations/:id/upvote', async () => {
        const wrongId = 0
        const result = await supertest(app).post(`/recommendations/${wrongId}/upvote`)
        expect(result.status).toEqual(404)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
    });

    it('POST /recommendations/:id/downvote', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).post(`/recommendations/${existRecommendation.id}/downvote`)
        const updateRecoomendation = await verifyExitsRecommendation(existRecommendation.name)
        expect(result.status).toEqual(200)
        expect(updateRecoomendation!.score).toBeLessThan(existRecommendation.score)
    });

    it('POST WRONG ID /recommendations/:id/downvote', async () => {
        const wrongId = 0
        const result = await supertest(app).post(`/recommendations/${wrongId}/downvote`)
        expect(result.status).toEqual(404)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
    });

    it('GET /recommendations', async () => {
        const recommendations = await manyRecomendationRandom()
        const existRecommendation = await insertMany(recommendations)
        const result = await supertest(app).get('/recommendations')
        const totalLength = existRecommendation.count
        expect(result.body).toHaveLength(totalLength)
    });

    it('GET /recommendations/:id', async () => {
        const recommendation = await recomendationRandom()
        const existRecommendation = await createRecommendation(recommendation)
        const result = await supertest(app).get(`/recommendations/${existRecommendation.id}`)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
        expect(result.body).toMatchObject(existRecommendation)
    });

    it('GET WITH WRONG ID /recommendations/:id', async () => {
        const wrongId = 0
        const result = await supertest(app).get(`/recommendations/${wrongId}`)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
        expect(result.status).toEqual(404)
    });

    it('GET /recommendations/random', async () => {
        const recommendations = await manyRecomendationRandom()
        await insertMany(recommendations)
        const result = await supertest(app).get('/recommendations/random')
        const existRecommendation = await verifyExitsRecommendation(result.body.name)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
        expect(existRecommendation).not.toBeFalsy()
    });

    it('GET /recommendations/top/:amount', async () => {
        let length = 0
        const amount = await randomAmount()
        const recommendations = await manyRecomendationWithScore()
        await insertMany(recommendations)
        const result = await supertest(app).get(`/recommendations/top/${amount}`)

        if (Number(amount) < recommendations.length) {
            length = Number(amount)
        } else {
            length = recommendations.length
        }

        expect(result.body).not.toBeFalsy()
        expect(result.body).toHaveLength(length)
        expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score)
    });

    it('GET WRONG AMOUNT /recommendations/top/:amount', async () => {
        const amount = -1
        const result = await supertest(app).get(`/recommendations/top/${amount}`)
        expect(result.body).not.toBeFalsy()
        expect(result.body).toBeInstanceOf(Object)
    });

})

afterAll(async () => {
    await disconnectPrisma();
});