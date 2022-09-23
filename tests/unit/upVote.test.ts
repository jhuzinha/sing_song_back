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
  it("TEST UpVote SERVICE - 200 Success", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: 0,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: recommendation.score + 1,
    });
    await expect(
      recommendationService.upvote(recommendation.id)
    ).resolves.not.toThrow();
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation.id,
      "increment"
    );
  });
  it("TEST UpVote SERVICE - 404 Not Found", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: 0,
    };
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    await expect(
      recommendationService.upvote(recommendation.id)
    ).rejects.toStrictEqual(notFoundError());

    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
  });
});
