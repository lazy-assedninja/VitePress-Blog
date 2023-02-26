---
title: Android - 常用 Command
date: 2021-06-21
description: Android 常用 **Command 整合筆記**。
---

# {{ $frontmatter.title }}


## ADB
* 輸出裝置 logcat
  ```bash
  adb -d logcat > log.txt
  ```


## Test
* Unit Test
  ```bash
  ./gradlew test
  ```

* Instrumented Test
  ```bash
  ./gradlew connectedAndroidTest
  ```


## APK
* 打包 Debug APK
  ```bash
  ./gradlew assembleDebug
  ```

* 打包 Release APK
  ```bash
  ./gradlew assembleRelease
  ```

* 分析 APK 使用的 method 數量
  ```bash
  dexcount ./app/build/outputs/apk/app-debug.apk
  ```
