export type Inst = string | number;

export function bf(strings: TemplateStringsArray, ...values: (Inst[] | Inst)[]): Inst[] {
    const insts: Inst[] = [];
    for (const [string, idx] of strings.map((e,i)=>[e,i] as const)) {
        insts.push(string);
        const val = values[idx];
        if (val !== undefined) {
            if (Array.isArray(val)) {
                insts.push(...val);
            } else if (typeof val === "string") {
                insts.push(val.trim());
            } else {
                insts.push(val);
            }
        }
    }
    return insts;
}

export function to_string(insts: Inst[]): string {
    let ptr = 0;
    let str = "";
    for (const inst of insts) {
        if (typeof inst === "string") {
            str += inst;
        } else {
            const delta = inst - ptr;
            ptr = inst;
            str += delta >= 0 ? ">".repeat(delta) : "<".repeat(-delta);
        }
    }

    return str;
}
