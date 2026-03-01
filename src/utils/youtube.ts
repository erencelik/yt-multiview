const YT_PATTERNS: RegExp[] = [
  // Standard watch URL: ?v=VIDEO_ID
  /[?&]v=([a-zA-Z0-9_-]{11})/,
  // Short URL: youtu.be/VIDEO_ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // Embed URL (youtube.com or youtube-nocookie.com)
  /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // Bare 11-character video ID (least specific — must be last)
  /^([a-zA-Z0-9_-]{11})$/,
];

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  for (const pattern of YT_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function buildEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}
