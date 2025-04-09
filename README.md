# 暗記促進アプリ

忘却曲線に基づいて，いつ復習すれば良いかを教えてくれるアプリ．

## 開始手順
以下のコマンドをターミナルで実行し，必要なパッケージをインストールする．<br>
> $ pip install -r requirements.txt

app/frontapp内のindex.htmlを右クリックし，Open with Live Severを選択する．

以下のコマンドをターミナルで実行し，アプリを起動する．<br>
> $ python -m uvicorn main:app --reload

## 使い方
### 学習記録
「新しく登録する」ボタンを押下し，やったことの登録ページに遷移する．<br>
必要情報を記載し，「新規登録」ボタンを押下する．

### 今日復習する項目の確認
最初のページの「今日復習する項目」に記載されている．<br>
ただし，最初にアクセスしたときは表示されていないので，「新しく登録する」ボタンを押下し，その後戻ってくる必要がある．

## その他の機能
### データベースの初期化機能
これまで登録した項目を全て削除することができる．<br>
やり方は，appディレクトリで以下のコマンドを実行する．<br>
> $ python init_database.py<br>

最初はテスト項目がデータベースに格納されているので，このコマンドを実行することを推奨する．

## 参考文献
[Python FastAPI本格入門](https://www.amazon.co.jp/Python-FastAPI%E6%9C%AC%E6%A0%BC%E5%85%A5%E9%96%80-%E6%A8%B9%E4%B8%8B-%E9%9B%85%E7%AB%A0/dp/4297144476/ref=sr_1_2?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=12KLVRJMX26I6&dib=eyJ2IjoiMSJ9.pHwjVF-_sPZa6NIJbZC8Zm3niQM05GLqjzWGHrO_iGZ8ghjT6oKVevfe4KianmzS19hl_ABjUhHm_AbssHPhrjpckEN_kvtY8oGZUVmCIaqER502La5PxIN4Dx9-Hbjut5cr5Sqftvzoiz4Fq2gE9OgEXFuepFz2ir12HUdkd0qxYLAZqwh6LouVMPdlw1IoFrnWZTgBw4B7JU2nuXmOoziOr4YqurGImk5gwlciwrx69XnjG1K_mxCiCb8TSaPEZqMy-XYy9KGBlflueTekv03HPxI029GPpyACZrpmiSg.fPD-K08MoG0aZtHhYuaMolXoA-lM3sLMnkcjcloU3pc&dib_tag=se&keywords=Fastapi&qid=1744182496&sprefix=fastapi%2Caps%2C255&sr=8-2)


# 使用技術一覧

<img src="https://img.shields.io/badge/-SQLite-4479A1.svg?logo=sqlite&style=plastic">
<img src="https://img.shields.io/badge/-Javascript-F7DF1E.svg?logo=javascript&style=plastic">
<img src="https://img.shields.io/badge/-FastAPI-00BAFF.svg?logo=FastAPI&style=plastic">
<img src="https://img.shields.io/badge/-Python-3776AB.svg?logo=python&style=plastic">

