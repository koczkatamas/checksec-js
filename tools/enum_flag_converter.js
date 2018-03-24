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