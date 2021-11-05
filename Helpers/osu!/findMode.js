module.exports = async (flag) => {
    const std = ["-standard", "-std", "-0"].includes(flag);
    const taiko = ["-taiko", "-1"].includes(flag);
    const ctb = ["-ctb", "-catch", "-2"].includes(flag);
    const mania = ["-mania", "-3"].includes(flag);

    let mode = false;

    if(std){
        mode = 0;
    } else if(taiko){
        mode = 1;
    } else if(ctb){
        mode = 2;
    } else if(mania){
        mode = 3;
    }
console.log(mode)
    return mode;
}