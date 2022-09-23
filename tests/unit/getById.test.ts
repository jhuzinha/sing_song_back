import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import * as utils from "../utils Test/recommendationRandom";
import { notFoundError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("UNIT TEST SERVICES", () => {
  it("TEST GetById SERVICE - 200", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: -5,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    await expect(
      recommendationService.getById(recommendation.id)
    ).resolves.not.toThrow();
  });
  it("TEST GetById SERVICE - 404", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: -5,
    };
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    await expect(
      recommendationService.getById(recommendation.id)
    ).rejects.toEqual(notFoundError());
  });
});
