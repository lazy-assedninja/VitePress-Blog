---
title: Django - Line Bot 聊天機器人
date: 2021-06-14
description: 由於 **Line Bot Messaging API** 的一般訊息種類在電腦版上無法正常顯示，會變成請使用者至手機上查看之替代文字。 因此這次 Line Bot 開發選擇可自訂排版且能在電腦版顯示之 **Flex Message**。
---

# {{ $frontmatter.title }}


## 建立 Provider & Channel
進入 [LINE Developers](https://developers.line.biz/console/)，點擊 Create 按鈕新增 Provider。
![Create Line Provider](https://i.imgur.com/pV1fyVq.png)

進入 Provider 後，點擊 Create a new channel，便會跳出選擇 Channel Type 的視窗。
![Create New Channel](https://i.imgur.com/1lSO1T6.png)

選擇 Messaging API 選項，將資料填寫完畢後點擊 Create，便完成了 Channel 的創建。


## 實作 Webhook
::: tip
以下將不會對 Django 建置多做敘述，如有需要請參考 [Django Document](https://docs.djangoproject.com/en/2.1/intro/tutorial01/)。
:::

在 Python 的虛擬環境安裝所需的套件`line-bot-sdk`：
```bash
pip install line-bot-sdk
```

進入剛新建的 Channel 中，點擊 Messaging API。
![Messaging API](https://i.imgur.com/stwHQaQ.png)

滑至底部後會看到 Channel access token，點擊 Issue (由於我已創建過 token，所以顯示 Reissue)。
![Channel access token](https://i.imgur.com/nRyFDeW.png)

Channel Secret 在 Basic setting 裡便可找到。
![Basic settings](https://i.imgur.com/KMzSf1q.png)

取得 Access Token 和 Secret 後，在`views.py`中加入 Line Bot SDK 所需之初始化設定：
```python
from linebot import LineBotApi, WebhookHandler

line_bot_api = LineBotApi('YOUR_CHANNEL_ACCESS_LONG_TOKEN')
web_hook_handler = WebhookHandler(LINE['YOUR_CHANNEL_SECRET'])
```

實作 Webhook 驗證功能：
```python
from django.http import HttpResponse
from linebot.exceptions import LineBotApiError

def webhook(request):
    try:
        # Signature
        signature = request.headers['X-Line-Signature']
        body = request.body.decode()
        web_hook_handler.handle(body, signature)
    except LineBotApiError as e:
        print(str(e))
    return HttpResponse("Success.") # 需要返回一個訊息給 LINE 平台，驗證時會判斷訊息的 Status Code 來確認是否成功
```

將`webhook`加入至`urls.py`，即可完成網址的設定：
```python
from line_bot import views as line

urlpatterns = [

    ...

    path('LineBot/Webhook', line.webhook, name='line_bot_webhook')
]
```


## 設定 Messaging API
至[LINE Official Account Manager](https://manager.line.biz/account/)選擇官方帳號，點擊聊天，選擇設定回應模式。
![LINE Official Account Manager Dialog](https://i.imgur.com/BwBA5VC.png)

設定結果如下。
![Response Configuration](https://i.imgur.com/tGOHjV6.png)

設定完成後啟動 Server，將產生的網址填入 [LINE Developers](https://developers.line.biz/console/) Messaging API 中的 Webhook URL 並點擊 Verify，如果成功便會跳出 Success 視窗 (此為 LINE 預設之訊息)。
![Success Dialog](https://i.imgur.com/7luO5nO.png)
::: warning
Django 使用虛擬環境執行無固定 IP，且 Webhook URL 只能使用 HTTPS 協定之 API，推薦使用 [ngrok](https://ngrok.com)。
:::


## 選擇並配置 Flex Message 模板
這邊選擇使用官方提供的 [Flex Message Simulator](https://developers.line.biz/flex-simulator/)，中間可以進行元件的新增和刪除，右邊則是可以調整元件之屬性，而 Showcase 裡有官方所提供的數個模板可供套用，也可點擊 View as JSON 直接修改或取得模版之 Json 檔。
![Flex Message Template](https://i.imgur.com/CBvsthB.png)


## 實作 Line Bot API 並結合 Flex Message
::: tip
以下以 WhatToEat 之功能為範例來做說明。
:::

目前只有用到其中幾種事件：監聽一般訊息的`MessageEvent`、監聽追蹤的`FollowEvent`及監聽按鈕回傳值的`PostbackEvent`。
只要是出現在聊天室的訊息都會觸發監聽一般訊息的`MessageEvent`，為了確認能夠從 LINE 平台取得聊天室訊息，實作一個鸚鵡機器人來測試：
```python
@web_hook_handler.add(MessageEvent, message=TextMessage)
def echo(event):
    try:
        line_bot_api.reply_message(event.reply_token,
                TextSendMessage(text=event.message.text))
    except LineBotApiError as e:
        print(str(e))
```

監聽追蹤的`FollowEvent`是在點擊追蹤或取消封鎖時觸發，監聽取消追蹤的`UnFollowEvent`則是在封鎖時觸發，實作一個自訂的歡迎訊息來測試：
```python
@web_hook_handler.add(FollowEvent)
def follow(event):
    try:
        # Get follower name
        user_name = line_bot_api.get_profile(
            event.source.sender_id).display_name

        # Send welcome message
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(
                text="Hello, " + user_name + "\n Thanks for the following. \U001000A4"))
    except LineBotApiError as e:
        print(str(e))
```

再來，就是比較需要注意的監聽按鈕回傳值的`PostbackEvent`，這邊可利用剛剛的鸚鵡機器人傳送一個有 Button 且`action`的`type`為`postback`的 Flex Message 至聊天室中進行測試：
```python
contents = {
    "type": "bubble",
    "footer": {
        "type": "box", 
        "layout": "vertical",
        "contents": [
            {
                "type": "button", 
                "action": {
                    "type": "postback",
                    "label": "YOUR_BUTTON_TEXT", # 按鈕字串
                    "data": "YOUR_POST_BACK_DATA", # PostbackEvent 能取得的資料
                    "displayText": "YOUR_SEND_TEXT" # 按鈕點擊後所傳送之訊息
                }
            }
        ]
    }
}

line_bot_api.reply_message(event.reply_token, FlexSendMessage(alt_text='YOUR_ALT_TEXT', contents=contents))
```
::: tip
如果不清楚可以如何修改或新增刪減哪些欄位，可以將以上 Json 複製至 [Flex Message Simulator](https://developers.line.biz/flex-simulator/)。
:::

點擊剛剛所傳送之訊息的按鈕，就會觸發監聽按鈕回傳值的`PostbackEvent`，接下來就可以利用回傳資料來做後續使用：
```python
@web_hook_handler.add(PostbackEvent)
def post_back(event):
    try:
        if event.postback.data == 'YOUR_POST_BACK_DATA':
            # Do Something
    except LineBotApiError as e:
        print(str(e))
```


## 總結
此篇文章只有大略介紹了一下常用的 Messaging API，可再自行作延伸，例如：群發... 等 API。
詳細的資料可至 [line-bot-sdk-python](https://github.com/line/line-bot-sdk-python)，裡面有各個 API 及資料內容的詳細介紹，感謝您的閱讀。
