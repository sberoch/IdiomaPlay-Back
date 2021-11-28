[33mcommit 96295d416b09b49d8aaf256c62b7835b15ae45d4[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Alvaro Iribarren <47064719+AlvaroIribarren@users.noreply.github.com>
Date:   Mon Nov 22 21:42:47 2021 -0300

    Fix

[1mdiff --git a/src/app.service.ts b/src/app.service.ts[m
[1mindex 1ae137b..927d7cc 100644[m
[1m--- a/src/app.service.ts[m
[1m+++ b/src/app.service.ts[m
[36m@@ -3,6 +3,6 @@[m [mimport { Injectable } from '@nestjs/common';[m
 @Injectable()[m
 export class AppService {[m
   getHello(): string {[m
[31m-    return 'Hello World';[m
[32m+[m[32m    return 'Hello World!';[m
   }[m
 }[m
