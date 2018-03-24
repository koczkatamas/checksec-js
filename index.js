const fs = require("fs");
const Elf = require("./Elf");
const KaitaiStream = require('kaitai-struct/KaitaiStream');

const files = fs.readdirSync("examples").filter(x => !x.endsWith(".sh") && !x.endsWith(".c"));
for (const file of files) {
    const fileContent = fs.readFileSync(`examples/${file}`);
    const parsedElf = new Elf(new KaitaiStream(fileContent));
    const prgHdrs = parsedElf.header.programHeaders;

    console.log(`${file}: ${Elf.ObjType[parsedElf.header.eType]} ${Elf.Machine[parsedElf.header.machine]} ${Elf.Bits[parsedElf.bits]} ${Elf.Endian[parsedElf.endian]} ${Elf.OsAbi[parsedElf.abi]} v${parsedElf.eiVersion}`);

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
    //console.log(JSON.stringify(parsedElf, function(key, value) { return key.startsWith('_') ? undefined : value; }, 4));
}
