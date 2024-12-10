import { Album, Artist, BoxAlbum, BoxArtist, BoxPlaylist, BoxSubsectionAlbum, BoxSubsectionArtist, BoxSubsectionPlaylist, BoxSubsectionTrack, BoxTrack, Playlist, Track } from "@prisma/client";
import express from "express";

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
  return ({ note: boxItem.note, position: boxItem.position, subsections: subsections, ...item })
}

export function flattenSubsectionItem(subItem: BoxArtist | BoxAlbum | BoxTrack | BoxPlaylist, item: Artist | Album | Track | Playlist){
  return ({ note: subItem.note, position: subItem.position, ...item })
}