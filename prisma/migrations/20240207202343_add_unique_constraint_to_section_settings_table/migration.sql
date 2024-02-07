-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "linked_services" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserAccountManagementData" (
    "account_management_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "account_tier" TEXT NOT NULL,
    "sign_up_date" TIMESTAMP(3) NOT NULL,
    "email_verified" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "show_tutorial" BOOLEAN NOT NULL,

    CONSTRAINT "UserAccountManagementData_pkey" PRIMARY KEY ("account_management_id")
);

-- CreateTable
CREATE TABLE "UserBilling" (
    "user_billing_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "stripe_subscription_status" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "stripe_product_id" TEXT NOT NULL,

    CONSTRAINT "UserBilling_pkey" PRIMARY KEY ("user_billing_id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folder_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folder_id")
);

-- CreateTable
CREATE TABLE "Box" (
    "box_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "folder_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("box_id")
);

-- CreateTable
CREATE TABLE "BoxArtist" (
    "artist_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxArtist_pkey" PRIMARY KEY ("artist_id","box_id")
);

-- CreateTable
CREATE TABLE "BoxTrack" (
    "track_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxTrack_pkey" PRIMARY KEY ("track_id","box_id")
);

-- CreateTable
CREATE TABLE "BoxAlbum" (
    "album_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxAlbum_pkey" PRIMARY KEY ("album_id","box_id")
);

-- CreateTable
CREATE TABLE "BoxPlaylist" (
    "playlist_id" UUID NOT NULL,
    "box_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxPlaylist_pkey" PRIMARY KEY ("playlist_id","box_id")
);

-- CreateTable
CREATE TABLE "BoxSectionSettings" (
    "section_settings_id" SERIAL NOT NULL,
    "box_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "primary_sorting" TEXT NOT NULL,
    "secondary_sorting" TEXT NOT NULL,
    "view" TEXT NOT NULL,
    "sorting_order" TEXT NOT NULL,
    "display_grouping" BOOLEAN NOT NULL,
    "display_subsections" BOOLEAN NOT NULL,
    "visibility" BOOLEAN NOT NULL,

    CONSTRAINT "BoxSectionSettings_pkey" PRIMARY KEY ("section_settings_id")
);

-- CreateTable
CREATE TABLE "BoxSubsection" (
    "subsection_id" SERIAL NOT NULL,
    "box_id" UUID NOT NULL,
    "item_type" TEXT NOT NULL,
    "subsection_name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BoxSubsection_pkey" PRIMARY KEY ("subsection_id")
);

-- CreateTable
CREATE TABLE "BoxSubsectionArtist" (
    "artist_id" UUID NOT NULL,
    "box_subsection_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxSubsectionArtist_pkey" PRIMARY KEY ("artist_id","box_subsection_id")
);

-- CreateTable
CREATE TABLE "BoxSubsectionAlbum" (
    "album_id" UUID NOT NULL,
    "box_subsection_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxSubsectionAlbum_pkey" PRIMARY KEY ("album_id","box_subsection_id")
);

-- CreateTable
CREATE TABLE "BoxSubsectionTrack" (
    "track_id" UUID NOT NULL,
    "box_subsection_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxSubsectionTrack_pkey" PRIMARY KEY ("track_id","box_subsection_id")
);

-- CreateTable
CREATE TABLE "BoxSubsectionPlaylist" (
    "playlist_id" UUID NOT NULL,
    "box_subsection_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BoxSubsectionPlaylist_pkey" PRIMARY KEY ("playlist_id","box_subsection_id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "artist_id" UUID NOT NULL,
    "spotify_url" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "spotify_uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "genres" TEXT[],
    "type" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("artist_id")
);

-- CreateTable
CREATE TABLE "Album" (
    "album_id" UUID NOT NULL,
    "spotify_url" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "spotify_uri" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "album_type" TEXT NOT NULL,
    "artists" JSONB NOT NULL,
    "release_date" TEXT NOT NULL,
    "total_tracks" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("album_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlist_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "spotify_url" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "spotify_uri" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_uri" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "total_tracks" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateTable
CREATE TABLE "Track" (
    "track_id" UUID NOT NULL,
    "spotify_url" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "spotify_uri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artists" JSONB NOT NULL,
    "album_name" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "explicit" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("track_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccountManagementData_user_id_key" ON "UserAccountManagementData"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBilling_user_id_key" ON "UserBilling"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BoxSectionSettings_box_id_key" ON "BoxSectionSettings"("box_id");

-- AddForeignKey
ALTER TABLE "UserAccountManagementData" ADD CONSTRAINT "UserAccountManagementData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBilling" ADD CONSTRAINT "UserBilling_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("folder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("artist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxArtist" ADD CONSTRAINT "BoxArtist_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("track_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxTrack" ADD CONSTRAINT "BoxTrack_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("album_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxAlbum" ADD CONSTRAINT "BoxAlbum_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("playlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxPlaylist" ADD CONSTRAINT "BoxPlaylist_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSectionSettings" ADD CONSTRAINT "BoxSectionSettings_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsection" ADD CONSTRAINT "BoxSubsection_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("box_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("artist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionArtist" ADD CONSTRAINT "BoxSubsectionArtist_box_subsection_id_fkey" FOREIGN KEY ("box_subsection_id") REFERENCES "BoxSubsection"("subsection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("album_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionAlbum" ADD CONSTRAINT "BoxSubsectionAlbum_box_subsection_id_fkey" FOREIGN KEY ("box_subsection_id") REFERENCES "BoxSubsection"("subsection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "Track"("track_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionTrack" ADD CONSTRAINT "BoxSubsectionTrack_box_subsection_id_fkey" FOREIGN KEY ("box_subsection_id") REFERENCES "BoxSubsection"("subsection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("playlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxSubsectionPlaylist" ADD CONSTRAINT "BoxSubsectionPlaylist_box_subsection_id_fkey" FOREIGN KEY ("box_subsection_id") REFERENCES "BoxSubsection"("subsection_id") ON DELETE RESTRICT ON UPDATE CASCADE;
