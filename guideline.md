> [!NOTE]
> このドキュメントはAI（Claude）によって生成されました。内容に誤りが含まれる可能性があるため、適宜確認・修正してください。

## Duedleが叶えること
- ダークモードでMoodleを使いたい！(ダークモード機能)
- 課題・小テストの締め切りを一覧で確認したい！(タスクダッシュボード機能)
- コースページをNotion風のサイドバーで素早く移動したい！(コースナビゲーション機能)
- 不要なUI要素を非表示にしてスッキリ使いたい！(QoL改善機能)
- 最近見たページに素早くアクセスしたい！(閲覧履歴機能)

## Moodleに追加する機能
- ダークモード（ブラウザ設定と同期 / 強制ON / 強制OFF）
- タスクダッシュボード（課題・小テストの締め切り管理・フィルタリング）
- Notion風コースナビゲーション（セクションサイドバー・トップへ戻るリンク）
- コース表示順のカスタマイズ（ドラッグ&ドロップ）
- 非表示コースセクションの表示/非表示トグル
- ユーザー名・「マイコース」リンクの非表示
- ナビバーのブランディングカスタマイズ
- 閲覧履歴サイドバー（最大10件）
- ファイルのforce-downloadの削除（直接プレビュー可能に）

## 技術的な説明

### 概要
DuedleはChrome拡張機能（Manifest v3）として実装されており、名工大Moodle（`https://cms7.ict.nitech.ac.jp/moodle40a/`）に対してコンテントスクリプトを注入することで動作する。ビルドプロセスは不要で、`src/` ディレクトリをそのままChromeにロードして使用する。

### ディレクトリ構成
```
src/
├── manifest.json         # Chrome拡張機能の設定（Manifest v3）
├── common/               # 全ページ共通の機能（ユーザー名非表示、タイトル変更など）
├── dark_mode/            # ダークモード（main.js / main.css）
├── task/                 # タスクダッシュボード
│   ├── display/          # ダッシュボード表示ロジック
│   ├── assign/           # 課題データ取得（fetch.js）
│   └── quiz/             # 小テストデータ取得（fetch.js）
├── notionnav/            # Notion風ナビゲーション（navigation.js）
├── qol/                  # QoL改善（履歴、ファイル、ナビバーなど）
├── cource/               # コース表示順カスタマイズ
├── login_screen/         # ログインページカスタマイズ
├── syllabus/             # シラバスページ向けダークモード
└── lib/                  # 共通ユーティリティ（configManager.ts）
```

### データ永続化

**IndexedDB（タスクデータ）**

`assign_list` オブジェクトストア（キー: `assignId`）:
| フィールド | 内容 |
|---|---|
| assignId | 課題ID |
| courseName | コース名 |
| assignName | 課題名 |
| start / submit / due | 開始・提出・締め切り日時（タイムスタンプ） |
| file / filenum | 提出ファイル名・ファイル数 |
| status | `complete` / `incomplete` / `expired` |

`quiz_list` オブジェクトストア（キー: `quizId`）:
| フィールド | 内容 |
|---|---|
| quizId | 小テストID |
| courseName / quizName | コース名・小テスト名 |
| start / submit / due | 開始・提出・締め切り日時 |
| point / required / maxp | 得点・合格点・満点 |
| count / maxcount | 挑戦回数・最大挑戦回数 |
| status | `complete` / `qualify` / `incomplete` / `stuck` / `unknown` / `expired` |

**localStorage（ユーザー設定）**

| キー | 内容 |
|---|---|
| `darkmode` | 0=ブラウザ同期 / 1=ON / 2=OFF |
| `history` | 最近の閲覧ページ（最大10件の配列） |
| `selectedType` | タスクフィルター: 種別 |
| `selectedStatus` | タスクフィルター: ステータス |
| `selectedDue` | タスクフィルター: 締め切り期間 |
| `hide` | 非表示コースセクションの表示切替 |

### インストール方法
1. リポジトリをクローン
   ```bash
   git clone git@github.com:mtugb/duedle.git
   cd duedle
   npm install
   ```
2. `chrome://extensions/` を開き、デベロッパーモードを有効化
3. 「パッケージ化されていない拡張機能を読み込む」で `src/` ディレクトリを選択

### 開発時の注意
- ファイルを編集したら `chrome://extensions/` でリロードが必要
- コンテントスクリプトの注入先は `manifest.json` の `content_scripts` で管理
- 新機能は `src/` 配下に機能名ディレクトリを切って実装する
