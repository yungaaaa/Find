let buffer;
let node;

// Loads a song
const load = async () => {
  const res = await fetch(`./song.js`);
  const src = await res.text();
  return parse(src);
}

// As we're downloading the song as a string, we need to convert it to JSON
// before we can play it.
//
// This step isn't required when embedding a song directly into your
// production.
const parse = str => {
  str = str.replace(/\[,/g,'[null,')
    .replace(/,,\]/g,',null]')
    .replace(/,\s*(?=[,\]])/g,',null')
    .replace(/([\[,]-?)(?=\.)/g,'$10')
    .replace(/-\./g,'-0.');

  return JSON.parse(str, (key, value) => {
    if (value === null) {
      return undefined;
    }
    return value;
  });
};


// Renders the song. ZzFXM blocks the main thread so defer execution for a few
// ms so that any status message change can be repainted.
const render = song => {
  return new Promise(resolve => {
    setTimeout(() => resolve(zzfxM(...song)), 50);
  });
}

// Sets the current song to the value selected in the UI
const setSong = async () => {

  const isPlaying = !!node;


  if (isPlaying) {
    await stop();
  }

  const song = await load();

  buffer = await render(song);

  if (isPlaying) {
    await play();
  } else {
  }
}

// Play the tune
const play = async () => {
  if (node) {
    return;
  }
  node = zzfxP(...buffer);
  node.loop = true;
  await zzfxX.resume();
}

// Stop playing the tune
const stop = async () => {
  if (!node) {
    return
  }
  await zzfxX.suspend();
  node.stop();
  node.disconnect();
  node = null;
}

// This reduces CPU usage when a song isn't playing
zzfxX.suspend();
stop();
setSong();