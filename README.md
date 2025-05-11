# 挨拶タイマー for わんコメ

挨拶と有料チャットで残り時間が増えるタイマーです。

## 対応するチャット

- YoutubeとTwitchのチャットによる挨拶
- Youtubeのスーパーチャットとメンバーシップギフト
  - 日本円のみ対応

## 制限事項

わんコメを再起動するとタイマーのカウント、重複回避機能(挨拶をした人の記録、スパチャの記録)がリセットされます。

## 導入方法

1. [Release](https://github.com/mosamosa/greeting-timer-onecomme/releases) ページから `greeting-timer.zip` をダウンロードします
2. ZIPファイルを展開します
3. わんコメのプラグインフォルダに `plugins` フォルダの中の `greeting-timer` フォルダを設置します
4. わんコメの**カスタム**テンプレートフォルダに `templates` フォルダの中の `greeting-timer` フォルダを設置します
5. わんコメを再起動し、プラグイン画面で本プラグイン有効化します
6. [設定ページ](http://127.0.0.1:11180/plugins/mosamosa.greeting-timer/index.html) にアクセスして設定します
7. テンプレートをOBSにドラッグアンドドロップします
8. OBSで本テンプレートのプロパティを開いて幅`1000`、高さ`220`のように横長に設定します

## 文字色を変更する方法

OBSで本テンプレートのプロパティを開いてカスタムCSSに以下を貼り付けてください。

```css
.timer { color: #000000; -webkit-text-stroke-color: #ffffff; }
```

## ビルド方法 (開発者向け)

```bash
$ npm install
$ npm run build
```
