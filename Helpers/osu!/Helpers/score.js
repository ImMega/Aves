module.exports = async (score) => {
    console.log(score);
    let mods = score.mods.join("");
    let pp = score.pp;

    const acc = (Number.parseFloat(score.accuracy).toFixed(4) * 100).toFixed(2);
    const stars = Number.parseFloat(score.beatmap.difficulty.rating).toFixed(2);
    const scoreS = new Intl.NumberFormat().format(score.score);

    if(pp !== null) pp = Number.parseFloat(score.pp).toFixed(2);
    

    mods = mods.replace(`NoFail`, `NF`)
    .replace(`Easy`, `EZ`)
    .replace(`Hidden`, `HD`)
    .replace(`HardRock`, `HR`)
    .replace(`SuddenDeath`, `SD`)
    .replace(`DoubleTime`, `DT`)
    .replace(`Relax`, `RX`)
    .replace(`HalfTime`, `HT`)
    .replace(`DTNightcore`, `NC`)
    .replace(`Flashlight`, `FL`)
    .replace(`Autoplay`, `AO`)
    .replace(`SpunOut`, `SO`)
    .replace(`Relax2`, `AP`)
    .replace(`SDPerfect`, `PF`)
    .replace(`FreeModAllowed`, ``)
    .replace(`ScoreIncreaseMods`, ``)

    if(mods === "") mods = "No Mod"

    if(score.rank === `XH`) rank = `<:rankSSH:905599033156993065>`;
    if(score.rank === `SH`) rank = `<:rankSH:905599033119244288>`;
    if(score.rank === `X`) rank = `<:rankSS:905599033098256404>`;
    if(score.rank === `S`) rank = `<:rankS:905599033119244338>`;
    if(score.rank === `A`) rank = `<:rankA:905599033056297040>`;
    if(score.rank === `B`) rank = `<:rankB:905599033035345980>`;
    if(score.rank === `C`) rank = `<:rankC:905599033194713128>`;
    if(score.rank === `D`) rank = `<:rankD:905599032611733525>`;
    if(score.rank === `F`) rank = `<:rankF:905599033094053888>`;

    return {
        beatmap: {
            setId: score.beatmap.beatmapSetId,
            mapId: score.beatmapId,
            mapLink: `https://osu.ppy.sh/beatmapsets/${score.beatmap.beatmapSetId}#osu/${score.beatmapId}`,
            thumbnail: `https://b.ppy.sh/thumb/${score.beatmap.beatmapSetId}l.jpg`,
            title: score.beatmap.title,
            artist: score.beatmap.artist,
            creator: score.beatmap.creator,
            diff: score.beatmap.version,
            maxCombo: score.beatmap.maxCombo,
            status: score.beatmap.approvalStatus
        },
        rank: {
            grade: score.rank,
            emoji: rank
        },
        mods: mods,
        acc: acc,
        starDiff: stars,
        pp: pp,
        score: scoreS,
        combo: score.maxCombo,
        counts: {
            "300": score.counts[300],
            "100": score.counts[100],
            "50": score.counts[50],
            miss: score.counts.miss
        },
        date: score.date
    }
}