import { b, bf, to_string, type Inst } from "./src";

const insts: Inst[] = [
    b.add(0, 4),
    b.move(0, [{ addr: 1, mul: 4 }]),
    b.move(1, [{ addr: 0, mul: 4 }]),
    
].flat();

console.log(to_string(insts).replaceAll(/[^\+-\<\>\[\]\.,]/g, ""));
