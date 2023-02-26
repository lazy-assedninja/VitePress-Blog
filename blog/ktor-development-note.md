---
title: Ktor - 開發筆記
date: 2021-07-10
description: Ktor 框架工具推薦及簡介。
---

# {{ $frontmatter.title }}


## Engine
可以通過兩種方式創建和運行 Ktor 服務器應用程序：使用 [EmbeddedServer](https://ktor.io/docs/engines.html#embeddedServer) 在代碼中設置參數，或使用 [EngineMain](https://ktor.io/docs/engines.html#EngineMain) 從外部`application.conf`文件加載配置。
將敏感資訊和程式碼分開，是一個資安上要特別注意的地方，這裡推薦使用 **EngineMain**，並將配置加進`PROJECT/src/main/resources/application.conf`([HOCON](https://github.com/lightbend/config/blob/master/HOCON.md#hocon-human-optimized-config-object-notation))中。
```
ktor {
    deployment {
        port = 8080
        port = ${?PORT}
    }
    application {
        modules = [ me.lazy_assedninja.application.ApplicationKt.module ]
    }
    database {
        user = "lazy-assedninja"
        password = "000000"
    }
}
```


## Routing
Routing 是用於處理 Server 接到的請求。
最基本的使用方式如下：
```kotlin
routing {
    get("/hello") {
        // ...
    }
}
```

還有提供類似群組的功能：
```kotlin
routing {
    route("/user") {
        get {
            // ...
        }

        post("login") {
            // ...
        }
    }
}
```


## ORM 框架
**Exposed** 是一個 Kotlin 的 **ORM Framework**，可以透過 Exposed 在 Ktor 中串接資料庫。
這時就可以將資料庫配置從 [Engine](#engine) 提到的`application.conf`中取出，設置資料庫。
```kotlin
val user = environment.config.property("ktor.database.user").getString()
val password = environment.config.property("ktor.database.password").getString()
Database.connect("jdbc:h2:mem:test", driver = "org.h2.Driver", user = user, password = password)

routing {
    // ...
}
```


### DSL & DAO
Exposed 提供2種 API 分別是 [DSL(Domain Specific Language)](https://github.com/JetBrains/Exposed/wiki/DSL) 和 [DAO(Data Access Object)](https://github.com/JetBrains/Exposed/wiki/DAO)。
DSL 類似 Kotlin 所提供具有類型安全性的 SQL 語法，而 DAO 則與帶有 Kotlin 特定 API 的 ORM 框架較為相似， 可針對需求來選擇合適的 API。
這裡選擇使用 DSL 來開發，避免一張表分別需要建立 Table、Entity 和 DTO，如果表的數量增多，Class 數量將會成倍數成長；如果表的數量不多，便可考慮使用 DAO，享受方便快速的編程體驗。


## 序列化
Ktor 提供幾種序列化的方式`kotlinx.serialization`、`Gson`和`Jackson`，可針對使用需求來選擇合適的轉換器，這裡推薦使用`kotlinx.serialization`。
支援最多種格式之外，只需在 Class 加上 `@Serializable`，便完成轉換所需配置。
```kotlin
@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)
```
::: warning
使用前須在`build.gradle`設置 plugins 和 dependencies 外，還需要註冊 json converter。
:::


## 參考
[Content negotiation and serialization](https://ktor.io/docs/serialization.html#receive_data)<br>
[最好用的非同步網頁框架！開始用 Ktor 寫 Kotlin Server](https://ithelp.ithome.com.tw/users/20120550/ironman/2950)<br>
