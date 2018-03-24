#include <stdio.h>

int main() {
    char requiresCanary[1024] = { 0 };
    printf("This is an example program for checksec.js\n");
    printf("%s", requiresCanary);
    return 0;
}
