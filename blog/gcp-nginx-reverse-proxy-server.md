---
title: GCP - Nginx 反向代理
date: 2021-11-11
description: 原本是將 Server 架在實機上，由於在外租屋固定 IP 不好處理及電費因素考量下，決定改為使用 **GCP** 的 **Compute Engine**。 將架設過程中所使用到的指令及套件稍作整理記錄下來。
---

# {{ $frontmatter.title }}


## Google Cloud Platform
### 建立 Compute Engine
這裡依照 **Google Cloud Engine 免費方案** 的地區以及機器設定配置。
![Google Cloud Engine Free Program](https://i.imgur.com/ieqOxbj.png)

開機磁碟配置。
![開機磁碟](https://i.imgur.com/Mi42KpG.png)
::: warning
10 GB 在安裝完 [OneinStack](#oneinstack)，所剩的儲存空間會不足後續使用。
:::


### 設定 SSH
創建並取得 **SSH 公鑰**：
```shell
mkdir ~/.ssh
ssh-keygen -t rsa -f ~/.ssh/KEY_FILENAME -C USER_NAME -b 2048
cat ~/.ssh/KEY_FILENAME.pub
```
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAu5kKQCPF... cloudysanfrancisco
```

進入 **VM 詳細資訊**，點擊編輯，加入 **SSH 公鑰**。
![SSH](https://i.imgur.com/JCyCDwe.png)

測試 SSH 連線：
```shell
ssh -i ~/.ssh/KEY_FILENAME USER_NAME@EXTERNAL_IP
```


## Ubuntu
### 設定 root
避免執行某些命令時需要一直重複加上`sudo`的這個困擾，在開始前即可先初始化 root 的密碼：
```shell
sudo passwd root
```

切換至 root：
```shell
su -
```


## OneinStack
至 **OneinStack 官網** 選擇[自動安裝](https://oneinstack.com/auto/)，依照自己需求選擇預設配置，可再針對預設配置做進一步的編輯。
![OneinStack](https://i.imgur.com/Pun5v0w.png)

執行 OneinStack 所產生的命令，需等待約 1 個小時左右：
```shell
wget -c http://mirrors.linuxeye.com/oneinstack-full.tar.gz && tar xzf oneinstack-full.tar.gz && ./oneinstack/install.sh --nginx_option 1 --db_option 2 --dbinstallmethod 1 --dbrootpwd YOUR_ROOT_PASSWORD --reboot
```
::: warning
需在 **root** 權限下執行。
:::


## MySQL
查看 MySQL 服務狀態：
```shell
service mysql status
```
```
● mysqld.service - LSB: start and stop MySQL
   Loaded: loaded (/etc/init.d/mysqld; bad; vendor preset: enabled)
   Active: active (running) since Mon 2021-11-08 19:13:26 CST; 6 days ago
     Docs: man:systemd-sysv-generator(8)
     Tasks: 28
   Memory: 13.1M
     CPU: 5min 23.182s
   CGroup: /system.slice/mysqld.service
           ├─1838 /bin/sh /usr/local/mysql/bin/mysqld_safe --datadir=/data/mysql --pid-file=/data/mysql/mysql.pid
           └─2895 /usr/local/mysql/bin/mysqld --basedir=/usr/local/mysql --datadir=/data/mysql --plugin-dir=/usr/local/mysql/lib/plugin --user=mysql --log-error=/data/mysql/mysql-error.log --open-files-limit=65535 --pid-file=/data/mysql/mysql.pid
```

進入 MySQL CLI：
```shell
mysql -u root -p
```
```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 40
Server version: 5.7.36-log MySQL Community Server (GPL)
Copyright (c) 2000, 2021, Oracle and/or its affiliates.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
MySQL [(none)]>
```

創建 Database：
```shell
CREATE DATABASE DATABASE_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

這時就可以利用前面所提到的 [SSH](#設定-ssh) 來連線資料庫。
::: tip
推薦使用 [DataGrip](https://www.jetbrains.com/datagrip/)，使用方式這邊不多贅述。
:::


## Django Server
::: tip
應用配置在 [Django - WhatToEat](https://github.com/henryhuang1219/Django-WhatToEat) 裡有詳細敘述，記得運行服務前需使用 **screen**。
:::


## JDK
### 上傳 JDK
下載 [JDK 1.8](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)，選擇 **Linux x64 Compressed Archive**。
使用 SCP 將檔案上傳至 GCP：
```shell
scp -i ~/.ssh/KEY_FILENAME ~/Downloads/jdk-8u301-linux-x64.tar.gz USER_NAME@EXTERNAL_IP:~
```


### JDK 配置
解壓縮 tar.gz：
```shell
tar -zxvf jdk-8u301-linux-x64.tar.gz
```

移動 JDK 資料夾至 `/usr/local/jdk/` 之下：
```shell
mkdir /usr/local/jdk
mv jdk1.8.0_301 /usr/local/jdk/
```

新增捷徑目錄：
```shell
cd /usr/local/
ln -s jdk/jdk1.8.0_301/ java
```
::: tip
之後 JDK 更版只要把 java 捷徑指向不同路徑即可，不再需要去調整環境變數。
:::

加入環境變數設定：
```shell
vim /etc/profile
```
```
...

export JAVA_HOME=/usr/local/java
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
export CLASSPATH=$CLASSPATH:.:$JAVA_HOME/lib:$JRE_HOME/lib
```

查看 Java 版本：
```shell
java -version
```
```
java version "1.8.0_202"
Java(TM) SE Runtime Environment (build 1.8.0_202-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b08, mixed mode)
```


## Ktor Server
::: tip
應用配置在 [Ktor - WhatToEat](https://github.com/henryhuang1219/Ktor-WhatToEat) 裡有詳細敘述，記得運行服務前需使用 **screen**。
:::


## Nginx
查看 Nginx 服務狀態：
```shell
service nginx status
```
```
● nginx.service - nginx - high performance web server
  Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
  Active: active (running) since Wed 2021-11-10 14:59:11 CST; 5 days ago
    Docs: http://nginx.org/en/docs/
  Main PID: 21706 (nginx)
    Tasks: 3
  Memory: 4.4M
    CPU: 3.595s
    CGroup: /system.slice/nginx.service
           ├─21706 nginx: master process /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.con
           ├─21711 nginx: worker process                                          
           └─21712 nginx: worker process                                          
Nov 10 14:59:11 what-to-eat systemd[1]: Starting nginx - high performance web server...
Nov 10 14:59:11 what-to-eat nginx[21681]: nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
Nov 10 14:59:11 what-to-eat nginx[21681]: nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
Nov 10 14:59:11 what-to-eat systemd[1]: Started nginx - high performance web server.
```


### 創建 Virtual Host
確認 Nginx 正常運行後，便可在 <http://EXTERNAL_IP/###vhost> 網頁中查看教學。
::: warning
新增完 Virtual Host 的域名後，記得去設定對應的 **CNAME**。
:::


### 設定 Reverse Proxy
修改 Virtual Host 的設定檔：
```shell
vim /usr/local/nginx/conf/vhost/DOMAIN_NAME.conf
```
```vim{4,11}
server {
  listen 80;
  listen [::]:80;
  server_name DOMAIN_NAME;
  access_log off;
  
  location ~ /(\.user\.ini|\.ht|\.git|\.svn|\.project|LICENSE|README\.md) {
    deny all;
  }
  location ~ {
    proxy_pass http://127.0.0.1:SERVER_PORT_NUMBER;
  }
}
```
::: tip
SERVER_PORT_NUMBER 即是所架設服務的 Port 號。 
例如：Django 預設為 8000，根據專案配置設定 Port 號。
:::

更改完成後，重新啟動 Nginx：
```shell
service nginx restart
```


## 參考
[Ubuntu 18.04 LTS+Apache+Django](https://a35205905.github.io/2020/07/20/Ubuntu-18-04-LTS-Apache-Django/)<br>
[Google Cloud Free Program](https://cloud.google.com/free/docs/gcp-free-tier/#compute)<br>
[Connecting using third-party tools](https://cloud.google.com/compute/docs/instances/connecting-advanced#thirdpartytools)<br>
[Create an SSH key pair](https://cloud.google.com/compute/docs/connect/create-ssh-keys#create_an_ssh_key_pair)<br>
[Transfer files using SCP on Linux and macOS workstations](https://cloud.google.com/compute/docs/instances/transfer-files#scp)<br>
[OneinStack](https://oneinstack.com/)<br>
[Linux 安裝 JDK 開發環境](https://ithelp.ithome.com.tw/articles/10210961)<br>
