---
title: GitHub - 如何製作出令人印象深刻的 Profile
date: 2023-03-06
description: 今年打算好好規劃一個 Side Project，想說趁著這個機會，把相當於工程師門面的 **GitHub** 弄得漂亮點。
---

# {{ $frontmatter.title }}
這邊大致將 **GitHub Profile** 分成幾個部分，**Sample**、**Banner**、**標籤及圖案** 及 **狀態元件**。 


## Sample
一開始，在完全沒有任何一個想法的情況下，大量的瀏覽 **Sample** 絕對是一個正確的選擇，雖然高機率無法找到完美的解決方案，畢竟美感是主觀的，
但是，在尋找的過程中總會看到自己喜歡的某些部分，各自汲取下來，經過排版整理後，便極有可能做出能讓自己滿意的作品。

GitHub 上有一個 [Repository](https://github.com/abhisheknaiidu/awesome-github-profile-readme)，包含了各式各樣的 **Sample**，可以參考看看。
::: details 以下是我參考的 GitHub Profile & Generator
* [gautamkrishnar](https://github.com/gautamkrishnar)
* [DenverCoder1](https://github.com/DenverCoder1)
* [guilyx](https://github.com/guilyx)
* [GitHub Profile README Generator](https://rahuldkjain.github.io/gh-profile-readme-generator/)
* [Github Profilinator](https://github.com/rishavanand/github-profilinator)
:::


## Banner
進到 **GitHub Profile** 後，最開始注意到的一定會是 **Banner**，而這個部分必須獨具個人特色且能夠讓訪客對你有初步的了解，**SVG** 完全可以勝任上述的條件。

![Custom SVG](https://raw.githubusercontent.com/nikolalsvk/nikolalsvk/main/welcome.svg)
> 如何利用 **SVG** 製作一個有動畫效果且支援日夜模式的 **Banner**，可以參考[這篇文章](https://pragmaticpineapple.com/adding-custom-html-and-css-to-github-readme/)。

另一種方案是使用已集成好的工具，透過 **HTML** 的 `img` 標籤、**Markdown** 超連結等方式放進 `README.md` 中。

![Typing SVG](https://readme-typing-svg.demolab.com?font=PT+Mono&size=32&duration=3000&pause=1000&color=39FF14&center=true&vCenter=true&width=500&lines=I'm+Henry+Huang.;I'm+an+Android+developer.)
> 這是我選擇使用的 **SVG** 動畫，只需要利用 [readme-typing-svg](https://readme-typing-svg.demolab.com/demo/)，便可以快速做出屬於自己且具有打字效果的 **Banner**。


## 標籤及圖案
利用一些標籤及圖案為你的 **GitHub Profile** 來做說明或是點綴，像是編程語言就可以使用 [Simple Icons](https://simpleicons.org/) 來列舉；或是利用標籤 [Shields IO](https://shields.io/) 來表達各種狀態，如果上面的種類無法滿足你的需求，也有支援標籤的自定義。

不要被已集成的工具侷限了自己的想法，可以另外找喜歡或是需要的圖，像是贊助 Icon 加上網址超連結等，做一個自己的贊助牆，方法有很多種，可以自行變化。
<div align="center">
  <a href="https://www.buymeacoffee.com/henryhuang" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="buymeacoffee" />
  </a>
  <br>
  <a href="https://ko-fi.com/henryhuang" target="_blank">
    <img src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" height="50" width="210" alt="ko-if" />
  </a>
  <br>
</div>

這邊分享一個我有使用到的工具 - [GitHub profile visit counter](https://dev.to/ryanlanciaux/quick-github-profile-visit-counter-14en)，可以將瀏覽次數記錄並保存下來。


## 狀態元件
這邊依據使用的數據分成兩大類：**GitHub Stats** 跟 **WakaTime**。

**GitHub Stats** 是透過 **GitHub Open API** 來取得個人資料，再根據喜好選擇不同的工具，使用者只需提供 **GitHub User ID** 即可。

![github-readme-stats](https://github-readme-stats.vercel.app/api?username=henryhuang1219&hide=issues&show_icons=true&count_private=true&line_height=24&hide_border=true&title_color=39FF14&icon_color=39FF14&text_color=fff&bg_color=000)
> 這邊推薦使用 [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)，如果覺得太過單調，可以看看 [Metrics](https://github.com/lowlighter/metrics)。

**WakaTime** 則是結合了各種 IDE，提供 plugin 來記錄使用者的開發習慣，再透過 **GitHub workflows** 動態產生圖表，可利用排程來定期更新圖表資訊。

![Profile Readme Development Stats](https://user-images.githubusercontent.com/25841814/79395484-5081ae80-7fac-11ea-9e27-ac91472e31dd.png)
