const fs = require("fs");
const KaitaiStream = require('kaitai-struct/KaitaiStream');
const Elf = require("./Elf");
const MachO = require("./MachO");
const DosMz = require("./DosMz");

for (const elfFn of fs.readdirSync("examples").filter(x => x.startsWith("elf_"))) {
    continue;
    const fileContent = fs.readFileSync(`examples/${elfFn}`);
    const parsedElf = new Elf(new KaitaiStream(fileContent));
    const prgHdrs = parsedElf.header.programHeaders;

    console.log(`${elfFn}: ${Elf.ObjType[parsedElf.header.eType]} ${Elf.Machine[parsedElf.header.machine]} ${Elf.Bits[parsedElf.bits]} ${Elf.Endian[parsedElf.endian]} ${Elf.OsAbi[parsedElf.abi]} v${parsedElf.eiVersion}`);

    const dynamicEntries = prgHdrs.map(x => x.dynamic).filter(x => x);
    if (dynamicEntries.length > 1)
        console.error("Multiple DYNAMIC entries found. Result can be inconsistent.");
    const dynamic = dynamicEntries[0].entries || [];
    const flags1 = dynamic.map(x => x.flag1Values).filter(x => x)[0] || {};

    const bindNow = dynamic.some(x => x.tag === Elf.DynamicArrayTags.BIND_NOW);
    if (bindNow !== (flags1.now||false))
        console.error(`Full RELRO test gave inconsistent results (BIND_NOW = ${bindNow}, DT_FLAGS_1.NOW = ${flags1.now}).`);

    const relro = prgHdrs.some(x => x.type === Elf.PhType.GNU_RELRO);
    const execStack = prgHdrs.find(x => x.type === Elf.PhType.GNU_STACK).flagsObj.execute;
    const stackCanaryHeur = parsedElf.header.sectionHeaders.filter(x => x.strtab)
        .some(x => x.strtab.entries.some(y => y.includes("__stack_chk_fail")));
    const rpath = dynamic.some(x => x.tag === Elf.DynamicArrayTags.RPATH);
    const runpath = dynamic.some(x => x.tag === Elf.DynamicArrayTags.RUNPATH);

    console.log(`  RELRO: ${!relro ? "No" : bindNow ? "Full" : "Partial"}`);
    console.log(`  PIE: ${flags1.pie||false}`);
    console.log(`  NX: ${!execStack}`);
    console.log(`  Stack canary: ${stackCanaryHeur}`);
    console.log(`  RPATH: ${rpath}`);
    console.log(`  RUNPATH: ${runpath}`);
    console.log("");
}

for (const machoFn of fs.readdirSync("examples").filter(x => x.startsWith("macho_"))) {
    const fileContent = fs.readFileSync(`examples/${machoFn}`);
    const parsedMacho = new MachO(new KaitaiStream(fileContent));
    console.log(parsedMacho);
}