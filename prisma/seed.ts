import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      firebaseId: "AHPuxJnbpwZkpL2WviLJQpW4Yiy1",
      username: "edxchavez",
      firstName: "Edgar",
      lastName: "Chávez",
      imageUrl: "https://i.scdn.co/image/ab6775700000ee853b9cf05a6d420f4a8e92543c",
      email: "edchavez821@gmail.com"
    }
  });

  // Create associated userBilling and userAccountManagementData
  await prisma.$transaction([
    prisma.userBilling.create({
      data: {
        userId: user1.userId,
      },
    }),
    prisma.userAccountManagementData.create({
      data: {
        userId: user1.userId,
      },
    }),
  ]);

  const user2 = await prisma.user.create({
    data: {
      firebaseId: "K4CFudlONsbFKAIPgxf4qNklaki1",
      username: "user2",
      firstName: "Ed",
      lastName: "Chaves",
      imageUrl: "https://placehold.co/400",
      email: "edgarchavez82182@gmail.com"
    }
  });

  await prisma.$transaction([
    prisma.userBilling.create({
      data: {
        userId: user2.userId,
      },
    }),
    prisma.userAccountManagementData.create({
      data: {
        userId: user2.userId,
      },
    }),
  ]);

  // Create 3 boxes
  const box1 = await prisma.box.create({
    data: {
      name: "Best albums of 2023",
      description: "This is the first box.",
      creatorId: user1.userId,
      position: 1,
      sectionSettings: {
        createMany: {
          data: [
            { type: "artists" },
            { type: "albums" },
            { type: "tracks" },
            { type: "playlists" }
          ]
        }
      }
    }
  });

  const box2 = await prisma.box.create({
    data: {
      name: "Throwback to the 90s",
      description: "This is the second box.",
      creatorId: user1.userId,
      position: 2,
      sectionSettings: {
        createMany: {
          data: [
            { type: "artists" },
            { type: "albums" },
            { type: "tracks" },
            { type: "playlists" }
          ]
        }
      }
    }
  });

  const box3 = await prisma.box.create({
    data: {
      name: "Música latina",
      description: "This is the third box.",
      creatorId: user1.userId,
      position: 3,
      sectionSettings: {
        createMany: {
          data: [
            { type: "artists" },
            { type: "albums" },
            { type: "tracks" },
            { type: "playlists" }
          ]
        }
      }
    }
  });

  // Create albums
  const album1 = await prisma.album.create({
    data: {
      spotifyId: "6WivmTXugLZLmAWnZhlz7g",
      name: "Heavier Things",
      images: [
        {
          height: 640,
          url: "https://i.scdn.co/image/ab67616d0000b2731a4c7c7e6eeaee67c9e8ce71",
          width: 640
        },
        {
          height: 300,
          url: "https://i.scdn.co/image/ab67616d00001e021a4c7c7e6eeaee67c9e8ce71",
          width: 300
        },
        {
          height: 64,
          url: "https://i.scdn.co/image/ab67616d000048511a4c7c7e6eeaee67c9e8ce71",
          width: 64
        }
      ],
      type: "album",
      albumType: "album",
      artists: [{
        spotifyId: "0hEurMDQu99nJRq8pTxO14",
        name: "John Mayer"
      }],
      releaseDate: "2003-09-09",
      totalTracks: 10
    }
  });

  const album2 = await prisma.album.create({
    data: {
      spotifyId: "5MBHKaOoI0GPDg9moUCZor",
      name: "Man About Town",
      images: [
        {
          height: 640,
          url: "https://i.scdn.co/image/ab67616d0000b27371bf98334c981b940838111e",
          width: 640
        },
        {
          height: 300,
          url: "https://i.scdn.co/image/ab67616d00001e0271bf98334c981b940838111e",
          width: 300
        },
        {
          height: 64,
          url: "https://i.scdn.co/image/ab67616d0000485171bf98334c981b940838111e",
          width: 64
        }
      ],
      type: "album",
      albumType: "album",
      artists: [{
        spotifyId: "4d53BMrRlQkrQMz5d59f2O",
        name: "Mayer Hawthorne"
      }],
      releaseDate: "2016-02-19",
      totalTracks: 10
    }
  });

  const album3 = await prisma.album.create({
    data: {
      spotifyId: "0Cuqhgy8vm96JEkBY3polk",
      name: "Titanic Rising",
      images: [
        {
          height: 640,
          url: "https://i.scdn.co/image/ab67616d0000b2730c64e752dec4c08362cc4a88",
          width: 640
        },
        {
          height: 300,
          url: "https://i.scdn.co/image/ab67616d0000b2730c64e752dec4c08362cc4a88",
          width: 300
        },
        {
          height: 64,
          url: "https://i.scdn.co/image/ab67616d0000b2730c64e752dec4c08362cc4a88",
          width: 64
        }
      ],
      type: "album",
      albumType: "album",
      artists: [{
        spotifyId: "3Uqu1mEdkUJxPe7s31n1M9",
        name: "Weyes Blood"
      }],
      releaseDate: "2019-04-05",
      totalTracks: 10
    }
  });

  // Associate albums with the first box
  await prisma.boxAlbum.createMany({
    data: [
      {
        boxId: box1.boxId,
        albumId: album1.itemId,
        position: 1,
        note: "First album in the box",
      },
      {
        boxId: box1.boxId,
        albumId: album2.itemId,
        position: 2,
        note: "Second album in the box",
      },
      {
        boxId: box1.boxId,
        albumId: album3.itemId,
        position: 3,
        note: "Third album in the box",
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
