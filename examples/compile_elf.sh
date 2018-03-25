GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Compiling ELF with default GCC configuration (elf_default_gcc)${NC}"
gcc main.c -o elf_default_gcc

echo -e "${GREEN}Compiling ELF with RELRO disabled (elf_relro_disabled)${NC}"
gcc main.c -Wl,-z,norelro -o elf_relro_disabled

echo -e "${GREEN}Compiling ELF with partial RELRO (elf_relro_partial)${NC}"
gcc main.c -Wl,-z,relro -o elf_relro_partial

echo -e "${GREEN}Compiling ELF with full RELRO (elf_relro_full)${NC}"
gcc main.c -Wl,-z,relro,-z,now -o elf_relro_full

echo -e "${GREEN}Compiling ELF with PIE enabled (elf_pie_enabled)${NC}"
gcc main.c -pie -fPIE -o elf_pie_enabled

echo -e "${GREEN}Compiling ELF with NX disabled (elf_nx_disabled)${NC}"
gcc main.c -z execstack -o elf_nx_disabled

echo -e "${GREEN}Compiling ELF with stack protector disabled (elf_stack_protector_disabled)${NC}"
gcc main.c -fno-stack-protector -o elf_stack_protector_disabled

echo -e "${GREEN}Compiling ELF which uses RPATH (elf_uses_rpath)${NC}"
gcc main.c -Wl,-rpath,EXAMPLE_RPATH_DIRECTORY -o elf_uses_rpath

echo -e "${GREEN}Compiling ELF which uses RUNPATH (elf_uses_runpath)${NC}"
gcc main.c -Wl,-rpath,EXAMPLE_RUNPATH_DIRECTORY,--enable-new-dtags -o elf_uses_runpath

echo -e "${GREEN}Compiling ELF with all hardenings enabled (elf_all_enabled)${NC}"
gcc main.c -Wl,-z,relro,-z,now -pie -fPIE -o elf_all_enabled

echo -e "${GREEN}Compiling ELF with all hardenings disabled (elf_all_disabled)${NC}"
gcc main.c -Wl,-z,norelro,-rpath,EXAMPLE_RPATH_DIRECTORY -fno-stack-protector -z execstack -o elf_all_disabled
