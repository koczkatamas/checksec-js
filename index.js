const fs = require("fs");
const Elf = require("./Elf");
const KaitaiStream = require('kaitai-struct/KaitaiStream');

const files = fs.readdirSync("examples").filter(x => !x.endsWith(".sh") && !x.endsWith(".c"));
for (const file of files) {
    const fileContent = fs.readFileSync(`examples/${file}`);
    const parsedElf = new Elf(new KaitaiStream(fileContent));
    console.log(`${file}: ${Elf.ObjType[parsedElf.header.eType]} ${Elf.Machine[parsedElf.header.machine]} ${Elf.Bits[parsedElf.bits]} ${Elf.Endian[parsedElf.endian]} ${Elf.OsAbi[parsedElf.abi]} v${parsedElf.eiVersion}`);
    const prgHdrTypes = parsedElf.header.programHeaders.map(x => Elf.PhType[x.type]);
    const sectionHdrNames = parsedElf.header.sectionHeaders.map(x => x.name);
    console.log(`  prgHdrTypes: ${prgHdrTypes.join(", ")}`);
    console.log(`  sectionHdrNames: ${sectionHdrNames.join(", ")}`);
    console.log(`  RELRO: `);
    //console.log(JSON.stringify(parsedElf, function(key, value) { return key.startsWith('_') ? undefined : value; }, 4));
}
