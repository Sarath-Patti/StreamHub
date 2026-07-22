import { PrismaClient, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with catalog data...');

  // Create Genres
  const action = await prisma.genre.upsert({
    where: { name: 'Action' },
    update: {},
    create: { name: 'Action' },
  });

  const scifi = await prisma.genre.upsert({
    where: { name: 'Sci-Fi' },
    update: {},
    create: { name: 'Sci-Fi' },
  });

  const drama = await prisma.genre.upsert({
    where: { name: 'Drama' },
    update: {},
    create: { name: 'Drama' },
  });

  const thriller = await prisma.genre.upsert({
    where: { name: 'Thriller' },
    update: {},
    create: { name: 'Thriller' },
  });

  // Seed Movies
  await prisma.content.create({
    data: {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      type: ContentType.MOVIE,
      releaseYear: 2010,
      duration: 148,
      language: 'English',
      rating: 8.8,
      posterUrl: 'https://example.com/inception-poster.jpg',
      bannerUrl: 'https://example.com/inception-banner.jpg',
      isTrending: true,
      genres: {
        connect: [{ id: action.id }, { id: scifi.id }, { id: thriller.id }],
      },
    },
  });

  await prisma.content.create({
    data: {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
      type: ContentType.MOVIE,
      releaseYear: 2014,
      duration: 169,
      language: 'English',
      rating: 8.6,
      posterUrl: 'https://example.com/interstellar-poster.jpg',
      bannerUrl: 'https://example.com/interstellar-banner.jpg',
      isTrending: true,
      genres: {
        connect: [{ id: scifi.id }, { id: drama.id }],
      },
    },
  });

  // Seed TV Series
  await prisma.content.create({
    data: {
      title: 'Stranger Things',
      description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      type: ContentType.SERIES,
      releaseYear: 2016,
      language: 'English',
      rating: 8.7,
      posterUrl: 'https://example.com/stranger-things-poster.jpg',
      bannerUrl: 'https://example.com/stranger-things-banner.jpg',
      isTrending: true,
      genres: {
        connect: [{ id: scifi.id }, { id: drama.id }, { id: thriller.id }],
      },
      seasons: {
        create: [
          {
            seasonNumber: 1,
            title: 'Season 1',
            description: 'The disappearance of Will Byers',
            episodes: {
              create: [
                {
                  episodeNumber: 1,
                  title: 'Chapter One: The Vanishing of Will Byers',
                  description: 'On his way home from a friend house, young Will sees something terrifying.',
                  duration: 48,
                },
                {
                  episodeNumber: 2,
                  title: 'Chapter Two: The Weirdo on Maple Street',
                  description: 'Lucas, Dustin and Mike try to talk to the girl they found in the woods.',
                  duration: 55,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
