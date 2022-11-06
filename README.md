# marunage

marunage は YAMLファイルに羅列したコマンドをSSH先で実行します。
Ansibleを使うほどではないが自動化したい作業があるときに使えるかもしれません。

## How to Setup

```
git clone https://github.com/kushimoto/marunage
cd marunage
npm install
npm run electron-build
```

dist フォルダが作成されますので、中にある exe ファイルを実行して下さい。
ソフトウェアのインストールが開始されます。

## How to Use

下記のフォーマットで実行したいコマンドを羅列して、アプリケーション側で実行して下さい。

```yaml
commands:
  - uname -a
  - sleep 5
  - 'false'
```