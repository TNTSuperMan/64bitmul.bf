import { bf, type Inst } from "./core";

const num_as_op = (val: number): string => val >= 0 ? "+".repeat(val) : "-".repeat(-val)

export const temp = [
    6, 7, 8, 9
] as const;

export function if_gt(left: number, right: number, block: Inst[]): Inst[] {
    return [
        copy(right, temp[2]), // safe right
        set(temp[0], 0), // t1
        set(temp[1], 0), // t2
        set(temp[3], 0), // flag
        for_loop(left, [
            add(temp[0], 1),
            for_loop(temp[2], [
                set(temp[0], 0),
                add(temp[1], 1),
            ].flat()),
            for_loop(temp[0], [
                add(temp[3], 1),
            ].flat()),
            for_loop(temp[1], [
                add(temp[2], 1),
            ].flat()),
            add(temp[2], -1),
        ].flat()),

        bf`${temp[3]} [
            ${block}
            ${set(temp[3], 0)}
        ]`
    ].flat();
}

export function copy(x: number, y: number) {
    return bf`
        ${set(temp[0], 0)}
        ${set(y, 0)}
        ${x}[${y}+${temp[0]}+${x}-]
        ${temp[0]}[${x}+${temp[0]}-]
    `;
}
export function copyadd(x: number, y: number) {
    return bf`
        ${set(temp[0], 0)}
        ${x}[${y}+${temp[0]}+${x}-]
        ${temp[0]}[${x}+${temp[0]}-]
    `;
}
export function add(to: number, val: number): Inst[] {
    return bf`
        ${to}
        ${num_as_op(val)}
    `;
}
export function set(to: number, val: number): Inst[] {
    return bf`
        ${to}
        [-]
        ${num_as_op(val)}
    `;
}

export function move(from: number, targets: {
    addr: number,
    mul: number,
}[]): Inst[] {
    return for_loop(from, targets.flatMap(({ addr, mul }) => bf`${addr} ${num_as_op(mul)}`));
}

export function for_loop(from: number, block: Inst[]): Inst[] {
    return bf`${from} [
        ${block}
        ${add(from, -1)}
    ]`;
}

export function if_not_zero(condition: number, block: Inst[]): Inst[] {
    return bf`${condition} [
        ${block}
        ${set(condition, 0)}
    ]`
}
