import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import * as utils from "../utils Test/recommendationRandom";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
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
    jest.spyOn(recommendationRepository, "find").mockRejectedValueOnce(null);
    await expect(
      recommendationService.upvote(recommendation.id)
    ).rejects.toEqual(notFoundError("erro"));

    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
    expect(recommendationRepository.updateScore).not.toHaveBeenCalled();
  });
  it("TEST DownVote SERVICE - 200 Success ", async () => {
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
      score: recommendation.score - 1,
    });
    await expect(
      recommendationService.downvote(recommendation.id)
    ).resolves.not.toThrow();
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation.id,
      "decrement"
    );
    expect(recommendationRepository.remove).not.toHaveBeenCalled();
  });
  it("TEST DownVote SERVICE - 404 Not Found", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: 0,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockRejectedValueOnce(recommendation.id);

    await expect(
      recommendationService.downvote(recommendation.id)
    ).rejects.toEqual(notFoundError());
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
    expect(recommendationRepository.updateScore).not.toHaveBeenCalled();
    expect(recommendationRepository.remove).not.toHaveBeenCalled();
  });

  it("TEST DownVote SERVICE - 200 Success and Delete ID", async () => {
    const recommendation = {
      id: 1,
      ...(await utils.recomendationRandom()),
      score: -5,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: recommendation.score - 1,
    });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValueOnce(recommendation);
    await expect(
      recommendationService.downvote(recommendation.id)
    ).resolves.not.toThrow();
    expect(recommendationRepository.remove).toBeCalledWith(recommendation.id);
    expect(recommendationRepository.find).toHaveBeenCalledWith(
      recommendation.id
    );
    expect(recommendationRepository.updateScore).toBeCalledWith(
      recommendation.id,
      "decrement"
    );
  });

  it("TEST Get SERVICE", async () => {
    // jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce();
  });
  // it.todo("TEST GetTop SERVICE", async () => {});
  // it.todo("TEST GetRandom SERVICE", async () => {});
  // it.todo("TEST GetByScore SERVICE", async () => {});
  // it.todo("TEST GetScoreFilter SERVICE", async () => {});
});
