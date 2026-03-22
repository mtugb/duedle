# とりあえずまとめだけ見たい人のために
1. なんか色々入れたよ。
1. 今後はJS, TSはsrc/内、それ以外はpublic/内に作ってね
1. chromeで読み込む前にnpm run buildが必要になったよ(devでもいい)
1. Typescriptが使えるようになったよ。manifest.jsonから指定する時は.tsを.jsに置き換えて書いてね
# NPMおよびESbuildについて
## 導入理由
- 今後の拡張のため
- Typescript導入のため
- lit-htmlを導入して、Javascript/Typescript内で快適にHTMLを扱えるようにするため。

[注意点]Npmパッケージは直接ブラウザが読み込めないのでEsbuildを使ってbuildします。

## 各自環境構築[追加]
必要なパッケージをインストール(最初の一度だけ実行)
```bash
npm i
```
保存したらすぐにビルドされるようにする。
Chrome側では拡張機能の**再読み込みが別途必要。**(毎度実行)
```bash
npm run dev
```

# ディレクトリ構成の変更について
Javascriptなどはこれまで通り``src/``以下に開発を行うけど、cssとか静的なファイル（javascriptみたいに読み込んだ後にいろいろ変更を加えることがないやつ）は、WEB開発の慣習に従い``public/``以下に入れることにしました。``npm run dev``もしくは``npm run build``のいずれかを実行することで、Chromeで読み込み可能な完成形がdist内に出来上がりまする。
