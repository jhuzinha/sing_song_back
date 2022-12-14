import { faker } from "@faker-js/faker";

async function generatorRandomLink() {
  const randomComplete = faker.datatype.array(1);
  const url = `https://www.youtube.com/watch?v=${randomComplete[0]}`;
  return url;
}

async function recomendationRandom() {
  const recommendation = {
    name: faker.random.words(5),
    youtubeLink: await generatorRandomLink(),
  };
  return recommendation;
}

async function manyRecomendationRandom() {
  const recomendations = [
    await recomendationRandom(),
    await recomendationRandom(),
    await recomendationRandom(),
    await recomendationRandom(),
    await recomendationRandom(),
  ];
  return recomendations;
}

async function manyRecomendationWithScore() {
  const recomendations = [
    { ...(await recomendationRandom()), score: 451 },
    { ...(await recomendationRandom()), score: 200 },
    { ...(await recomendationRandom()), score: 651 },
    { ...(await recomendationRandom()), score: 951 },
    { ...(await recomendationRandom()), score: 551 },
    { ...(await recomendationRandom()), score: 451 },
    { ...(await recomendationRandom()), score: 200 },
    { ...(await recomendationRandom()), score: 651 },
    { ...(await recomendationRandom()), score: 951 },
    { ...(await recomendationRandom()), score: 551 },
    { ...(await recomendationRandom()), score: 451 },
    { ...(await recomendationRandom()), score: 200 },
    { ...(await recomendationRandom()), score: 651 },
    { ...(await recomendationRandom()), score: 951 },
    { ...(await recomendationRandom()), score: 551 },
  ];
  return recomendations;
}

async function manyRecomendationWithScoreAndId() {
  const recomendations = [
    { id: 1, ...(await recomendationRandom()), score: 451 },
    { id: 2, ...(await recomendationRandom()), score: 200 },
    { id: 3, ...(await recomendationRandom()), score: 651 },
    { id: 4, ...(await recomendationRandom()), score: 951 },
    { id: 5, ...(await recomendationRandom()), score: 551 },
    { id: 6, ...(await recomendationRandom()), score: 451 },
    { id: 7, ...(await recomendationRandom()), score: 200 },
    { id: 8, ...(await recomendationRandom()), score: 651 },
    { id: 9, ...(await recomendationRandom()), score: 951 },
    { id: 10, ...(await recomendationRandom()), score: 551 },
    { id: 11, ...(await recomendationRandom()), score: 451 },
    { id: 12, ...(await recomendationRandom()), score: 200 },
    { id: 13, ...(await recomendationRandom()), score: 651 },
    { id: 14, ...(await recomendationRandom()), score: 951 },
    { id: 15, ...(await recomendationRandom()), score: 551 },
  ];
  return recomendations;
}

async function randomAmount() {
  const amount = faker.datatype.number();
  return amount;
}

export {
  recomendationRandom,
  generatorRandomLink,
  manyRecomendationRandom,
  manyRecomendationWithScore,
  randomAmount,
  manyRecomendationWithScoreAndId,
};
