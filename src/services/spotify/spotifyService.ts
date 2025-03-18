import axios from "axios";
import querystring from "querystring";

const credentials = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
};

const spotifyService = {
  async getAccessToken() {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "client_credentials",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          credentials.id + ":" + credentials.secret
        ).toString("base64")}`,
      },
    });
    return response.data.access_token;
  },

  async getUserAccessToken(refresh_token: string) {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          credentials.id + ":" + credentials.secret
        ).toString("base64")}`,
      },
    });
    return response.data.access_token;
  },

  async getTracksData(accessToken: string, trackIds: string[]) {
    const response = await axios({
      method: "get",
      url: `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.tracks;
  },

  async getAlbumsData(accessToken: string, albumIds: string[]) {
    const response = await axios({
      method: "get",
      url: `https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.albums;
  },

  async getPlaylistsData(accessToken: string, playlistIds: string[]) {
    const response = await axios({
      method: "get",
      url: `https://api.spotify.com/v1/playlists?ids=${playlistIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.playlists;
  },

  async getArtistsData(accessToken: string, artistIds: string[]) {
    const response = await axios({
      method: "get",
      url: `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.artists;
  },
};

export default spotifyService;