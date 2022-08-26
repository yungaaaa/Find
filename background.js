var buffer, node;

const load = async () => {
    const res = await fetch('./song.js');
    const src = await res.text();
    return parse(src);
}
const render = song => {
    return new Promise(resolve => {
        setTimeout(() => resolve(zzfxM(...song)), 50);
    })
}
const play = async () => {
    if (node) return;
    node = zzfxP(...buffer);
    node.loop = true;
    await zzfxM.resume();
}

const stop = async () => {
    if (!node) return;
    await zzfxM.suspend();
    node.stop();
    node.disconnect();
    node = null;
}

const parse = str => {
    str = str.replace(/\[,/g, '[null,')
        .replace(/,,\]/g, ',null]')
        .replace(/,\s*(?=[,\]])/g, ',null')
        .replace(/([\[,]-?)(?=\.)/g, '$10')
        .replace(/-\./g, '-0.');

    return JSON.parse(str, (key, value) => {
        if (value === null) {
            return undefined;
        }
        return value;
    });
}

const song = await load();
buffer = render(song);
await play();