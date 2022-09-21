import { faker } from '@faker-js/faker';

async function generatorRandomLink() {
    const randomComplete = faker.datatype.array(1);
    const url = `https://www.youtube.com/watch?v=${randomComplete[0]}`;
    return url
}

async function recomendationRandom() {
    const recommendation = {
        name: faker.random.words(5),
        youtubeLink: await generatorRandomLink()
    }
    return recommendation
}

async function manyRecomendationRandom() {
    const recomendations = [
        await recomendationRandom(),
        await recomendationRandom(),
        await recomendationRandom(),
        await recomendationRandom(),
        await recomendationRandom(),
    ]
    return recomendations
}



export {
    recomendationRandom,
    generatorRandomLink,
    manyRecomendationRandom
}
