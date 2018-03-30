export function ytObjectToPlayableEntityModel(video) {
  return {
    videoId: video.id.videoId,
    kind: video.id.kind,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url || video.snippet.thumbnails.default.url,
    publishedAt: video.snippet.publishedAt,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    addedAt: new Date()
  };
}
