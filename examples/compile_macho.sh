GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Compiling Mach-O with default GCC configuration (macho_default_gcc)${NC}"
gcc main.c -o macho_default_gcc

echo -e "${GREEN}Compiling Mach-O with NX disabled (macho_nx_disabled)${NC}"
gcc main.c -z execstack -o macho_nx_disabled

echo -e "${GREEN}Compiling Mach-O with stack protector disabled (macho_stack_protector_disabled)${NC}"
gcc main.c -fno-stack-protector -o macho_stack_protector_disabled

echo -e "${GREEN}Compiling Mach-O which uses RPATH (macho_uses_rpath)${NC}"
gcc main.c -Wl,-rpath,EXAMPLE_RPATH_DIRECTORY -o macho_uses_rpath

echo -e "${GREEN}Compiling Mach-O with all hardenings enabled (macho_all_enabled)${NC}"
gcc main.c -Wl,-z,relro,-z,now -pie -fPIE -o macho_all_enabled

echo -e "${GREEN}Compiling Mach-O with all hardening disabled (macho_all_disabled)${NC}"
gcc main.c -Wl,-z,norelro,-rpath,EXAMPLE_RPATH_DIRECTORY -fno-stack-protector -z execstack -o macho_all_disabled
