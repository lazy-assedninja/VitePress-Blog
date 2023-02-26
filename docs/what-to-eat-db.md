---
title: WhatToEat - DB
editLink: false
---

# {{ $frontmatter.title }}


## UserAccount
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
name|varchar(50)|使用者名稱
picture|varchar(200)|頭像檔名
email|varchar(100)(unique)|電子信箱
password|varchar(100)|密碼
role|int|角色(0=使用者, 1=管理者, 2=店家)
account_type|varchar(50)|帳號種類
verification_code|varchar(10)|驗證碼
permission_time|datetime|權限到期日
create_date|datetime|創建日期
modify_date|datetime|修改日期


## LineAccount
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
display_name|varchar(50)|使用者名稱
picture_url|varchar()|頭像URL
user_id|varchar()(unique)|使用者編號
status_message|varchar()|使用者狀態
follow_status|boolean|追蹤狀態
what_to_eat_account|WhatToEatUserAccount(fk)|WhatToEat連結之帳號
binging_status|varchar()|綁定流程狀態
create_date|datetime|創建日期
modify_date|datetime|修改日期


## Classify
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
name|varchar(50)|種類名稱
tag_color|varchar()|標籤色號


## Tag
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
name|varchar(50)|標籤名稱


## Store
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
place_id|varchar(50)|google place編號
name|varchar(50)|店家名稱
address|varchar(50)|地址
phone|varchar(30)|電話
picture|varchar(200)|頭像檔名
favorite|WhatToEatUserAccount(m2m)|喜愛之使用者
classify|Classify(m2m)|種類
tag|Tag(fk)|標籤
latitude|varchar(30)|緯度
longitude|varchar(30)|經度
star|float(0)|星數
website|varchar(300)|帳號種類
create_date|datetime|創建日期
modify_date|datetime|修改日期


## Comment
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|店家之留言
user|WhatToEatUserAccount(fk)|留言之使用者
star_amount|float(0)|評論星數
content|varchar(200)|評論內容
create_date|datetime|創建日期


## Post
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|店家之貼文
title|varchar(50)|貼文標題
content|varchar(200)|貼文內容
create_date|datetime|創建日期


## Reservation
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|預約之店家
user|WhatToEatUserAccount(fk)|預約之使用者
name|varchar(50)|姓名
phone|varchar(20)|電話
amount|varchar(5)|人數
reservation_time|varchar(100)|預約時間
create_date|datetime|創建日期


## ReservationInformation
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|預約之店家
user|WhatToEatUserAccount(fk)|預約之使用者


## Discount
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|折扣之店家
title|varchar(50)|折扣標題
picture|varchar(100)|折扣照片檔名
discount|varchar(50)|折數
deadline|varchar(50)|截止日期
notice|varchar(200)|注意事項


## Report
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
store|Store(fk)|回報之店家
user|WhatToEatUserAccount(fk)|回報之使用者
content|varchar(200)|回報內容
create_date|datetime|創建日期


## SystemLog
Name|Type|Descriptions
:-|:-|:-
id|int(pk)|-
application|varchar(50)|報錯之APP
logged|datetime|錯誤發生日期
level|varchar(50)|報錯之種類
message|varchar()|報錯內容
logger|varchar(250)|報錯之功能
call_site|varchar(250)|
exception|varchar()|