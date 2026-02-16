// 下書きなのん

function stdin() {
    return 0;
}
function stdout(val) {
    console.log(val);
}

const num = new Uint8Array(4);

const carry = new Uint8Array(4);

function add_carry(digit, val) {
    let before = carry[digit];
    carry[digit] += val;
    if (before > carry[digit]) {
        if (digit == 3) {
            return;
        }
        add_carry(digit + 1, 1);
    }
}
function calc_up_mul(a, b) {
    const mem = new Uint8Array(4); // i, down, before, up
    mem[0] = b;
    mem[1] = 0;
    mem[2] = 0;
    mem[3] = 0;
    while (mem[0]) {
        mem[0] -= 1;
        mem[1] += a;
        if (mem[2] > mem[1]) {
            mem[3] += 1;
        }
        mem[2] = mem[1];
    }
    return mem[3];
}

function exec_mul(mul) {
    carry[0] = 0;
    carry[1] = 0;
    carry[2] = 0;
    carry[3] = 0;

    add_carry(0, num[0] * mul[0]);
    add_carry(1, calc_up_mul(num[0], mul[0]));

    add_carry(1, num[0] * mul[1]);
    add_carry(1, num[1] * mul[0]);
    add_carry(2, calc_up_mul(num[0], mul[1]));
    add_carry(2, calc_up_mul(num[1], mul[0]));

    add_carry(2, num[0] * mul[2]);
    add_carry(2, num[1] * mul[1]);
    add_carry(2, num[2] * mul[0]);
    add_carry(3, calc_up_mul(num[0], mul[2]));
    add_carry(3, calc_up_mul(num[1], mul[1]));
    add_carry(3, calc_up_mul(num[2], mul[0]));

    add_carry(3, num[0] * mul[3]);
    add_carry(3, num[1] * mul[2]);
    add_carry(3, num[2] * mul[1]);
    add_carry(3, num[3] * mul[0]);
}

num[0] = 0x73;
num[1] = 0x58;
num[2] = 0x05;
num[3] = 0;

const mul = new Uint8Array(4);
mul[0] = 0xB5;
mul[1] = 0x16;
mul[2] = 0;
mul[3] = 0;
exec_mul(mul);
console.log(carry);

process.exit();

mainloop: while (1) {
    let in_data = stdin();
    if (in_data == 0) { // exit
        break mainloop;
    }
    const mul = new Uint8Array(4);
    mul[0] = stdin();
    mul[1] = stdin();
    mul[2] = stdin();
    mul[3] = stdin();
}

stdout(num[0]);
stdout(num[1]);
stdout(num[2]);
stdout(num[3]);
