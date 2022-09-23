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
  it("TEST Get SERVICE", async () => {
    const recommendation = [...(await utils.manyRecomendationWithScoreAndId())];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendation);
    await expect(recommendationService.get()).resolves.toBeInstanceOf(Object);
  });

  it("TEST GetTop  SERVICE", async () => {
    const recommendation = [...(await utils.manyRecomendationWithScoreAndId())];
    const amount = await utils.randomAmount();
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce(recommendation);
    await expect(recommendationService.getTop(amount)).resolves.not.toThrow();
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
  });
});
