-- CreateTable
CREATE TABLE "UserFollow" (
    "userFollowId" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followedUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("userFollowId")
);

-- CreateTable
CREATE TABLE "BoxFollow" (
    "boxFollowId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "boxId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoxFollow_pkey" PRIMARY KEY ("boxFollowId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followedUserId_key" ON "UserFollow"("followerId", "followedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "BoxFollow_userId_boxId_key" ON "BoxFollow"("userId", "boxId");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followedUserId_fkey" FOREIGN KEY ("followedUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxFollow" ADD CONSTRAINT "BoxFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxFollow" ADD CONSTRAINT "BoxFollow_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("boxId") ON DELETE CASCADE ON UPDATE CASCADE;
