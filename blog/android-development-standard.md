---
title: Android - 開發規範
date: 2021-06-14
description: 基於 **項目維護**、**代碼可讀性**、**代碼審查效率** 及 **規範團隊開發** 等條件，所整理出之 **Android 開發規範**。
---

# {{ $frontmatter.title }}
[Android 開發規範](https://github.com/Blankj/AndroidStandardDevelop)
之翻譯整理，如有侵犯著作權等行為煩請另行告知，也推薦此作者的其他
Project：[Android 開發人員不得不收集的代碼](https://github.com/Blankj/AndroidUtilCode)。


## Android Studio 規範
工欲善其事，必先利其器。
1. 盡量使用最新的穩定版 **IDE (Integrated Development Environment)** 進行開發。
2. 編碼格式統一為 **UTF-8** 。
3. 編輯完 `.java`、`.xml` 等檔案後一定要 **格式化** (如果團隊有制定好的規則，就優先遵照團隊規則，否則統一使用
   **Android Studio** 默認模板即可)。
4. 刪除多餘的 import，減少警告，可利用 **Android Studio** 的 **Optimize Imports (Settings -> Keymap ->
   Optimize Imports)** 快捷鍵。
   

## 命名規範
代碼中的命名 **嚴禁使用拼音與英文混合** 的方式，更不允許直接使用中文的方式。
正確的英文拼寫和語法可以讓閱讀者易於理解，避免誤會。
::: warning
即使純拼音命名方式也要避免使用。
但 alibaba、taobao、youku、hangzhou 等國際通用的名稱，可視同英文。
:::


### 1. 包名
包名全部小寫，連續的單詞只是簡單地連接起來，不使用下劃線，採用反域名命名規則，全部使用小寫字母。
一級包名是頂級功能變數名稱，通常為 com、edu、gov、net、org 等，二級包名為組織名，三級包名根據應用進行命名，後面就是對包名的劃分了。
關於包名的劃分，推薦採用 PBF (按功能分包 Package By Feature)，PBL (按層分包 Package By Layer) 存在許多缺點。
PBF 可能不是很好區分功能，不過也比 PBL 要好很多，且 PBF 與 PBL 相比有以下優勢：

* **Package 內高內聚，Package 間低耦合**
  - PBL 降低了代碼耦合，但帶來了 Package 耦合，要添加新功能，需要改 Model、DBHelper、View、Service
  等等，必須改動好幾個 Package 下的代碼，更動的地方越多，越容易產生問題。
  - PBF 的話，FeatureA 相關的所有東西都在 FeatureA 包，Feature 內高內聚、高度模組化，不同 Feature
  之間低耦合，相關的東西都放在一起，更加容易尋找。
  
* **Package 有私有作用網域 (package-private scope)**
  - PBL 的方式是把所有工具方法都放在`util`包下。
  舉例來說，小鄧開發新功能時候發現需要一個 **XXXUtil**，但它又不是通用的，那應該放在哪裡？
  按照分層原則，我們還得放在`util`包下，好像不太合適，但放在其它包更不合適，功能越來越多，Util 類也越定義越多。
  後來小劉負責開發一塊功能時發現需要另一個 **XXXUtil**，同樣不通用，去`util`包一看，怎麼已經有了，而且還沒法複用，只好放棄
  **XXX** 這個名字，改為 **YYYUtil** ...。
  因為 PBL 的 Package 沒有私有作用域，每一個包都是 public (
  跨包方法調用是很平常的事情，每一個包對其它包來說都是可訪問的)；
  如果是 PBF，小張的 **XXXUtil** 自然放在 **FeatureA** 下，小李的 **XXXUtil** 在 **FeatureB** 下，如果覺得 Util
  好像是通用的，就去`util`包看看要不要添加工具方法進 **XXXUtil**， Class 命名衝突沒有了。
  - PBF 的 Package 有私有作用域，**FeatureA** 不應該訪問 **FeatureB** 下的任何東西 (如果非訪問不可，那就說明介面設計有問題)。

* **刪除功能容易**
  - PBL 需從功能入口到整個業務流程把受到牽連的所有能刪的代碼和 Class 都找出來刪掉。
  - PBF 先刪掉對應包，刪掉包後入口肯定報錯，再針對錯誤刪掉功能入口。

* **高度抽象**
  - 解決問題的一般方法是從抽象到具體，PBF 包名是對功能模組的抽象，包內的 Class 是實現細節，符合從抽象到具體，而 PBL 則相反。
  - PBF 從確定 App Name 開始，根據功能模組劃分 Package，再考慮各個部分的具體實現細節，而 PBL 從一開始就要考慮要不要 DAO 層，要不要 COM 層等等。

* **只通過 Class 來分離邏輯代碼**
  - PBL 既分離 Class 又分離 Package，而 PBF 只通過 Class 來分離邏輯代碼。
  沒有必要通過 Package 分離，因為 PBL 可能出現以下尷尬的情況：
  ```
  ├── service
      ├── MainService.java
  ```
  - 按照 PBL，`service`包下的所有東西都是 Service，應該不需要 Service 後綴。
  實際上通常為了方便，直接`import service`，Service 後綴是為了避免引入的 Class 和當前包下的 Class 命名衝突。
  當然，不用後綴也可以，必須寫清楚 Package 路徑。
  例如：`new com.domain.service.MainService()`，相對麻煩許多；而 PBF 就很方便，無需 Import，直接`new MainService()`即可。

* **Package 大小不再無意義**
  - PBL 中包的大小無限增長是合理的，因為功能越添越多，而 PBF 中包太大 (包裡 Class 太多) 表示這塊需要重構 (劃分子包)。

如果想知道更多 PBL 優點，可以查看這篇文章：**[Package by features， not layers](https://medium.com/hackernoon/package-by-features-not-layers-2d076df1964d#.mp782izhh)**。
當然，Google 也有相應的 Sample：**[todo-mvp](https://github.com/android/architecture-samples/tree/todo-mvp)**。
::: details 點開查看 todo-mvp 架構
```
com
└── example
    └── android
        └── architecture
            └── blueprints
                └── todoapp
                    ├── BasePresenter.java
                    ├── BaseView.java
                    ├── addedittask
                    │   ├── AddEditTaskActivity.java
                    │   ├── AddEditTaskContract.java
                    │   ├── AddEditTaskFragment.java
                    │   └── AddEditTaskPresenter.java
                    ├── data
                    │   ├── Task.java
                    │   └── source
                    │   ├── TasksDataSource.java
                    │   ├── TasksRepository.java
                    │   ├── local
                    │   │   ├── TasksDBHelper.java
                    │   │   ├── TasksLocalDataSource.java
                    │   │   └── TasksPersistenceContract.java
                    │   └── remote
                    │   └── TasksRemoteDataSource.java
                    ├── statistics
                    │   ├── StatisticsActivity.java
                    │   ├── StatisticsContract.java
                    │   ├── StatisticsFragment.java
                    │   └── StatisticsPresenter.java
                    ├── taskdetail
                    │   ├── TaskDetailActivity.java
                    │   ├── TaskDetailContract.java
                    │   ├── TaskDetailFragment.java
                    │   └── TaskDetailPresenter.java
                    ├── tasks
                    │   ├── ScrollChildSwipeRefreshLayout.java
                    │   ├── TasksActivity.java
                    │   ├── TasksContract.java
                    │   ├── TasksFilterType.java
                    │   ├── TasksFragment.java
                    │   └── TasksPresenter.java
                    └── util
                        ├── ActivityUtils.java
                        ├── EspressoIdlingResource.java
                        └── SimpleCountingIdlingResource.java
```
:::

參考以上的代碼結構，按功能分包具體可以這樣做：
```
com
└── domain
    └── app
        ├── App.java 定義 Application 類
        ├── Config.java 定義配置參數 (常量)
        ├── base 基礎元件
        ├── custom_view 自定義視圖
        ├── data 數據處理
        │   │── DataManager.java 資料管理
        │   │── local 來源於本地的資料。 例如：SP，Database，File
        │   │── model 定義 model (資料結構以及 getter/setter、compareTo、equals 等等，不含複雜操作)
        │   └── remote 來源於遠端的數據
        ├── feature 功能
        │   │── feature0 功能 0
        │   │   ├── feature0Activity.java
        │   │   ├── feature0Fragment.java
        │   │   ├── xxAdapter.java
        │   │   └── ... 其他 Class
        │   └── ... 其他功能
        ├── injection 依賴注入
        ├── util 工具類
        └── widget 元件類
```


### 2. 類別名稱
類別名稱以 **UpperCamelCase** 風格編寫，通常是名詞或名詞短語，介面名稱有時可能是形容詞或形容詞短語，盡量避免縮寫，除非該縮寫是眾所周知的。
例如：HTML、URL，如果類別名稱中包含單詞縮寫，則單詞縮寫的每個字母均應大寫。
| 類別 | 描述 | 例如 |
| :- | :- | :- |
| Activity | 以 Activity 為後綴標識 | 歡迎頁面類`WelcomeActivity` |
| Adapter | 以 Adapter 為後綴標識 | 新聞詳情適配器`NewsDetailAdapter` |
| 解析類 | 以 Parser 為後綴標識 | 首頁解析類`HomePosterParser` |
| 工具方法類 | 以 Utils 或 Manager 為後綴標識 | 線程池管理類：`ThreadPoolManager`<br>日誌工具類：`LogUtils`(`Logger`也可)<br>列印工具類：`PrinterUtils` |
| 資料庫類 | 以 DBHelper 後綴標識 | 新聞資料庫：`NewsDBHelper` |
| Service類 | 以 Service 為後綴標識 | 時間服務`TimeService` |
| BroadcastReceiver | 以 Receiver 為後綴標識 | 推送接收`JPushReceiver` |
| ContentProvider | 以 Provider 為後綴標識 |`ShareProvider` |
| 自定義的共用基礎類 | 以 Base 開頭 | `BaseActivity`,`BaseFragment` |

測試類的命名以欲測試類的名稱開始，以 Test 結束。
例如：`HashTest`或`HashIntegrationTest`。

介面 (Interface)：命名規則與類別一樣採用 UpperCamelCase，多以 able 或 ible 結尾，如`interface Runnable`、`interface Accessible`。
::: tip
如果項目採用 MVP，所有 Model、View、Presenter 的介面都以 I 為前綴，不加後綴，其他的介面採用上述命名規則。
:::


### 3. 方法名
方法名以 **lowerCamelCase** 風格編寫，通常是動詞或動詞短語。
| 方法 | 說明|
| :- | :- |
| `initXX()` | 初始化相關方法，以 init 為前置標識 |
| `isXX()`, `checkXX()` | 方法返回值為 boolean 型的請以 is/check 為前綴標識 |
| `getXX()` | 返回某個值的方法 |
| `setXX()` | 設置某個屬性值 |
| `handleXX()`, `processXX()` | 對數據進行處理的方法 |
| `displayXX()`, `showXX()` | 彈出提示框和提示資訊，使用 display/show 為前綴標識 |
| `updateXX()` | 更新數據 |
| `saveXX()`, `insertXX()` | 保存或插入數據 |
| `resetXX()` | 重置數據 |
| `clearXX()` | 清除數據 |
| `removeXX()`, `deleteXX()` | 拿掉資料或者檢視等 |
| `drawXX()` | 繪製資料或效果相關的，以 draw 為前置識別 |


### 4. 常量名
常量名命名模式為 **CONSTANT_CASE**，全部字母大寫，用下劃線分隔單詞。
每個常量都是一個`static final`欄位，但並非所有`static final`欄位都是常量。
::: details 點開查看範例
```java
// Constants
static final int NUMBER = 5;
static final ImmutableList NAMES = ImmutableList.of("Ed", "Ann");
static final Joiner COMMA_JOINER = Joiner.on(','); // Because Joiner is immutable
static final SomeMutableType[] EMPTY_ARRAY = {};
enum SomeEnum { ENUM_CONSTANT }

// Not Constants
static String nonFinal = "non-final";
final String nonStatic = "non-static";
static final SetmutableCollection = new HashSet();
static final ImmutableSetmutableElements = ImmutableSet.of(mutable);
static final Logger logger = Logger.getLogger(MyClass.getName());
static final String[] nonEmptyArray = {"these", "can", "change"};
```
:::


### 5. 非常量欄位名
非常量欄位名稱以 **lowerCamelCase** 風格編寫，基本結構為`scope{Type0}VariableName{Type1}`、`type0VariableName{Type1}`、`variableName{Type1}`。
::: tip
所有的 VO (Value Object) 統一採用標準的 **lowerCamelCase** 風格編寫，所有的 DTO (Data Transfer Object) 就按照介面文檔中定義的欄位名稱編寫。
:::


#### 5-1 scope (範圍)
非公有，非靜態欄位命名以 **m** 開頭。
靜態欄位命名以 **s** 開頭。
其他欄位以小寫字母開頭。
```java
public class MyClass {
    public int publicField;
    private static MyClass sSingleton;
    int mPackagePrivate;
    private int mPrivate;
    protected int mProtected;
}
```

使用 1 個字元首碼來表示作用範圍，1 個字元的前綴必須小寫，前綴後面是由表意性強的一個單詞或多個單詞組成的名字，而且每個單詞的首寫字母大寫，其它字母小寫。
這樣保證了對變數名稱能夠進行正確的斷句。


#### 5-2 Type0 (控件類型)
考慮到 Android 眾多的 UI 控件，為避免控件和普通成員變數混淆及更好地表達意思，所有用來表示控制項的成員變數統一加上控制項縮寫作為前綴標識 (具體請見附錄[UI 控件縮寫表](#ui-控件縮寫表))。
例如：`mIvAvatar`、`rvBooks`、`flContainer`。


#### 5-3 VariableName (變數名稱)
變數名稱中可能會出現量詞，我們需要創建統一的量詞，它們更容易理解，也更容易搜索。
例如：`mFirstBook`、`mPreBook`、`curBook`。
| 量詞清單 | 量詞後綴說明 |
| :- | :- |
| `First` | 一組變數中的第一個 |
| `Last` | 一組變數中的下一個 |
| `Pre` | 一組變數中的上一個 |
| `Cur` | 一組變數中的當前變數 |


#### 5-4 Type1 (數據類型)
對於表示集合或者陣列的非常量欄位名，我們可以添加後綴來增強欄位的可讀性。
集合添加後綴：`List`、`Map`、`Set`。
陣列添加後綴：`Arr`。
例如：`mIvAvatarList`、`userArr`、`firstNameSet`。
::: tip
如果資料類型不確定的話，如果表示很多書，那麼使用其複數形式來表示也可。
例如`mBooks`。
:::


### 6. 參數名
參數名以 **lowerCamelCase** 風格編寫，參數應該避免用單個字元命名。


### 7. 局部變數名稱
局部變數名稱以 **lowerCamelCase** 風格編寫，比起其它類型的名稱，局部變數名稱可以有更為寬鬆的縮寫規則。
雖然規則更寬鬆，但還是要避免用單字元進行命名，除了臨時變數和迴圈變數。
即使局部變數是`final`，也不應該把它視為常量，自然也不能用常量的規則去命名它。


### 8. 臨時變數
臨時變數通常被取名為 **i、j、k、m** 和 **n**，它們一般用於整型；**c、d、e**，它們一般用於字元型。
如：`for (int i = 0; i < len; i++)`。


### 9. 類型變數
類型變數可用以下兩種風格之一進行命名：
1. 單個的大寫字母，後面可以加一個數字 (如：E，T，X，T2)。
2. 以類命名方式 (參考[2. 類別名稱](#_2-類別名稱))，後面加個大寫的 T (如：`RequestT`，`FooBarT`)。


## 代碼樣式規範
### 1. 使用標準大括弧樣式
左大括弧不單獨佔一行，與其前面的代碼位於同一行：
```java
class MyClass {
    int func() {
        if (something) {
            // ...
        } else if (somethingElse) {
            // ...
        } else {
            // ...
        }
    }
}
```

我們需要在條件語句周圍添加大括弧，如果整個條件語句適合放在同一行，那麼可以將其全部放在同一行。
以下兩種寫法皆可：
```java
if (condition) {
    body();
}

if (condition) body();
```

不推薦使用以下寫法：
```java
if (condition)
    body();  // Bad!
```


### 2. 編寫簡短方法
在可行的情況下，盡量編寫短小精練的方法。
如果某個方法的代碼超出 40 行，請考慮是否可以在不破壞程式結構的前提下對其拆解。
我們瞭解，有些情況下較長的方法是恰當的，因此對方法的代碼長度沒有做出硬性限制。


### 3. 類別成員的順序
這並沒有唯一的正確解答，但如果都使用一致的順序將會提高代碼的可讀性，推薦使用以下排序：
1. 常量
2. 欄位
3. 構造函數
4. 重寫函數和回調
5. 公有函數
6. 私有函數
7. 內部類或介面

::: details 點開查看範例
```java
public class MainActivity extends Activity {
    private static final String TAG = MainActivity.class.getSimpleName();

    private String mTitle;
    private TextView mTextViewTitle;

    @Override
    public void onCreate() {
        ...
    }

    public void setTitle(String title) {
    	mTitle = title;
    }

    private void setUpView() {
        ...
    }

    static class AnInnerClass {
    }
}
```
:::

如果類繼承於 Android 元件 (`Activity`或`Fragment`)，那麼把重寫函數按照他們的生命週期進行排序是一個非常好的習慣。
例如：`Activity`實現了`onCreate()`、`onDestroy()`、`onPause()`、`onResume()`。
::: details 點開查看範例
```java
public class MainActivity extends Activity {

    // In order to match Activity lifecycle
    @Override
    public void onCreate() {
    }

    @Override
    public void onResume() {
    }

    @Override
    public void onPause() {
    }

    @Override
    public void onDestroy() {
    }
}
```
:::


### 4. 函數參數的排序
在 Android 開發過程中，`Context`在函數參數中相當常見，我們最好把`Context`作為其第一個參數。
反之，我們應把 callback 介面作為其最後一個參數。
::: details 點開查看範例
```java
// Context always be first
public User loadUser(Context context, int userId);

// Callbacks always be last
public void loadUserAsync(Context context, int userId, UserCallback callback);
```
:::


### 5. 字串常量的命名和值
Android SDK 中的很多類別都有用到鍵值對函數。
例如：`SharedPreferences`、`Bundle`、`Intent`，即便是一個小應用，我們最終也不得不編寫大量的字串常量。
當時用到這些類的時候，我們 **必須** 將它們的鍵定義為`static final`欄位，並遵循以下指示作為前綴標識。
| 類 | 前綴 |
| - | - |
| SharedPreferences | `PREF_` |
| Bundle | `BUNDLE_` |
| Fragment Arguments | `ARGUMENT_` |
| Intent Extra | `EXTRA_` |
| Intent Action | `ACTION_` |

::: details 點開查看範例
```java
// 欄位的值與名稱相同以避免重複問題
static final String PREF_EMAIL = "PREF_EMAIL";
static final String BUNDLE_AGE = "BUNDLE_AGE";
static final String ARGUMENT_USER_ID = "ARGUMENT_USER_ID";

// 用途類似之常量使用完整的包名作為值的前綴標識
static final String EXTRA_SURNAME = "com.myapp.extras.EXTRA_SURNAME";
static final String ACTION_OPEN_USER = "com.myapp.action.ACTION_OPEN_USER";
```
:::
::: tip
雖然`Fragment.getArguments()`得到的也是`Bundle`，但因為這是`Bundle`的常用用法，特意為此定義一個不同的前綴標識。
:::


### 6. Activities 和 Fragments 的資料傳遞
當`Activity`或`Fragment`啟動需要傳遞參數時，那麼它需要提供一個`public static`的函數來幫助啟動或創建它。
Android Studio 已幫你寫好了相關的 Live Templates，只需要在和啟動相關`Activity`的內部輸入`starter`，即可生成它的啟動器。
::: details 點開查看範例
```java
public static void start(Context context, User user) {
      Intent starter = new Intent(context, MainActivity.class);
      starter.putParcelableExtra(EXTRA_USER, user);
      context.startActivity(starter);
}
```
:::

同理，在和啟動相關`Fragment`的內部輸入`newInstance`即可。
::: details 點開查看範例
```java
public static MainFragment newInstance(User user) {
      Bundle args = new Bundle();
      args.putParcelable(ARGUMENT_USER, user);
      MainFragment fragment = new MainFragment();
      fragment.setArguments(args);
      return fragment;
}
```
:::
::: warning
這些函數需要放在`onCreate()`之前。
如果我們使用了這種方式，那麼`extras`和`arguments`的鍵應該是`private`，因為它們不再需要暴露給其他類別來使用。
:::


### 7. 行長限制
代碼中每一行的長度都不應該超過 **100** 個字元。
雖然關於此規則存在很多爭論，但最終決定仍是以 **100** 個字元為上限。
如果長度超過了 **100** (Android Studio 視窗右側的豎線就是設置的行寬)，我們通常有兩種方法來縮減行長。
* 提取一個局部變數或方法 (最好)。
* 使用換行符將一行換成多行。
:::tip
* 如果備註行包含長度超過 100 個字元的範例命令或文字網址，那麼為了便於剪切和粘貼，該行可以超過 100 個字元。
* 導入語句行可以超出此限制，因為使用者很少會看到它們 (這也簡化了工具編寫流程)。
:::


#### 7-1 換行策略
通常沒有一個正確的解答來決定如何換行，但是有某些規則可以應用於常見的情況。
* **操作符的換行**
  除賦值操作符之外，我們把換行符放在操作符之前。
  ::: details 點開查看範例
  ```java
  int longName = anotherVeryLongVariable + anEvenLongerOne - thisRidiculousLongOne 
          + theFinalOne;
  ```
  :::
  賦值操作符的換行我們放在其後。
  ::: details 點開查看範例
  ```java
  int longName =
          anotherVeryLongVariable + anEvenLongerOne - thisRidiculousLongOne + theFinalOne;
  ```
  :::

* **函數鏈的換行**
  當同一行中調用多個函數時 (使用構建器時)，對每個函數的調用應該在新的一行，我們把換行符插入在`.`之前。
  ::: details 點開查看範例
  ```java
  Picasso.with(context)
          .load("https://blankj.com/images/avatar.jpg")
          .into(ivAvatar);
  ```
  :::

* **多參數的換行**
  當一個方法有很多參數或者參數很長的時候，我們應該在每個`,`後面進行換行。
  ::: details 點開查看範例
  ```java
  loadPicture(context,
          "https://blankj.com/images/avatar.jpg",
          ivAvatar,
          "Avatar of the user",
          clickListener);
  ```
  :::

* **RxJAVA 鏈式的換行**
  RxJava 的每個操作符都需要換新行，並且把換行符插入在`.`之前。
  ::: details 點開查看範例
  ```java
  public Observable<Location> syncLocations() {
      return mDatabaseHelper.getAllLocations()
              .concatMap(new Func1<Location, Observable<? extends Location>>() {
                  @Override
                   public Observable<? extends Location> call(Location location) {
                       return mRetrofitService.getLocation(location.id);
                   }
              })
              .retry(new Func2<Integer, Throwable, Boolean>() {
                   @Override
                   public Boolean call(Integer numRetries, Throwable throwable) {
                       return throwable instanceof RetrofitError;
                   }
              });
  }
  ```
  :::


## 資源文件規範
資源檔命名為全部小寫，採用 **下劃線命名法**。
如果是元件化開發，我們可以在元件和公共模組間創建一個 UI 模組來專門存放資源檔，然後讓每個元件都依賴 UI 模組。
這樣做的好處是如果老專案要實現元件化的話，只需把資源檔都放入 UI 模組即可。
如果想對資源檔進行分包，可以參考這篇文章：**[Android Studio 下對資源進行分包](https://blankj.com/2016/09/21/android-studio-classify-src-package/)**；避免了多個模組間資源不能複用的問題。
如果是三方庫開發，其使用到的資源檔及相關的`name`都應該使用庫名作為前綴標識，這樣做可以避免三方庫資源和實際應用資源同名的衝突。


### 1. 動畫資源檔案 (anim/ 和 animator/)
Android 主要包含屬性動畫和視圖動畫，其視圖動畫包括補間動畫和逐幀動畫。
屬性動畫檔需要放在`res/animator/`目錄下，檢視動畫檔需放在`res/anim/`目錄下。
可採用`{模組名_}邏輯名稱`的命名方式。
例如：`refresh_progress.xml`、`market_cart_add.xml`、`market_cart_remove.xml`。
::: tip
`邏輯名稱`可由多個單詞加下劃線組成。
:::

如果是普通的補間動畫或者屬性動畫，可採用`動畫類型_方向`的命名方式。
| 名稱 | 說明 |
| :-: | :-: |
| `fade_in` | 淡入 |
| `fade_out` | 淡出 |
| `push_down_in` | 從下方推入 |
| `push_down_out` | 從下方推出 |
| `push_left` | 推向左方 |
| `slide_in_from_top` | 從頭部滑動進入 |
| `zoom_enter` | 變形進入|
| `slide_in` | 滑動進入 |
| `shrink_to_middle` | 中間縮小 |


### 2. 顏色資源檔案 (color/)
專門存放顏色相關的資源檔。
也可以放於`res/drawable/`目錄，引用時則使用`@drawable`，但不推薦這麼做。
可採用`類型{_模組名}_邏輯名稱`的命名方式。
例如：`sel_btn_font.xml`。


### 3. 圖片資源檔案 (drawable/ 和 mipmap/)
`res/drawable/`目錄下放的是圖檔 (.png、.9.png、.jpg、.gif) 或編譯為可繪製物件資源子類型的 XML 檔； 而`res/mipmap/`目錄下放的是不同密度的啟動圖示。
可採用`類型{_模組名}_邏輯名稱`、`類型{_模組名}_顏色`的命名方式。
| 名稱 | 說明 |
| - | - |
| `btn_main_about.png` | 主頁關於按鍵`類型_模組名_邏輯名稱` |
| `btn_back.png` | 返回按鍵`類型_邏輯名稱`|
| `divider_maket_white.png` | 商城白色分割線`類型_模組名_顏色` |
| `ic_edit.png` | 編輯圖示`類型_邏輯名稱` |
| `bg_main.png` | 主頁背景`類型_邏輯名稱` |
| `btn_red.png` | 紅色按鍵`類型_顏色` |
| `btn_red_big.png` | 紅色大按鍵`類型_顏色` |
| `ic_head_small.png` | 小頭像圖示`類型_邏輯名稱` |
| `bg_input.png` | 輸入框背景`類型_邏輯名稱` |
| `divider_white.png` | 白色分割線`類型_顏色` |
| `bg_main_head.png` | 主頁頭部背景`類型_模組名_邏輯名稱` |
| `def_search_cell.png` | 搜尋頁面預設單元圖片`類型_模組名_邏輯名稱` |
| `ic_more_help.png` | 更多說明圖示`類型_邏輯名稱` |
| `divider_list_line.png` | 清單分割線`類型_邏輯名稱` |
| `sel_search_ok.xml` | 搜尋介面確認選擇器`類型_模組名_邏輯名稱` |
| `shape_music_ring.xml` | 音樂介面環形形狀`類型_模組名_邏輯名稱` |
::: tip
`類型`可以是可繪製對象資源類型，也可以是控件類型 (具體見附錄[UI 控件縮寫表](#ui-控件縮寫表))，最後可加後綴`_small`表示小圖，`_big`表示大圖。
:::

如果有多種形態，如按鈕選擇器：`sel_btn_xx.xml`，採用如下命名：
| 名稱 | 說明 |
| - | - |
| `sel_btn_xx` | 作用在`btn_xx`上的`selector` |
| `btn_xx_normal` | 默認狀態效果 |
| `btn_xx_pressed` | `state_pressed`點擊效果 |
| `btn_xx_focused` | `state_focused`聚焦效果 |
| `btn_xx_disabled` | `state_enabled`不可用效果 |
| `btn_xx_checked` | `state_checked`選中效果 |
| `btn_xx_selected` | `state_selected`選中效果 |
| `btn_xx_hovered` | `state_hovered`懸停效果 |
| `btn_xx_checkable` | `state_checkable`可選效果 |
| `btn_xx_activated` | `state_activated`啟動效果 |
| `btn_xx_window_focused` | `state_window_focused`視窗聚焦效果 |
::: tip
使用 Android Studio 的插件 SelectorChapek，可以快速生成 selector，前提是要遵守命名規範。
:::


### 4. 佈局資源檔 (layout/)
可採用`類型_模組名`、`類型{_模組名}_邏輯名稱`的命名方式。
| 名稱 | 說明|
| :-: | :-: |
| `activity_main.xml` | 主表單`類型_模組名` |
| `activity_main_head.xml` | 主表單頭部`類型_模組名_邏輯名稱` |
| `fragment_music.xml` | 音樂片段`類型_模組名` |
| `fragment_music_player.xml` | 音樂片段的播放器`類型_模組名_邏輯名稱` |
| `dialog_loading.xml` | 載入對話框`類型_邏輯名稱` |
| `ppw_info.xml` | 資訊彈窗(PopupWindow)`類型_邏輯名稱` |
| `item_main_song.xml` | 主頁歌曲清單項`類型_模組名_邏輯名稱` |


### 5. 選單資源檔案 (menu/)
功能表相關的資源檔應放在該目錄下。
可採用`{模組名_}邏輯名稱`的命名方式。
例如：`main_drawer.xml`、`navigation.xml`。


### 6. values 資源檔 (values/)
`values/`資源檔下的檔都以 s 結尾，如`attrs.xml`、`colors.xml`、`dimens.xml`，起作用的不是檔案名稱，而是`<resources>`標籤下的各種標籤。
例如：`<style>`決定樣式，`<color>`決定顏色，所以，可以把一個大的`xml`檔分割成多個小的檔案。
像是`styles.xml`、`styles_home.xml`、`styles_item_details.xml`、`styles_forms.xml`。


#### 6-1 colors.xml
`<color>`的`name`命名使用下劃線命名法，在你的`colors.xml`檔案中應該只是映射顏色的名稱一個 ARGB 值，而沒有其它的。
不要使用它為不同的按鈕來定義 ARGB 值。
```xml
  <resources>
      <color name="button_foreground">#FFFFFF</color>
      <color name="button_background">#2A91BD</color>
      <color name="comment_background_inactive">#5F5F5F</color>
      <color name="comment_background_active">#939393</color>
      <color name="comment_foreground">#FFFFFF</color>
      <color name="comment_foreground_important">#FF9D2F</color>
      ...
      <color name="comment_shadow">#323232</color>
</resources>
```
使用這種格式，會非常容易重複定義ARGB值，而且如果應用要改變基色的話會非常困難。
同時，這些定義是跟一些環境關聯起來的。
例如：`button`或`comment`，應該放到一個按鈕風格中，而不是在`colors.xml`檔中。

應該這樣做：
```xml
<resources>

    <!-- Grayscale -->
    <color name="white" >#FFFFFF</color>
    <color name="gray_light">#DBDBDB</color>
    <color name="gray" >#939393</color>
    <color name="gray_dark" >#5F5F5F</color>
    <color name="black" >#323232</color>

    <!-- Basic Colors -->
    <color name="green">#27D34D</color>
    <color name="blue">#2A91BD</color>
    <color name="orange">#FF9D2F</color>
    <color name="red">#FF432F</color>
    ...
</resources>
```
向應用設計者那裡要這個調色板，名稱不需要跟`"green"`、`"blue"`等等相同。
`"brand_primary"`、`"brand_secondary"`、`"brand_negative"`這樣的名字也是完全可以接受的。
像這樣規範的顏色很容易修改或重構，應用一共使用了多少種不同的顏色變得非常清晰。
通常一個具有審美價值的 UI 來說，減少使用顏色的種類是非常重要的。
::: warning
如果某些顏色和主題有關，那就單獨寫一個`colors_theme.xml`。
:::


#### 6-2 dimens.xml
像對待`colors.xml`一樣對待`dimens.xml`檔案，與定義顏色調色板一樣，你同時也應該定義一個空隙間隔和字體大小的 **調色板**。
```xml
<resources>

    <!-- font sizes -->
    <dimen name="font_22">22sp</dimen>
    <dimen name="font_18">18sp</dimen>
    <dimen name="font_15">15sp</dimen>
    <dimen name="font_12">12sp</dimen>

    <!-- typical spacing between two views -->
    <dimen name="spacing_40">40dp</dimen>
    <dimen name="spacing_24">24dp</dimen>
    <dimen name="spacing_14">14dp</dimen>
    <dimen name="spacing_10">10dp</dimen>
    <dimen name="spacing_4">4dp</dimen>

    <!-- typical sizes of views -->
    <dimen name="button_height_60">60dp</dimen>
    <dimen name="button_height_40">40dp</dimen>
    <dimen name="button_height_32">32dp</dimen>
    ...
</resources>
```
佈局時在寫`margins`和`paddings`時，你應該使用`spacing_xx`尺寸格式來佈局，而不是像對待`string`字串一樣直接寫值，像這樣規範的尺寸很容易修改或重構，會使所有用到的尺寸一目了然。


#### 6-3 strings.xml
`<string>`的`name`命名使用下劃線命名法，可採用`{模組名_}邏輯名稱`的命名方式，這樣方便同一個介面所有的`string`都放到一起，方便尋找。
| 名稱 | 說明 |
| - | - |
|`main_menu_about`| 主功能表按鍵文字 |
|`friend_title`| 好友模組標題欄 |
|`friend_dialog_del`| 好友刪除提示 |
|`login_check_email`| 登錄驗證 |
|`dialog_title`| 彈出框標題 |
|`button_ok`| 確認鍵 |
|`loading`| 載入文字 |


#### 6-4 styles.xml
`<style>`的`name`命名使用 UpperCamelCase，幾乎每個專案都需要適當的使用`styles.xml`檔，因為對於一個視圖來說，重複的外觀是很常見的，將所有的外觀細節屬性 (`colors`、`padding`、`font`) 放在`styles.xml`檔中。
在應用中對於大多數文本內容，最起碼你應該有一個通用的`styles.xml`檔案。
```
<style name="ContentText">
    <item name="android:textSize">@dimen/font_normal</item>
    <item name="android:textColor">@color/basic_black</item>
</style>
```

套用到`TextView`中：
```
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/price"
    style="@style/ContentText"/>
```


### 7. id 命名
可採用`view 縮寫{_模組名}_邏輯名`的命名方式。
例如：`btn_main_search`、`btn_back`。

如果在專案中有用 BufferKnife 的話，使用 Android Studio 的插件：ButterKnife Zelezny，方便讓你說明所生成之註解；沒用 BufferKnife 的話可以使用 Android Code Generator。


## 版本統一規範
Android 開發會遇到許多不同版本。
例如：`compileSdkVersion`、`minSdkVersion`、`targetSdkVersion`以及項目中依賴第三方庫的版本。
不同的 Module 及不同的開發人員都有不同的版本，所以需要一個統一版本規範的檔。

具體可以參考這篇博文：**[Android 開發之版本統一規範](https://blankj.com/2016/09/21/android-keep-version-unity/)**。

如果是開發多個系統級別的應用，當多個應用同時用到相同的`so`庫時，一定要確保`so`庫的版本一致，否則可能會引發應用崩潰。


## 第三方庫規範
別再閉門造車了，用用最新的技術吧：**[Android 流行框架查速表](http://www.ctolib.com/cheatsheets-Android-ch.html)** 、 **[Android 開發人員不得不收集的代碼](https://github.com/Blankj/AndroidUtilCode)**。
希望 Team 能用時下較新的技術，對開源庫的選取，一般都需要選擇比較穩定的版本，作者在維護的專案，要考慮作者對 Issue 的解決，以及開發者的知名度等各方面。
選取之後，一定的封裝是必要的。

個人推薦以下幾種工具：
* **[Retrofit](https://github.com/square/retrofit)**
* **[RxAndroid](https://github.com/ReactiveX/RxAndroid)**
* **[OkHttp](https://github.com/square/okhttp)**
* **[Glide](https://github.com/bumptech/glide)**
* **[Fresco](https://github.com/facebook/fresco)**
* **[Fastjson](https://github.com/alibaba/fastjson)**
* **[EventBus](https://github.com/greenrobot/EventBus)**
* **[AndroidEventBus](https://github.com/bboyfeiyu/AndroidEventBus)**
* **[GreenDao](https://github.com/greenrobot/greenDAO)**
* **[Dagger2](https://github.com/google/dagger)**(擇用)
* **[Tinker](https://github.com/Tencent/tinker)**(擇用)


## 註釋規範
為了減少他人閱讀你代碼的痛苦值，請在關鍵地方做好註釋。


### 1. 類別註釋
每個類完成後應該有作者姓名和聯繫方式的註釋，對自己的代碼負責。
```java
/**
 * <pre>
 * author : Blankj
 * e-mail : xxx@xx
 * time : 2017/03/07
 * desc ： xxxx 描述
 * version: 1.0
 * </pre>
 */
public class WelcomeActivity {
    ...
}
```

具體可以在 Android Studio 中自己配置，進入 Settings -> Editor -> File and Code Templates -> Includes -> File Header，輸入以下代碼：
```java
/**
 * <pre>
 * author : ${USER}
 * e-mail : xxx@xx
 * time : ${YEAR}/${MONTH}/${DAY}
 * desc :
 * version: 1.0
 * </pre>
 */
```
這樣便可在每次新建類的時候自動加上開頭註釋。


### 2. 方法註釋
每一個成員方法(包括自定義成員方法、覆蓋方法、屬性方法)的方法頭都必須做方法頭註釋，在方法前一行輸入`/**`+ Enter 或者設置`Fix doc comment`(Settings -> Keymap -> Fix doc comment) 快捷鍵，Android Studio 便會幫你生成模板，我們只需要補全參數即可。
例如：
```java
/**
 * bitmap轉byteArr
 *
 * @param bitmap bitmap物件
 * @param format 格式
 * @return 位元組陣列
 */
public static byte[] bitmap2Bytes(Bitmap bitmap, CompressFormat format) {
    if (bitmap == null) return null;
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    bitmap.compress(format, 100, baos);
    return baos.toByteArray();
}
```


### 3. 塊註釋
塊註釋與其周圍的代碼在同一縮進級別。
它們可以是`/* ... */`風格，也可以是`// ...`風格 (**`//`後最好帶一個空格**)。
對於多行的`/* ... */`註釋，後續行必須從`*`開始， 並且與前一行的`*`對齊。
```java
/*
 * This is
 * okay.
 */

/* Or you can even
 * do like this. */
```
註釋不要封閉在由星號或其它字元繪製的框架裡。
::: tip
在寫多行註釋時，如果你希望在必要時能重新換行 (即註釋像段落風格一樣)，那麼使用`/* ... */`。
:::


### 4. 其他一些註釋
Android Studio 已幫你集成了一些註釋模板，我們只需要直接使用即可，在代碼中輸入`todo`、`fixme`等這些註釋模板，點擊 Enter 後便會出現如下註釋：
```java
// TODO: 17/3/14 需要實現，但目前還未實現的功能的說明
// FIXME: 17/3/14 需要修正，甚至代碼是錯誤的，不能工作，需要修復的說明
```


## 測試規範
業務開發完成之後，開發人員做單元測試，單元測試完成之後，保證單元測試全部通過，同時單元測試代碼覆蓋率達到一定程度 (這個需要開發和測試約定，理論上越高越好)。


### 1. 單元測試
測試類的名稱應該是所測試類的名稱加`Test`，我們創建`DatabaseHelper`的測試類，其名應該叫`DatabaseHelperTest`。
測試函數被`@Test`所註解，函數名通常以被測試的方法為前綴，接下來是前提條件和預期的結果。
* 樣本：`void methodName 前提條件和預期結果()`
* 例子：`void signInWithEmptyEmailFails()`

有時一個類可能包含大量的方法，同時需要對每個方法進行幾次測試。
在這種情況下，建議將測試類分成多個類。
例如：如果`DataManager`包含很多方法，我們可能要把它分成`DataManager Sign InTest`、`DataManagerLoad UsersTest`等等。
::: warning
如果函數足夠清晰，那麼前提條件和預期的結果是可以省略的。
:::


### 2. Espresso 測試
每個 Espresso 測試通常是針對`Activity`，所以其測試名就是其被測的`Activity`的名稱加`Test`。
例如：`SignInActivityTest`。


## 其他規範
1. 合理佈局，有效運用`<merge>`、`<ViewStub>`、`<include>`標籤。
2. `Activity`和`Fragment`裡面有許多重複的操作以及操作步驟，所以我們都需要提供一個`BaseActivity`和`BaseFragment`，讓所有的`Activity`和`Fragment`都繼承這個基礎類別。
3. 方法基本上都按照調用的先後順序在各自區塊中排列。
4. 相關功能作為小區塊放在一起 (或者封裝掉)。
5. 當一個類別有多個構造函數，或是多個同名函數，這些函數應該按順序出現在一起。
6. 資料提供統一的入口。
   無論是在 MVP、MVC 還是 MVVM 中，提供一個統一的數據入口，都可以讓代碼變得更加易於維護。
   例如：可使用一個`DataManager`，把`HTTP`、`preference`、`eventpost`、`database`都放在`DataManager`裡面進行操作，我們只需要與`DataManager`打交道。
7. 多用組合，少用繼承。
8. 提取方法，去除重複代碼。
   對於必要的工具類抽取也很重要，這在以後的專案中是可以重用的。
9. 可引入`Dagger2`減少模組之間的耦合性。
   `Dagger2`是一個依賴注入框架，使用代碼自動生成創建依賴關係需要的代碼。
   減少很多範本化的代碼，更易於測試，降低耦合，創建可複用可互換的模組。
10. 專案引入`RxAndroid`回應式程式設計，可以極大的減少邏輯代碼。
11. 透過引入事件總線，如：`EventBus`、`AndroidEventBus`、`RxBus`，它允許我們在`DataLayer`中發送事件，以便`ViewLayer`中的多個元件都能夠訂閱到這些事件，減少 callback。
12. 盡可能使用局部變數。
13. 及時關閉 Stream。
14. 盡量減少對變數的重複計算。
    如果下面的操作：
    ```java
    for (int i = 0; i < list.size(); i++) {
        ...
    }
    ```
    
    建議取代為：
    ```java
    for (int i = 0, len = list.size(); i < len; i++) {
        ...
    }
    ```
15. 盡量採用懶加載的策略，即在需要的時候才創建。
    ```java
    String str = "aaa";
    if (i == 1) {
        list.add(str);
    }
    ```
    
    建議取代為：
    ```java 
    if (i == 1) {
        String str = "aaa";
        list.add(str);
    }
    ```
16. 不要在迴圈中使用`try... catch...`，應該把其放在最外層。
17. 使用帶緩衝的輸入輸出 Stream 進行 IO 操作。
18. 盡量使用`HashMap`、`ArrayList`、`StringBuilder`，除非線程安全需要，否則不推薦使用`HashTable`、`Vector`、`StringBuffer`，後三者由於使用同步機制而導致了性能開銷。
19. 盡量在合適的場合使用單例。
    使用單例可以減輕載入的負擔、縮短載入的時間、提高載入的效率，但並不是所有地方都適用於單例。
    簡單來說，單例主要適用於以下三個方面：
    * 控制資源的使用，通過線程同步來控制資源的併發訪問。
    * 控制實例的產生，以達到節約資源的目的。
    * 控制數據的共用，在不建立直接關聯的條件下，讓多個不相關的進程或線程之間實現通信。
21. 把一個基本數據類型轉為字串，`基本數據類型.toString()`是最快的方式，`String.valueOf(數據)`次之，`數據 + ""`最慢。
22. 使用 Android Studio 自帶的 Lint 來最佳化代碼結構 (右鍵 module、目錄或檔案，選擇 Analyze -> Inspect Code)。
23. 最後不要忘了記憶體洩漏的檢測。


## 附錄
### UI 控件縮寫表
| 名稱 | 縮寫 |
| :-: | :-: |
| Button | btn |
| CheckBox | cb |
| EditText | et |
| FrameLayout | fl |
| GridView | gv |
| ImageButton | ib |
| ImageView | iv |
| LinearLayout | ll |
| ListView | lv |
| ProgressBar | pb |
| RadioButton | rb |
| RecyclerView | rv |
| RelativeLayout | rl |
| ScrollView | sv |
| SeekBar | sb |
| Spinner | spn |
| TextView | tv |
| ToggleButton | tb |
| VideoView | vv |
| WebView | wv |


### 常見的英文單詞縮寫表
| 名稱 | 縮寫 |
| :-: | :-: |
| average | avg |
| background | bg(主要用於佈局和子佈局的背景) |
| buffer | buf |
| control | ctrl |
| current | cur |
| default | def |
| delete | del |
| document | doc |
| error | err |
| escape | esc |
| icon | ic(主要用在 App 的圖示) |
| increment | inc |
| information | info |
| initial | init |
| image | img |
| Internationalization | I18N |
| length | len |
| library | lib |
| message | msg |
| password | pwd |
| position | pos |
| previous | pre |
| selector | sel(主要用於某一 view 多種狀態，不僅包括 ListView 中的 selector，還包括按鈕的 selector) |
| server | srv |
| string | str |
| temporary | tmp |
| window | win |


## 參考
[Android 開發規範](https://github.com/Blankj/AndroidStandardDevelop)<br>
[Android 包命名規範](http://www.ayqy.net/blog/android%E5%8C%85%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83/)<br>
[Android 開發最佳實踐](https://github.com/futurice/android-best-practices/blob/master/translations/Chinese/README.cn.md)<br>
[Android 編碼規範](http://www.jianshu.com/p/0a984f999592)<br>
[Project and code style guidelines](https://github.com/ribot/android-guidelines/blob/master/project_and_code_guidelines.md)<br>
[Google Java 編程風格指南](http://www.hawstein.com/posts/google-java-style.html)<br>
[小細節，大用途，35 個 Java 代碼性能優化總結！](http://www.jianshu.com/p/436943216526)
