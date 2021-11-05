const { osu } = require("../../main");
const isImageURL = require("image-url-validator").default;
const scoreH = require("./Helpers/score");

module.exports = async (osuID, osuMode, amount) => {
    const profile = await require("./getUser")(osuID, osuMode);

    if(profile.err) return { err: profile.err };
    if(profile.apiErr) return { apiErr: profile.apiErr };

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
    
    return osu.getUserBest({ u: profile.profile.name, m: osuMode }).then(async (scores) => {
        if(scores.length === 0) return { err: `**${profile.profile.name}** doesn't have any recent plays` };

        let pfp = `http://s.ppy.sh/a/${profile.profile.id}`;

        const isImage = await isImageURL(pfp);

        if(!isImage) pfp = "https://osu.ppy.sh/images/layout/avatar-guest.png";

        let rank;
        if(amount === 1 || scores.length === 1){
            const score = await scoreH(scores[0]);

            return {
                user: {
                    name: profile.profile.name,
                    pfp: pfp,
                    link: `https://osu.ppy.sh/users/${profile.profile.id}`
                },
                mode: mode,
                score: score
            }
        } else {
            let scoresArr = [];

            for(let i = 0; i < scores.length || i < amount; i++){
                const score = await scoreH(scores[i]);

                scoresArr.push(score);

                if(i === scores.length - 1 || i === amount - 1){
                    return {
                        user: {
                            name: profile.profile.name,
                            pfp: pfp,
                            link: `https://osu.ppy.sh/users/${profile.profile.id}`
                        },
                        mode: mode,
                        scores: scoresArr
                    }
                }
            }
        }
    })
    .catch((err) => {
        console.log(err);
        return { apiErr: err }
    })
}