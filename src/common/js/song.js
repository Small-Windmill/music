export default class Song {
  // song的id,mid,歌手,歌曲名name，专辑名album,歌曲长度duration,歌曲图片img,歌曲的真实路径url
  constructor({
    id, singer, name, album, duration, image, url,
  }) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    singer: filterSinger(musicData.ar),
    name: musicData.name,
    album: musicData.al.name,
    duration: (musicData.dt / 1000) | 0,
    image: musicData.al.picUrl,
    url: `https://music.163.com/song/media/outer/url?id=${musicData.id}.mp3`,
  });
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join('/');
}
