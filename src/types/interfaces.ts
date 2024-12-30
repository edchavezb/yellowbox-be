import { PrismaClient, Album, Artist, Track, Playlist } from '@prisma/client';

export interface UserCreateDTO {
  firebaseId: string
  username: string
  firstName: string
  lastName: string
  image: string
  email: string
  services: {
    [key: string]: string
  }
}

export interface BoxCreateDTO {
  creatorId: string
  position: number
  name: string
  description: string
  isPublic: boolean
}

export interface FolderCreateDTO {
  creator: string
  name: string
  description: string
  isPublic: boolean
}

export interface SpotifyAccountDTO {
  refreshToken: string
  spotifyId: string
}

export interface User {
  auth: UserAuth
  userData: UserData
}

export interface UserData {
  displayName: string
  userId: string
  uri: string
  image: string
  email: string
}

export interface UserAuth {
  code: string | null
  refreshToken: string | null
}

export interface UserBilling {
  stripeData?: {
    customerId: string
    subscription: {
      subscriptionId: string
      status: string
      priceId: string
      productId: string
    }
  }
}

export interface UserAccountData {
  accountTier: string
  showTutorial: boolean
  signUpDate: string
  emailVerified: boolean
  email: string
}

export interface UserBox {
  id: string
  name: string
  public: boolean
  creator: string
  description: string
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
  sectionSorting: SectionSorting
  sectionVisibility: Visibility
  subSections: { type: string, name: string }[]
  notes: { itemId: string, noteText: string }[]
}

export interface SectionSorting {
  artists: Sorting
  albums: Sorting
  tracks: Sorting
  playlists: Sorting
}

export interface Sorting {
  primarySorting: string
  secondarySorting: string
  view: string
  ascendingOrder: boolean
  displayGrouping: boolean
  displaySubSections: boolean
}

export interface Visibility {
  artists: boolean
  albums: boolean
  tracks: boolean
  playlists: boolean
}

export interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

export interface SubsectionArtist {
  position: number; 
  boxArtistId: string; 
  subsectionId: string; 
  note: string | null; 
  boxArtist: { artist: Artist; };
} 

export interface SubsectionAlbum {
  position: number; 
  boxAlbumId: string; 
  subsectionId: string; 
  note: string | null; 
  boxAlbum: { album: Album; };
}

export interface SubsectionTrack {
  position: number; 
  boxTrackId: string; 
  subsectionId: string; 
  note: string | null; 
  boxTrack: { track: Track; };
}

export interface SubsectionPlaylist {
  position: number; 
  boxPlaylistId: string; 
  subsectionId: string; 
  note: string | null; 
  boxPlaylist: { playlist: Playlist; };
}

export interface SpotifyUser {
  display_name?: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
}

export interface PlaylistItem {
  added_at: string
  added_by: SpotifyUser
  is_local: boolean
  primary_color: string
  track: any // TODO: Hey bro you need to do something here
}

export interface ItemImage {
  height?: number | null
  url: string
  width?: number | null
}

export interface ModalState {
  itemData?: Artist | Album | Track | Playlist
  visible: boolean
  type: string
  boxId: string
  page: string
}