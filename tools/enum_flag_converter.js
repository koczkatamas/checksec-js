const enums = `956 #define DF_1_NOW        0x00000001      /* Set RTLD_NOW for this object.  */
957 #define DF_1_GLOBAL     0x00000002      /* Set RTLD_GLOBAL for this object.  */
958 #define DF_1_GROUP      0x00000004      /* Set RTLD_GROUP for this object.  */
959 #define DF_1_NODELETE   0x00000008      /* Set RTLD_NODELETE for this object.*/
960 #define DF_1_LOADFLTR   0x00000010      /* Trigger filtee loading at runtime.*/
961 #define DF_1_INITFIRST  0x00000020      /* Set RTLD_INITFIRST for this object*/
962 #define DF_1_NOOPEN     0x00000040      /* Set RTLD_NOOPEN for this object.  */
963 #define DF_1_ORIGIN     0x00000080      /* $ORIGIN must be handled.  */
964 #define DF_1_DIRECT     0x00000100      /* Direct binding enabled.  */
965 #define DF_1_TRANS      0x00000200
966 #define DF_1_INTERPOSE  0x00000400      /* Object is used to interpose.  */
967 #define DF_1_NODEFLIB   0x00000800      /* Ignore default lib search path.  */
968 #define DF_1_NODUMP     0x00001000      /* Object can't be dldump'ed.  */
969 #define DF_1_CONFALT    0x00002000      /* Configuration alternative created.*/
970 #define DF_1_ENDFILTEE  0x00004000      /* Filtee terminates filters search. */
971 #define DF_1_DISPRELDNE 0x00008000      /* Disp reloc applied at build time. */
972 #define DF_1_DISPRELPND 0x00010000      /* Disp reloc applied at run-time.  */
973 #define DF_1_NODIRECT   0x00020000      /* Object has no-direct binding. */
974 #define DF_1_IGNMULDEF  0x00040000
975 #define DF_1_NOKSYMS    0x00080000
976 #define DF_1_NOHDR      0x00100000
977 #define DF_1_EDITED     0x00200000      /* Object is modified after built.  */
978 #define DF_1_NORELOC    0x00400000
979 #define DF_1_SYMINTPOSE 0x00800000      /* Object has individual interposers.  */
980 #define DF_1_GLOBAUDIT  0x01000000      /* Global auditing required.  */
981 #define DF_1_SINGLETON  0x02000000      /* Singleton symbols are used.  */
982 #define DF_1_STUB       0x04000000
983 #define DF_1_PIE        0x08000000`.split('\n').map(x => x.match(/.*? .*? DF_1_(.*?)\s+(.*?)(?:\s+\/\*\s+(.*?)\s*\*|$)/));

//console.log(JSON.stringify(enums, null, 4));
console.log(enums.map(x => `
${x[1].toLowerCase()}:
  value: value & ${x[2]} != 0
  doc: "${x[3]}"
`.trim()).join("\n").replace(/\n  doc: "undefined"/g, ""));

console.log("====================================================================================");
const machoFlags = `
0x1      : no_undefs                 # the object file has no undefined references
0x2      : incr_link                 # the object file is the output of an incremental link against a base file and can't be link edited again
0x4      : dyld_link                 # the object file is input for the dynamic linker and can't be staticly link edited again
0x8      : bind_at_load              # the object file's undefined references are bound by the dynamic linker when loaded.
0x10     : prebound                  # the file has its dynamic undefined references prebound.
0x20     : split_segs                # the file has its read-only and read-write segments split
0x40     : lazy_init                 # the shared library init routine is to be run lazily via catching memory faults to its writeable segments (obsolete)
0x80     : two_level                 # the image is using two-level name space bindings
0x100    : force_flat                # the executable is forcing all images to use flat name space bindings
0x200    : no_multi_defs             # this umbrella guarantees no multiple defintions of symbols in its sub-images so the two-level namespace hints can always be used.
0x400    : no_fix_prebinding         # do not have dyld notify the prebinding agent about this executable
0x800    : prebindable               # the binary is not prebound but can have its prebinding redone. only used when MH_PREBOUND is not set.
0x1000   : all_mods_bound            # indicates that this binary binds to all two-level namespace modules of its dependent libraries. only used when MH_PREBINDABLE and MH_TWOLEVEL are both set.
0x2000   : subsections_via_symbols   # safe to divide up the sections into sub-sections via symbols for dead code stripping
0x4000   : canonical                 # the binary has been canonicalized via the unprebind operation
0x8000   : weak_defines              # the final linked image contains external weak symbols
0x10000  : binds_to_weak             # the final linked image uses weak symbols
0x20000  : allow_stack_execution     # When this bit is set, all stacks in the task will be given stack execution privilege.  Only used in MH_EXECUTE filetypes.
0x40000  : root_safe                 # When this bit is set, the binary declares it is safe for use in processes with uid zero
0x80000  : setuid_safe               # When this bit is set, the binary declares it is safe for use in processes when issetugid() is true
0x100000 : no_reexported_dylibs      # When this bit is set on a dylib, the static linker does not need to examine dependent dylibs to see if any are re-exported
0x200000 : pie                       # When this bit is set, the OS will load the main executable at a random address. Only used in MH_EXECUTE filetypes.
0x400000 : dead_strippable_dylib
0x800000 : has_tlv_descriptors
0x1000000: no_heap_execution
0x2000000: app_extension_safe`.trim().split('\n').map(x => x.match(/([0-9x]+) *: ([a-z_]+)(?:\s+# (.*))?/));
console.log(machoFlags);
console.log(machoFlags.map(x => `
${x[2].toLowerCase()}:
  value: value & ${x[1]} != 0
  doc: "${x[3]}"
`.trim()).join("\n").replace(/\n  doc: "undefined"/g, ""));
