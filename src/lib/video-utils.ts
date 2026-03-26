/**
 * Video platform utilities — support YouTube and Vimeo embeds/thumbnails.
 */

export type VideoPlatform = "youtube" | "vimeo";

/** Detect platform from video object */
export function getPlatform(video: { id?: string; platform?: string; url?: string }): VideoPlatform {
  if (video.platform === "vimeo") return "vimeo";
  if (video.id?.startsWith("vimeo:")) return "vimeo";
  if (video.url?.includes("vimeo.com")) return "vimeo";
  return "youtube";
}

/** Extract the numeric Vimeo ID from "vimeo:123456" format */
export function getVimeoId(id: string): string {
  return id.startsWith("vimeo:") ? id.slice(6) : id;
}

/** Get embed URL for iframe */
export function getEmbedUrl(video: { id: string; platform?: string; url?: string }): string {
  if (getPlatform(video) === "vimeo") {
    return `https://player.vimeo.com/video/${getVimeoId(video.id)}?dnt=1`;
  }
  return `https://www.youtube.com/embed/${video.id}`;
}

/** Get thumbnail URL */
export function getThumbnailUrl(
  video: { id: string; platform?: string; url?: string },
  quality: "mq" | "hq" | "max" = "mq"
): string {
  if (getPlatform(video) === "vimeo") {
    // Vimeo doesn't have a simple static thumbnail URL like YouTube.
    // Use vumbnail.com (free, no API key needed) as a proxy.
    const vid = getVimeoId(video.id);
    return `https://vumbnail.com/${vid}.jpg`;
  }
  const ytQuality = quality === "max" ? "maxresdefault" : quality === "hq" ? "hqdefault" : "mqdefault";
  return `https://img.youtube.com/vi/${video.id}/${ytQuality}.jpg`;
}

/** Get watch/view URL (for mobile link) */
export function getWatchUrl(video: { id: string; platform?: string; url?: string }): string {
  if (getPlatform(video) === "vimeo") {
    return video.url || `https://vimeo.com/${getVimeoId(video.id)}`;
  }
  return `https://www.youtube.com/watch?v=${video.id}`;
}
