-- CreateEnum
CREATE TYPE "ReviewSentiment" AS ENUM ('LIKE', 'DISLIKE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "ArtistReview" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "reviewSentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ArtistReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackReview" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "reviewSentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrackReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumReview" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "reviewSentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AlbumReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistReview" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "reviewSentiment" "ReviewSentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlaylistReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArtistReview" ADD CONSTRAINT "ArtistReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackReview" ADD CONSTRAINT "TrackReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumReview" ADD CONSTRAINT "AlbumReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistReview" ADD CONSTRAINT "PlaylistReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
