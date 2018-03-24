gcc main.c -o elf_default_gcc
gcc main.c -Wl,-z,norelro -o elf_relro_disabled
gcc main.c -Wl,-z,relro -o elf_relro_partial
gcc main.c -Wl,-z,relro,-z,now -o elf_relro_full
gcc main.c -pie -fPIE -o elf_pie_enabled
gcc main.c -z execstack -o elf_nx_disabled
gcc main.c -fno-stack-protector -o elf_stack_protector_disabled
gcc main.c -Wl,-rpath,EXAMPLE_RPATH_DIRECTORY -o elf_uses_rpath
gcc main.c -Wl,-rpath,EXAMPLE_RUNPATH_DIRECTORY,--enable-new-dtags -o elf_uses_runpath
gcc main.c -Wl,-z,relro,-z,now -pie -fPIE -o elf_all_enabled
gcc main.c -Wl,-z,norelro,-rpath,EXAMPLE_RPATH_DIRECTORY -fno-stack-protector -z execstack -o elf_all_disabled

