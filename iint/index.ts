export function exec(memory: Uint8Array, program: string) {
    const jump_table = new Map<number, number>();
    const stack: number[] = [];
    for (let i = 0; i < program.length; i++) {
        if (program[i] === "[") {
            stack.push(i);
        } else if (program[i] === "]") {
            const start = stack.pop()!;
            jump_table.set(start, i);
            jump_table.set(i, start);
        }
    }
    let pc = 0, dp = 0;
    loop: while (pc < program.length) {
        switch (program[pc]) {
            case "!": break loop;
            case "+": memory[dp]!++; break;
            case "-": memory[dp]!--; break;
            case "<": dp--; break;
            case ">": dp++; break;
            case "[": if (memory[dp] === 0) pc = jump_table.get(pc)!; break;
            case "]": if (memory[dp] !== 0) pc = jump_table.get(pc)!; break;
        }
        pc++;
    }
}