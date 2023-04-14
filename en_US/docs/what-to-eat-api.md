---
title: WhatToEat - API
editLink: false
---

# {{ $frontmatter.title }} <Badge type="warning" text="deprecated" />


## User/Login
> 登入
::: details Request
```json
{
    "email": "",
    "password": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "email": "",
    "name": "",
    "picture": "",
    "role": 0, 
    "accountType": "",
    "permissionTime": ""
}
```
:::


## User/ThreePartLogin
> 第三方登入
::: details Request
```json
{
    "email": "",
    "name": "",
    "accountType": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "email": "",
    "name": "",
    "picture": "",
    "role": 1,
    "accountType": "",
    "permissionTime": ""
}
```
:::


## User/SignUp
> 註冊
::: details Request
```json
{
    "email": "",
    "password": "",
    "name": "",
    "role": "",
    "accountType": ""
}
```
:::
:::details Response
```json
{
    "result": 1
}
```
:::


## User/UpdatePassword
> 更改密碼
::: details Request
```json
{
    "email": "",
    "oldPassword": "",
    "newPassword": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## User/SendVerificationCodeEmail
> 發送驗證碼 Email
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Respnse
```json
{
    "result": 1,
    "verificationCode": ""
}
```
:::


## User/ResetPassword
> 重設密碼
::: details Request
```json
{
    "email": "",
    "verificationCode": "",
    "newPassword": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## User/UpdateAccountPermissionDeadline
> 更新店家權限時限
::: details Request
```json
{
    "email": "",
    "role": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "permissionTime": ""
}
```
:::


## User/UpdatePicture
> 更新圖片
::: details Request
```json
{
    "email": "",
    "picture": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## User/GetPicture
> 取得圖片 URL
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "picture": ""
}
```
:::


## Stores/GetClassifyList
> 取得標籤列表
::: details Response
```json
{
    "result": 1,
    "classifications": [
        {
            "name": "",
            "tagColor": ""
        }
    ]
}
```
:::


## Stores/GetStoreList
> 取得店家列表
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "stores": [
        {
            "name": "",
            "address": "",
            "picture": "",
            "phone": "",
            "website": "",
            "classification": [
                {
                    "name": "",
                    "tagColor": ""
                }
            ],
            "tag": "",
            "isFavorite": true,
            "latitude": "",
            "longitude": "",
            "star": ""
        }
    ]
}
```
:::


## Stores/StoreSearch
> 店家搜尋
::: details Request
```json
{
    "email": "",
    "kind": "",
    "keywords": [""]
}
```
:::
::: details Response
```json
{
    "result": 1,
    "stores": [
        {
            "name": "",
            "address": "",
            "picture": "",
            "phone": "",
            "website": "",
            "classification": [
                {
                    "name": "",
                    "tagColor": ""
                }
            ],
            "tag": "",
            "isFavorite": true,
            "latitude": "",
            "longitude": "",
            "star": ""
        }
    ]
}
```
:::


## Stores/GetTabList
> 取得符合標籤之店家列表
::: details Request
```json
{
    "email": "",
    "tag": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "stores": [
        {
            "name": "",
            "address": "",
            "picture": "",
            "phone": "",
            "website": "",
            "classification": [
                {
                    "name": "",
                    "tagColor": ""
                }
            ],
            "tag": "",
            "isFavorite": true,
            "latitude": "",
            "longitude": "",
            "star": ""
        }
    ]
}
```
:::


## Stores/CreateComment
> 新增留言
::: details Request
```json
{
    "storeName": "",
    "userEmail": "",
    "content": "",
    "starAmount": ""
}
```
:::
::: details Reponse
```json
{
    "result": 1
}
```
:::

## Stores/GetCommentList
> 取得留言列表
::: details Request
```json
{
    "storeName": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "comments": [
        {
            "id": "",
            "userName": "",
            "userPicture": "",
            "content": "",
            "starAmount": "",
            "createDate": ""
        }
    ]
}
```
:::

## Stores/CreatePost
> 新增貼文
::: details Request
```json
{
    "storeName": "",
    "title": "",
    "content": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/GetPostList
> 取得貼文列表
::: details Request
```json
{
    "storeName": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "posts": [
        {
            "id": "",
            "title": "",
            "content": "",
            "createDate": ""
        }
    ]
}
```
:::


## Stores/CreateReservation
> 新增預約
::: details Request
```json
{
    "storeName": "",
    "email": "",
    "name": "",
    "phone": "",
    "amount": "",
    "reservationTime": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/GetReservationList
> 取得預約列表
::: details Request
```json
{
    "kind": "",
    "information": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "reservations": [
        {
            "id": "",
            "name": "",
            "phone": "",
            "amount": "",
            "reservationTime": "",
            "createDate": ""
        }
    ]
}
```
:::


## Stores/GetReservationInformation
> 取得預約資訊
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "reservationInformation": ""
}
```
:::


## Stores/DeleteReservation
> 刪除預約
::: details Request
```json
{
    "id": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/GetDiscountList
> 取得折扣列表
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "discounts": [
        {
            "storeName": "",
            "title": "",
            "picture": "",
            "discount": "",
            "deadline": "",
            "notice": ""
        }
    ]
}
```
:::


## Stores/AddToFavorite
> 新增收藏
::: details Request
```json
{
    "email": "",
    "storeName": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/CancelFavorite
> 取消收藏
::: details Request
```json
{
    "email": "",
    "storeName": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/GetFavoriteList
> 取得收藏列表
::: details Request
```json
{
    "email": ""
}
```
:::
::: details Resposne
```json
{
    "result": 1,
    "stores": [
        {
            "name": "",
            "address": "",
            "picture": "",
            "phone": "",
            "website": "",
            "tag": "",
            "isFavorite": true,
            "latitude": "",
            "longitude": "",
            "star": ""
        }
    ]
}
```
:::


## Stores/GetHistoryList
> 取得歷史列表
::: details Request
```json
{
    "email": "",
    "names": [""]
}
```
:::
::: details Response
```json
{
    "result": 1,
    "stores": [
        {
            "name": "",
            "address": "",
            "picture": "",
            "phone": "",
            "website": "",
            "tag": "",
            "isFavorite": true,
            "latitude": "",
            "longitude": "",
            "star": ""
        }
    ]
}
```
:::


## Stores/CreateReport
> 新增回報
::: details Request
```json
{
    "storeName": "",
    "email": "",
    "content": ""
}
```
:::
::: details Response
```json
{
    "result": 1
}
```
:::


## Stores/GetReportList
> 取得回報列表
::: details Response
```json
{
    "result": 1,
    "reports": [
        {
            "id": "",
            "userName": "",
            "userPicture": "",
            "storeName": "",
            "content": "",
            "createDate": ""
        }
    ]
}
```
:::

## Picture/Create
> 新增圖片
::: details Request
```json
{
    "file_name": "",
    "sub_file_name": "",
    "file": "",
    "type": ""
}
```
:::
::: details Response
```json
{
    "result": 1,
    "picturePath": "",
    "fullPath": ""
}
```
:::
