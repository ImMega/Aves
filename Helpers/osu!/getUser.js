const { osu } = require("../../main");
const isImageURL = require("image-url-validator").default;

module.exports = (osuID, osuMode) => {
    return osu.getUser({ u: osuID, m: osuMode })
    .then(async (user) => {
        if(user.length === 0) return { err: `**${osuID}** not found` };

        let mode;
        if(!osuMode || osuMode === 0){
            mode = "osu!standard";
        } else if(osuMode === 1){
            mode = "osu!taiko";
        } else if(osuMode === 2){
            mode = "osu!catch";
        } else if(osuMode === 3){
            mode = "osu!mania";
        }

        const osuRank = new Intl.NumberFormat().format(user.pp.rank);
        const osuCountryRank = new Intl.NumberFormat().format(user.pp.countryRank);
        const osuPP = Number.parseFloat(user.pp.raw).toFixed(2);
        const playTime = Math.floor(user.secondsPlayed / 60) / 60;
        const osuPlayTime = Number.parseFloat(playTime).toFixed(0);
        const osuLvl = Math.floor(user.level);
        const toNewLvl = (user.level - osuLvl) * 100;
        const osuToNewLvl = Number.parseFloat(toNewLvl).toFixed(0);
        const osuPlayCount = new Intl.NumberFormat().format(user.counts.plays);
        const osuScore = new Intl.NumberFormat().format(user.scores.total);
        const osuScoreRanked = new Intl.NumberFormat().format(user.scores.ranked);

        let pfp = `http://s.ppy.sh/a/${user.id}`;

        const isImage = await isImageURL(pfp);

        if(!isImage) pfp = "https://osu.ppy.sh/images/layout/avatar-guest.png";

        return {
            profile: {
                name: user.name,
                id: user.id,
                country: {
                    code: user.country,
                    icon: `https://osu.ppy.sh/images/flags/${user.country}.png`
                },
                pfp: pfp,
                joinDate: user.joinDate,
                link: `https://osu.ppy.sh/users/${user.id}`
            },
            mode: mode,
            acc: user.accuracyFormatted,
            rank: {
                global: osuRank,
                country: osuCountryRank
            },
            pp: osuPP,
            plays: {
                hours: osuPlayTime,
                count: osuPlayCount
            },
            level: {
                current: osuLvl,
                progress: osuToNewLvl
            },
            scores: {
                total: osuScore,
                ranked: osuScoreRanked
            }
        };
    })
    .catch((err) => {
        console.log(err);
        return { apiErr: err };
    })
}