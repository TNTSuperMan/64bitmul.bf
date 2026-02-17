import { env, nanoseconds, spawn } from "bun";

if (!env.BF_RUNTIME) {
    console.error("BF_RUNTIME環境変数を指定してね");
    process.exit(1);
}

const start = nanoseconds();
const proc = spawn({
    cmd: [...(env.BF_RUNTIME!).split(" "), "64bitmul.bf"],
    stdin: "pipe",
    stdout: "pipe",
});

const brainrot: bigint[] = [
    2n,
    17n,
    31n,
    1423n,
    15919n,
    17191n,
    20441n,
];

const bufview = new DataView(new ArrayBuffer(8));
const stdin = [
    ...brainrot.flatMap(e=>(bufview.setBigUint64(0, e, true), [1, ...new Uint8Array(bufview.buffer)])),
    0,
];

await proc.stdin.write(new Uint8Array(stdin));
await proc.exited;
const end = nanoseconds();
const bytes = await proc.stdout.bytes();
console.log(new TextDecoder().decode(bytes));
console.log(`Calculated in ${end - start}ns`);
console.log(bytes);
