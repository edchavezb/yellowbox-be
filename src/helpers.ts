import { Album, Artist, Track, Playlist } from '@prisma/client';
import { BoxAlbum, BoxArtist, BoxPlaylist, BoxTrack } from "@prisma/client";
import express from "express";
import { SubsectionAlbum, SubsectionArtist, SubsectionPlaylist, SubsectionTrack } from "./types/interfaces";

export function extractArrayQueryParam(
  req: express.Request,
  paramName: string
) {
  const param = req.query[paramName];
  if (Array.isArray(param)) {
    return param as string[];
  } else if (param) {
    return [param] as string[]
  }
  return [];
}

export function flattenBoxItem(boxItem: BoxArtist | BoxAlbum | BoxTrack | BoxPlaylist, item: Artist | Album | Track | Playlist, subsections: string[]){
  let boxItemId = null;
  if ((boxItem as BoxArtist).boxArtistId !== undefined){
    boxItemId = (boxItem as BoxArtist).boxArtistId
  } else if ((boxItem as BoxAlbum).boxAlbumId !== undefined){
    boxItemId = (boxItem as BoxAlbum).boxAlbumId
  } else if ((boxItem as BoxTrack).boxTrackId !== undefined){
    boxItemId = (boxItem as BoxTrack).boxTrackId
  } else if ((boxItem as BoxPlaylist).boxPlaylistId !== undefined){
    boxItemId = (boxItem as BoxPlaylist).boxPlaylistId
  }
  return ({ boxItemId, note: boxItem.note, position: boxItem.position, subsections, ...item })
}

export function flattenSubsectionItem(subItem: SubsectionArtist | SubsectionAlbum | SubsectionTrack | SubsectionPlaylist, item: Artist | Album | Track | Playlist){
  let boxItemId = null;
  if ((subItem as SubsectionArtist).boxArtistId !== undefined){
    boxItemId = (subItem as SubsectionArtist).boxArtistId
  } else if ((subItem as SubsectionAlbum).boxAlbumId !== undefined){
    boxItemId = (subItem as SubsectionAlbum).boxAlbumId
  } else if ((subItem as SubsectionTrack).boxTrackId !== undefined){
    boxItemId = (subItem as SubsectionTrack).boxTrackId
  } else if ((subItem as SubsectionPlaylist).boxPlaylistId !== undefined){
    boxItemId = (subItem as SubsectionPlaylist).boxPlaylistId
  }
  const {note, position, subsectionId } = subItem
  return ({ note, position, subsectionId, boxItemId, ...item })
}