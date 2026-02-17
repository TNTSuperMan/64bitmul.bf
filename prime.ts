import { stdout } from "bun";

/*
2*17*31*1423*15919*17191*20441
*/
let num = BigInt("0x" + [...new TextEncoder().encode("Brainrot")].map(e=>e.toString(16).padStart(2,"0")).toReversed().join("").toUpperCase());
stdout.write("[");
loop: while (num !== 1n) {
    const half = num / 2n;
    for (let i = 2n; i < half; i++) {
        const div = num / i;
        if (div * i == num) {
            stdout.write(`${i}n,`);
            num = div;
            continue loop;
        }
    }
    console.log(`${num}n]`);
    process.exit();
}
