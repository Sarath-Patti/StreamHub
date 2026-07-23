import { PrismaClient, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

const GENRES = [
  'Action',
  'Adventure',
  'Drama',
  'Comedy',
  'Thriller',
  'Sci-Fi',
  'Crime',
  'Animation',
  'Fantasy',
  'Documentary',
];

interface ContentSeedData {
  title: string;
  description: string;
  type: ContentType;
  releaseYear: number;
  duration?: number;
  language: string;
  rating: number;
  posterUrl: string;
  bannerUrl: string;
  isTrending: boolean;
  genreNames: string[];
  seasons?: {
    seasonNumber: number;
    title: string;
    description: string;
    episodes: {
      create: {
        episodeNumber: number;
        title: string;
        description: string;
        duration: number;
      }[];
    };
  }[];
}

const SEED_ITEMS: ContentSeedData[] = [
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    type: ContentType.MOVIE,
    releaseYear: 2010,
    duration: 148,
    language: 'English',
    rating: 8.8,
    posterUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Sci-Fi', 'Thriller'],
  },
  {
    title: 'Interstellar',
    description:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    type: ContentType.MOVIE,
    releaseYear: 2014,
    duration: 169,
    language: 'English',
    rating: 8.6,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Sci-Fi', 'Drama', 'Adventure'],
  },
  {
    title: 'Stranger Things',
    description:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    type: ContentType.SERIES,
    releaseYear: 2016,
    duration: 50,
    language: 'English',
    rating: 8.7,
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Sci-Fi', 'Drama', 'Thriller'],
    seasons: [
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
  {
    title: 'Avatar',
    description:
      'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    type: ContentType.MOVIE,
    releaseYear: 2009,
    duration: 162,
    language: 'English',
    rating: 7.9,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
  },
  {
    title: 'Avatar: The Way of Water',
    description:
      'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    type: ContentType.MOVIE,
    releaseYear: 2022,
    duration: 192,
    language: 'English',
    rating: 7.6,
    posterUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
  },
  {
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    type: ContentType.MOVIE,
    releaseYear: 2008,
    duration: 152,
    language: 'English',
    rating: 9.0,
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Crime', 'Drama', 'Thriller'],
  },
  {
    title: 'The Matrix',
    description:
      'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth - the life he knows is the elaborate deception of an evil cyber-intelligence.',
    type: ContentType.MOVIE,
    releaseYear: 1999,
    duration: 136,
    language: 'English',
    rating: 8.7,
    posterUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Sci-Fi'],
  },
  {
    title: 'Dune',
    description:
      'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir is troubled by visions of a dark future.',
    type: ContentType.MOVIE,
    releaseYear: 2021,
    duration: 155,
    language: 'English',
    rating: 8.0,
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Adventure', 'Sci-Fi'],
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    type: ContentType.MOVIE,
    releaseYear: 2023,
    duration: 180,
    language: 'English',
    rating: 8.9,
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Drama', 'Thriller'],
  },
  {
    title: 'Breaking Bad',
    description:
      'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family\'s financial future.',
    type: ContentType.SERIES,
    releaseYear: 2008,
    duration: 49,
    language: 'English',
    rating: 9.5,
    posterUrl:
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Crime', 'Drama', 'Thriller'],
  },
  {
    title: 'The Last of Us',
    description:
      'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    type: ContentType.SERIES,
    releaseYear: 2023,
    duration: 50,
    language: 'English',
    rating: 8.8,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
  },
  {
    title: 'Arcane',
    description:
      'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.',
    type: ContentType.SERIES,
    releaseYear: 2021,
    duration: 40,
    language: 'English',
    rating: 9.0,
    posterUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Animation', 'Action', 'Sci-Fi', 'Fantasy'],
  },
  {
    title: 'The Boys',
    description:
      'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers and corporate backing.',
    type: ContentType.SERIES,
    releaseYear: 2019,
    duration: 60,
    language: 'English',
    rating: 8.7,
    posterUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Comedy', 'Crime', 'Sci-Fi'],
  },
  {
    title: 'The Office',
    description:
      'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    type: ContentType.SERIES,
    releaseYear: 2005,
    duration: 22,
    language: 'English',
    rating: 9.0,
    posterUrl:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Comedy'],
  },
  {
    title: 'Sherlock',
    description:
      'A modern update finds the famous sleuth and his doctor partner solving crime in 21st-century London.',
    type: ContentType.SERIES,
    releaseYear: 2010,
    duration: 88,
    language: 'English',
    rating: 9.1,
    posterUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Crime', 'Drama', 'Thriller'],
  },
  {
    title: 'Chernobyl',
    description:
      'In April 1986, an explosion at the Chernobyl nuclear power plant in the Ukrainian Soviet Socialist Republic becomes one of the world\'s worst man-made catastrophes.',
    type: ContentType.SERIES,
    releaseYear: 2019,
    duration: 60,
    language: 'English',
    rating: 9.4,
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Drama', 'Thriller'],
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    description:
      'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    type: ContentType.MOVIE,
    releaseYear: 2018,
    duration: 117,
    language: 'English',
    rating: 8.4,
    posterUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
  },
  {
    title: 'Pulp Fiction',
    description:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    type: ContentType.MOVIE,
    releaseYear: 1995,
    duration: 154,
    language: 'English',
    rating: 8.9,
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Crime', 'Drama'],
  },
  {
    title: 'Gladiator',
    description:
      'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    type: ContentType.MOVIE,
    releaseYear: 2000,
    duration: 155,
    language: 'English',
    rating: 8.5,
    posterUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Adventure', 'Drama'],
  },
  {
    title: 'Spirited Away',
    description:
      'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    type: ContentType.MOVIE,
    releaseYear: 2001,
    duration: 125,
    language: 'Japanese',
    rating: 8.6,
    posterUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Animation', 'Adventure', 'Fantasy'],
  },
  {
    title: 'Parasite',
    description:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    type: ContentType.MOVIE,
    releaseYear: 2019,
    duration: 132,
    language: 'Korean',
    rating: 8.5,
    posterUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Drama', 'Thriller', 'Comedy'],
  },
  {
    title: 'Planet Earth II',
    description:
      'David Attenborough returns with a new wildlife documentary exploring the habitats of planet Earth.',
    type: ContentType.SERIES,
    releaseYear: 2016,
    duration: 50,
    language: 'English',
    rating: 9.5,
    posterUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Documentary'],
  },
  {
    title: 'The Mandalorian',
    description:
      'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    type: ContentType.SERIES,
    releaseYear: 2019,
    duration: 40,
    language: 'English',
    rating: 8.7,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Adventure', 'Sci-Fi', 'Fantasy'],
  },
  {
    title: 'Succession',
    description:
      'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down.',
    type: ContentType.SERIES,
    releaseYear: 2018,
    duration: 60,
    language: 'English',
    rating: 8.9,
    posterUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Drama'],
  },
  {
    title: 'Ted Lasso',
    description:
      'American college football coach Ted Lasso is hired to coach a British soccer team. What he lacks in knowledge, he makes up for with optimism... and biscuits.',
    type: ContentType.SERIES,
    releaseYear: 2020,
    duration: 30,
    language: 'English',
    rating: 8.8,
    posterUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Comedy', 'Drama'],
  },
  {
    title: 'Everything Everywhere All at Once',
    description:
      'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    type: ContentType.MOVIE,
    releaseYear: 2022,
    duration: 139,
    language: 'English',
    rating: 7.8,
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
  },
  {
    title: 'Whiplash',
    description:
      'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    type: ContentType.MOVIE,
    releaseYear: 2014,
    duration: 106,
    language: 'English',
    rating: 8.5,
    posterUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Drama'],
  },
  {
    title: 'Cyberpunk: Edgerunners',
    description:
      'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.',
    type: ContentType.SERIES,
    releaseYear: 2022,
    duration: 24,
    language: 'Japanese',
    rating: 8.3,
    posterUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Animation', 'Action', 'Sci-Fi'],
  },
  {
    title: 'Game of Thrones',
    description:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for a millennia.',
    type: ContentType.SERIES,
    releaseYear: 2011,
    duration: 57,
    language: 'English',
    rating: 9.2,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Adventure', 'Drama', 'Fantasy'],
  },
  {
    title: 'No Country for Old Men',
    description:
      'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.',
    type: ContentType.MOVIE,
    releaseYear: 2007,
    duration: 122,
    language: 'English',
    rating: 8.2,
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Crime', 'Drama', 'Thriller'],
  },
  {
    title: 'The Grand Budapest Hotel',
    description:
      'A writer encounters the owner of a high-class hotel who tells of his early years as a lobby boy during the hotel\'s glorious years between the two World Wars.',
    type: ContentType.MOVIE,
    releaseYear: 2014,
    duration: 99,
    language: 'English',
    rating: 8.1,
    posterUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Comedy', 'Adventure'],
  },
  {
    title: 'Free Solo',
    description:
      'Alex Honnold attempts to become the first person to ever free solo climb El Capitan -- a 3,000-foot high vertical rock face in Yosemite National Park.',
    type: ContentType.MOVIE,
    releaseYear: 2018,
    duration: 100,
    language: 'English',
    rating: 8.1,
    posterUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Documentary', 'Adventure'],
  },
  {
    title: 'Severance',
    description:
      'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    type: ContentType.SERIES,
    releaseYear: 2022,
    duration: 55,
    language: 'English',
    rating: 8.7,
    posterUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Drama', 'Sci-Fi', 'Thriller'],
  },
  {
    title: 'Blade Runner 2049',
    description:
      'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    type: ContentType.MOVIE,
    releaseYear: 2017,
    duration: 164,
    language: 'English',
    rating: 8.0,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Drama', 'Sci-Fi', 'Thriller'],
  },
  {
    title: 'Knives Out',
    description:
      'A detective investigates the death of a patriarch of an eccentric, combative family.',
    type: ContentType.MOVIE,
    releaseYear: 2019,
    duration: 130,
    language: 'English',
    rating: 7.9,
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Comedy', 'Crime', 'Drama', 'Thriller'],
  },
  {
    title: 'Our Planet',
    description:
      'Documentary series focusing on the breadth of the diversity of habitats around the world, from the remote Arctic wilderness and mysterious deep oceans to the vast landscapes of Africa.',
    type: ContentType.SERIES,
    releaseYear: 2019,
    duration: 50,
    language: 'English',
    rating: 9.3,
    posterUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Documentary'],
  },
  {
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    type: ContentType.MOVIE,
    releaseYear: 2024,
    duration: 166,
    language: 'English',
    rating: 8.6,
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Action', 'Adventure', 'Sci-Fi'],
  },
  {
    title: 'Bojack Horseman',
    description:
      'BoJack Horseman was the star of the hit TV show "Horsin\' Around" in the 90s, now he\'s washed up, living in Hollywood, complaining about everything, and wearing colorful sweaters.',
    type: ContentType.SERIES,
    releaseYear: 2014,
    duration: 25,
    language: 'English',
    rating: 8.8,
    posterUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Animation', 'Comedy', 'Drama'],
  },
  {
    title: 'The Matrix Resurrections',
    description:
      'Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Neo will have to choose to follow the white rabbit once more.',
    type: ContentType.MOVIE,
    releaseYear: 2021,
    duration: 148,
    language: 'English',
    rating: 5.7,
    posterUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    isTrending: false,
    genreNames: ['Action', 'Sci-Fi'],
  },
  {
    title: 'Beyond Good & Evil: Chronicles',
    description:
      'In a futuristic metropolis, a rebel photojournalist uncovers an alien conspiracy threatening the planet\'s last remaining sanctuary.',
    type: ContentType.MOVIE,
    releaseYear: 2026,
    duration: 120,
    language: 'English',
    rating: 7.4,
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    isTrending: true,
    genreNames: ['Sci-Fi', 'Action', 'Fantasy'],
  },
];

async function main() {
  console.log('Seeding database with expanded catalog data...');

  // 1. Ensure all genres exist
  const genreMap: Record<string, string> = {};
  for (const name of GENRES) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genreMap[name] = genre.id;
  }

  // 2. Seed content items idempotently
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of SEED_ITEMS) {
    const genreConnects = item.genreNames
      .map((name) => genreMap[name])
      .filter(Boolean)
      .map((id) => ({ id }));

    const existing = await prisma.content.findFirst({
      where: { title: item.title },
    });

    if (existing) {
      await prisma.content.update({
        where: { id: existing.id },
        data: {
          description: item.description,
          type: item.type,
          releaseYear: item.releaseYear,
          duration: item.duration,
          language: item.language,
          rating: item.rating,
          posterUrl: item.posterUrl,
          bannerUrl: item.bannerUrl,
          isTrending: item.isTrending,
          genres: {
            set: genreConnects,
          },
        },
      });
      updatedCount++;
    } else {
      await prisma.content.create({
        data: {
          title: item.title,
          description: item.description,
          type: item.type,
          releaseYear: item.releaseYear,
          duration: item.duration,
          language: item.language,
          rating: item.rating,
          posterUrl: item.posterUrl,
          bannerUrl: item.bannerUrl,
          isTrending: item.isTrending,
          genres: {
            connect: genreConnects,
          },
          ...(item.seasons
            ? {
                seasons: {
                  create: item.seasons,
                },
              }
            : {}),
        },
      });
      createdCount++;
    }
  }

  console.log(
    `Seeding finished. ${createdCount} created, ${updatedCount} updated. Total items in batch: ${SEED_ITEMS.length}.`
  );
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
