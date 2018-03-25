#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void stack_canary_missing() {
    printf("[FAIL] Stack canary is missing.\n");
    _exit(2);
}

int main(int argc, char** argv) {
    printf("This is an example program for checksec.js\n");

    // this hack is here to make it easier to predict the stack layout / make the canary test more reliable
    struct {
        char *heapPtr;
        void *atoi_before, *atoi_after;
        int value, i;
        void *ptr;
        char stackBuf[1024]; // requires canary
    } g = { 0 };

    g.heapPtr = malloc(1024);
    g.atoi_before = &atoi;
    g.value = atoi("10");
    g.atoi_after = &atoi;

    printf("main = %p, heap = %p, stack = %p, atoi: %p -> %p\n", main, g.heapPtr, g.stackBuf, g.atoi_before, g.atoi_after);

    if (argc > 1) {
        printf("argv[1] = %s\n", argv[1]);
        if (!strcmp(argv[1], "--test-nx-stack")) {
            // 0:  b8 39 05 00 00          mov    eax, 1337
            // 5:  c3                      ret
            g.stackBuf[0] = 0xb8;
            g.stackBuf[1] = 0x39;
            g.stackBuf[2] = 0x05;
            g.stackBuf[3] = 0x00;
            g.stackBuf[4] = 0x00;
            g.stackBuf[5] = 0xc3;
            printf("Trying to execute code on the stack. Expect a crash (good) or a note that NX is disabled.\n");
            g.value = ((int (*)())g.stackBuf)();
            printf("[FAIL] NX is disabled. Result of test function: %d\n", g.value);
        } else if (!strcmp(argv[1], "--test-nx-heap")) {
            // 0:  b8 39 05 00 00          mov    eax, 1337
            // 5:  c3                      ret
            g.heapPtr[0] = 0xb8;
            g.heapPtr[1] = 0x39;
            g.heapPtr[2] = 0x05;
            g.heapPtr[3] = 0x00;
            g.heapPtr[4] = 0x00;
            g.heapPtr[5] = 0xc3;
            printf("Trying to execute code on the heap. Expect a crash (good) or a note that NX is disabled.\n");
            g.value = ((int (*)())g.heapPtr)();
            printf("[FAIL] NX is disabled. Result of test function: %d\n", g.value);
        } else if (!strcmp(argv[1], "--test-canary")) {
            g.ptr = &stack_canary_missing;
            for(g.i = 0; g.i < 64; g.i++)
                g.stackBuf[1024 + g.i] = ((char*)&g.ptr)[g.i % sizeof(g.ptr)];
            printf("Return address is probably overwritten. Expect a crash (good) or a message about the missing canary (bad).\n");
        }
    }

    return 0;
}
