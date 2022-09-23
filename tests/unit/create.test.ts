import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import * as utils from "../utils Test/recommendationRandom";
import { conflictError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("UNIT TEST SERVICES", () => {
  it("TEST Insert SERVICE - 201 Created", async () => {
    const recommendation = await utils.recomendationRandom();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);
    await expect(
      recommendationService.insert(recommendation)
    ).resolves.not.toThrow();
    expect(recommendationRepository.findByName).toHaveBeenCalledWith(
      recommendation.name
    );
  });
  it("TEST Insert SERVICE - 409 Conflict ", async () => {
    const recommendation = await utils.recomendationRandom();
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
      id: 1,
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
      score: 0,
    });
    await expect(recommendationService.insert(recommendation)).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
    expect(recommendationRepository.findByName).toBeCalledWith(
      recommendation.name
    );
  });
});
