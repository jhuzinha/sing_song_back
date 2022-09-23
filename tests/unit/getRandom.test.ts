import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import * as utils from "../utils Test/recommendationRandom";
import { notFoundError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});
describe("", () => {
  it("TEST GetRandom SERVICE - 404", async () => {
    const random = Math.random();
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    await expect(recommendationService.getRandom()).rejects.toEqual(
      notFoundError()
    );
    expect(random).toBeGreaterThanOrEqual(0);
  });
  it("TEST GetRandom SERVICE - 200", async () => {
    const random = Math.random();

    const recommendation = [...(await utils.manyRecomendationWithScoreAndId())];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendation);

    await expect(recommendationService.getRandom()).resolves.toBeInstanceOf(
      Object
    );
    expect(recommendation.length).toBeGreaterThan(0);
    expect(random).toBeGreaterThanOrEqual(0);
  });
});
