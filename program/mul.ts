import { exec } from "../iint";
import { bf, to_string, type Inst } from "../src";
import { add, copy, copyadd, for_loop, if_gt, move, set, temp } from "../src/lib";

const num =   Array(8).fill(0).map((_,i)=>i+10) as [number,number,number,number,number,number,number,number];
const carry = Array(8).fill(0).map((_,i)=>i+18) as [number,number,number,number,number,number,number,number];
const mul =   Array(8).fill(0).map((_,i)=>i+26) as [number,number,number,number,number,number,number,number];

const before = 0;

function add_carry(digit: number, val_ptr: number): Inst[] {
    const mem = carry[digit]!;
    return [
        copy(mem, before),
        move(val_ptr, [{ addr: mem, mul: 1 }]),
        
        ...(digit !== 7 ? [
            if_gt(before, mem, [
                set(temp[3], 1),
                add_carry(digit + 1, temp[3]),
            ].flat())
        ] : []),
    ].flat()
}

const c_i = 1;
const c_down = 2;
const calc_up = 3;

function calc_up_mul(a: number, b: number) {
    return [
        copy(b, c_i),
        set(c_down, 0),
        set(before, 0),
        set(calc_up, 0),

        for_loop(c_i, [
            copyadd(a, c_down),
            if_gt(before, c_down, [
                add(calc_up, 1),
            ].flat()),
            copy(c_down, before),
        ].flat()),
    ].flat()
}

const c_tmp1 = 4;
const c_tmp2 = 5;

const dc = (c: number, n: number, m: number) => [
    set(c_tmp2,0),copy(num[n]!,c_tmp1),for_loop(c_tmp1,copyadd(mul[m]!,c_tmp2)),
    add_carry(c, c_tmp2),
].flat();
const uc = (c: number, n: number, m: number) => [
    calc_up_mul(num[n]!, mul[m]!),
    add_carry(c, calc_up),
].flat();
const carr = (n: number, m: number) => {
    const c = n + m;
    if (c >= 8) return [];
    if (c == 7) return dc(c, n, m);
    return [
        dc(c, n, m),
        uc(c + 1, n, m),
    ].flat();
}

function exec_mul() {
    return [
        set(carry[0], 0),
        set(carry[1], 0),
        set(carry[2], 0),
        set(carry[3], 0),
        set(carry[4], 0),
        set(carry[5], 0),
        set(carry[6], 0),
        set(carry[7], 0),

        Array(8).fill(0).map((_,i)=>i).flatMap(n => Array(8).fill(0).map((_,i)=>i).flatMap(m => carr(n, m))),

        copy(carry[0], num[0]),
        copy(carry[1], num[1]),
        copy(carry[2], num[2]),
        copy(carry[3], num[3]),
        copy(carry[4], num[4]),
        copy(carry[5], num[5]),
        copy(carry[6], num[6]),
        copy(carry[7], num[7]),
    ].flat()
}


const prog = (to_string(bf`
    ${set(num[0], 1)}
    ${temp[3]},[
        ${mul[0]},
        ${mul[1]},
        ${mul[2]},
        ${mul[3]},
        ${mul[4]},
        ${mul[5]},
        ${mul[6]},
        ${mul[7]},
        ${exec_mul()}
    ${temp[3]},]
    ${num[0]}.
    ${num[1]}.
    ${num[2]}.
    ${num[3]}.
    ${num[4]}.
    ${num[5]}.
    ${num[6]}.
    ${num[7]}.
`).replaceAll(/[^\+-<>\[\]<>!]/g, ""));
console.log(prog);
//exec(new Uint8Array(15), prog);