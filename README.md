# React Native SDK for NCMB（ニフクラ mobile backend）

ニフクラ mobile backendをReact Nativeから操作するためのSDKです。詳細な使い方は[ブログ](https://blog.mbaas.nifcloud.com/archive/category/ReactNativeSDK)でもご覧いただけます。

v2から大幅に利用法が変わっています。[v1のREADMEはこちら](./README.v1.md)。

## インストール

```
npm i ncmb-react-native -S
```

## 使い方

### 読み込み

必要なものを取得してください。

```javascript
import NCMB, { NCMBUser, NCMBObject, NCMBQuery, 
  NCMBFile, NCMBAcl, NCMBRole, 
  NCMBRequest, NCMBRelation, NCMBGeoPoint, 
  NCMBInstallation, NCMBPush } from 'ncmb-react-native';
```

- NCMBUser（会員管理）
- NCMBObject（データストア。保存、更新、削除）
- NCMBQuery（データストア。検索、取得）
- NCMBFile（ファイルストア）
- NCMBAcl（権限管理）
- NCMBRole（ロール、ユーザやロールのグルーピング）
- NCMBRequest（NCMBへのリクエスト用。通常は利用しません）
- NCMBRelation（データストアのリレーション）
- NCMBGeoPoint（位置情報）
- NCMBInstallation（デバイストークン）
- NCMBPush（プッシュ通知）

### 初期化

```javascript
const applicationKey = 'YOUR_APPLICATION_KEY';
const clientKey = 'YOUR_CLIENT_KEY';
new NCMB(applicationKey, clientKey);
```

### データストア

#### データ保存

```js
const obj = new NCMBObject('Test');
await obj
  .set('message', 'Hello, world')
  .save();
```

##### データ型

```js
const obj = new NCMBObject('Test');
await obj
  .set('message', 'Hello, world')
  .set('number', 500)
  .set('date', new Date)
  .set('object', {a: 'b', c: 'd'})
  .set('array', [1, 2, 3, 'test'])
  .save();
```

#### データ更新

```js
const obj = new NCMBObject('Test');
await obj
  .set('message', 'Hello, world')
  .save();
await obj
  .set('message', 'Hello, again')
  .save();
```

#### データ取得

```js
obj2.set('objectId', 'OBJECT_ID');
await obj2.fetch();
```

#### インクリメント

```js
const obj = new NCMBObject('Test');
await obj
  .set('num', 1)
  .save();
await obj.setIncrement('num', 1).save();
await obj.fetch();
obj.get('num') // -> 2
```

#### 配列操作

##### 追加

```js
const obj = new NCMBObject('Test');
await obj
  .set('ary', ['first'])
  .save();
await obj
  .add('ary', 'second')
  .save();
await obj.fetch();
obj.get('ary')) // -> ['first', 'second']
```

##### 削除

```js
const obj = new NCMBObject('Test');
await obj
  .set('ary', ['first', 'second'])
  .save();
await obj
  .remove('ary', 'second')
  .save();
await obj.fetch();
obj.get('ary') // -> ['first']
```

##### 追加（ユニーク）

```js
const obj = new NCMBObject('Test');
await obj
  .set('ary', ['first', 'second'])
  .save();
await obj
  .addUnique('ary', ['second', 'third'])
  .save();
await obj.fetch();
obj.get('ary') // => ['first', 'second', 'third']
```

#### データ削除

```js
await obj.delete();
```

#### 位置情報

```js
const obj = new NCMBObject('Test');
const geo = new NCMBGeoPoint(30.0, 130.0);
await obj
  .set('geo', geo)
  .save();
```

### クエリー

#### 通常

```js
const query = new NCMBQuery('Test');
const ary = await query.fetchAll();
```

#### 利用できるオペランド

- equalTo(name: string, value: any): NCMBQuery
- notEqualTo(name: string, value: any): NCMBQuery
- greaterThan(name: string, value: any): NCMBQuery
- greaterThanOrEqualTo(name: string, value: any): NCMBQuery
- lessThan(name: string, value: any): NCMBQuery
- lessThanOrEqualTo(name: string, value: any): NCMBQuery
- in(name: string, value: any): NCMBQuery
- notIn(name: string, value: any): NCMBQuery
- exists(name: string): NCMBQuery
- notExists(name: string): NCMBQuery
- inArray(name: string, value: any): NCMBQuery
- notInArray(name: string, value: any): NCMBQuery
- allInArray(name: string, value: any): NCMBQuery
- regularExpressionTo(name: string, value: RegExp): NCMBQuery
- near(name: string, geo: NCMBGeoPoint): NCMBQuery
- withinKilometers(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery
- withinMiles(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery
- withinRadians(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery
- withinSquare(name: string, southWestGeo: NCMBGeoPoint, northEastGeo: NCMBGeoPoint): NCMBQuery

#### そのほかのパラメータ

- limit(value: number): NCMBQuery {
- skip(value: number): NCMBQuery {
- order(name: string, desc: boolean = false): NCMBQuery {
- include(name: string): NCMBQuery {

#### 件数取得

```js
const query = new NCMBQuery('Test');
const {count, results} = await query.count().fetchWithCount();
```

#### OR検索

```js
const query = new NCMBQuery('Test');

const query1 = new NCMBQuery('Test');
const query2 = new NCMBQuery('Test');
query1.equalTo('number', 0);
query2.equalTo('number', 2);

const ary = await query.or([query1, query2]).fetchAll();
```

#### サブクエリー

```js
const queryTest = new NCMBQuery('Test');
const queryTest2 = new NCMBQuery('Test2');
queryTest2.in('num', [1,4]);
const ary = await queryTest
  .select('number', 'num', queryTest2)
  .fetchAll();
```

#### サブクエリー（オブジェクト）

```js
const queryTest = new NCMBQuery('Test');
const queryTest2 = new NCMBQuery('Test2');
queryTest.in('number', [1,4]);
const ary3 = await queryTest2
  .inQuery('num', queryTest)
  .include('num')
  .fetchAll();
```

#### 位置情報

##### 付近検索

```js
const tokyoTower = new NCMBGeoPoint(35.6585805, 139.7454329);
const query = new NCMBQuery('Station');
const ary = await query
  .withinKilometers('geo', tokyoTower, 2)
  .fetchAll();
```

##### ボックス検索

```js
const geo1 = new NCMBGeoPoint(35.6622568, 139.7148997);
const geo2 = new NCMBGeoPoint(35.6206607, 139.7049691);
const query = new NCMBQuery('Station');
const ary = await query
  .withinSquare('geo', geo1, geo2)
  .fetchAll();
```

### リレーション

#### 作成

```js
const item1 = new NCMBObject('Test');
await item1.set('message', 'Hello, world from item1').save();
const item2 = new NCMBObject('Test');
await item2.set('message', 'Hello, world from item2').save();

const relation = new NCMBRelation('Test');
relation.add(item1).add(item2);

const mainObj = new NCMBObject('Main');
await mainObj.set('relation', relation).save();
```

#### 取得

```js
const query = new NCMBQuery('Test');
const ary = await query
  .relatedTo(mainObj, 'relation')
  .fetchAll();
```

#### 削除

```js
const relation = new NCMBRelation('Test');
relation.remove(item1);
await mainObj
  .set('relation', relation)
  .save();
```




### ロール

#### 作成

```js
const role = new NCMBRole;
role
  .set('roleName', 'admin');
await role.save();
```

#### 削除

```js
await role.delete();
```

#### ユーザ追加

```js
await role.addUser(user).save();
```

#### 所属ユーザ取得

```js
const query = NCMBRole.query();
const role2 = await (query
  .equalTo('roleName', roleName)
  .fetch()) as NCMBRole;
const users = await role2.fetchUser();
```

#### 検索

```js
const query = NCMBRole.query();
const role2 = await (query
  .equalTo('roleName', roleName)
  .fetch()) as NCMBRole;
```

#### 子ロール追加

```js
await role
  .addRole(role2)
  .save();
```

#### 子ロール取得

```js
const query = NCMBRole.query();
const role = await (query
  .equalTo('roleName', roleName)
  .fetch()) as NCMBRole;
const roles = await role
  .fetchRole();
```

### 会員管理

#### ユーザ登録（ID、パスワード）

```js
const user = new NCMBUser;
user
  .set('userName', 'tester')
  .set('password', 'tester');
await user.signUpByAccount();
```

#### ユーザ削除

```js
await user.delete();
```

#### ログアウト

```js
NCMBUser.logout();
```

#### ユーザ登録メール送信

```js
await NCMBUser
  .requestSignUpEmail(`test@example.com`);
```

#### ログイン

```js
const user = await NCMBUser
  .login('tester', 'tester');
```

#### ログイン（メールアドレス）

```js
const user = await NCMBUser
  .loginWithMailAddress(config.test.emailAddress, config.test.password);
```

#### 永続化

LocalStrage系のインタフェースを持ったライブラリ、オブジェクトが利用できます。

```js
ncmb.storage = LocalStorage;
```

想定

- LocalStorage (for web)
- @react-native-async-storage/async-storage

復元する場合

```js
const user = await NCMBUser.currentUser();
```

#### 匿名ログイン

```js
const user = await NCMBUser.loginAsAnonymous();
```

#### ソーシャルログイン

```js
NCMBUser.signUpWith(provider: string, authData: authData)
```

- [Facebook](https://mbaas.nifcloud.com/doc/current/rest/user/userRegistration.html#Facebook%E8%AA%8D%E8%A8%BC%E6%83%85%E5%A0%B1%EF%BC%88%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF%E5%90%8D%EF%BC%9Afacebook%EF%BC%89)
- [Twitter](https://mbaas.nifcloud.com/doc/current/rest/user/userRegistration.html#Twitter%E8%AA%8D%E8%A8%BC%E6%83%85%E5%A0%B1%EF%BC%88%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF%E5%90%8D%EF%BC%9Atwitter%EF%BC%89)
- [Google](https://mbaas.nifcloud.com/doc/current/rest/user/userRegistration.html#%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%EF%BC%88Google%E8%AA%8D%E8%A8%BC%EF%BC%89)
- [Apple](https://mbaas.nifcloud.com/doc/current/rest/user/userRegistration.html#%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%EF%BC%88Apple%E8%AA%8D%E8%A8%BC%EF%BC%89)

が公式対応しています。必要なパラメータ `authData` は公式ドキュメント（リンク先）を参照してください。

### ファイルストア


#### アップロード（テキストファイル）

```js
const fileName = 'test.csv';
const file = await NCMBFile.upload(fileName, '1,2,3');
```

#### アップロード（バイナリファイル）

```js
const fileName = 'test.jpg';
const blob = await promisify(fs.readFile)(`./test/${fileName}`);
const file = await NCMBFile.upload(fileName, blob);
```

#### ファイル削除

```js
await file.delete();
```

#### ファイルダウンロード（テキストファイル）

```js
const download = await file.download();
```

#### ファイルダウンロード（バイナリファイル）

```js
const download = await file.download('binary');
download.type // -> eg. image/jpeg
```

#### ファイルダウンロード（DataURI）

```js
const download = await file.download('datauri');
```

#### ファイル取得

```js
const query = NCMBFile.query();
const files = await query.fetchAll();
// 検索
const files2 = await query.regularExpressionTo('fileName', /^.*?\.txt/).fetchAll();
const files3 = await query.greaterThan('fileSize', 8).fetchAll();
```

#### ファイルアップロード（ACL付き）

```js
const acl = new NCMBAcl;
acl
  .setPublicReadAccess(false)
  .setUserWriteAccess(loginUser, true)
  .setUserReadAccess(loginUser, true);
const text = '1,2,3';
const fileName = 'acl2.csv';
const file = await NCMBFile.upload(fileName, text, acl);
```

### デバイストークン

#### 登録

```js
const installation = new NCMBInstallation;
await installation
  .set('deviceToken', 'aaa')
  .set('deviceType', 'ios')
  .save();
```

#### 更新

```js
const installation = new NCMBInstallation;
await installation
  .set('deviceToken', 'aaa')
  .set('deviceType', 'ios')
  .set('message', 'Hi!')
  .save();
await installation
  .set('message', 'Hello')
  .save();
```

#### 取得

```js
await installation.fetch();
```

#### 削除

```js
await installation.delete();
```

#### 検索

```js
const query = NCMBInstallation.query();
const ary = await query
  .fetchAll();
```

### プッシュ通知

#### 登録

```js
const push = new NCMBPush;
await push
  .set('immediateDeliveryFlag', true)
  .set('target', ['ios'])
  .save();
```

#### 取得

```js
await push.fetch();
```

#### 更新

```js
const push = new NCMBPush;
await push
  .set('immediateDeliveryFlag', true)
  .set('message', 'Hello')
  .set('target', ['ios'])
  .save();
await push
  .set('message', 'Hello, again')
  .save();
```

#### 配信条件の設定

```js
const query = NCMBPush.query();
query
  .equalTo('objectId', 'aaa');
const push = new NCMBPush;
await push
  .set('immediateDeliveryFlag', true)
  .set('message', 'Hello')
  .set('searchCondition', query)
  .set('target', ['ios'])
  .save();
```

#### 削除

```js
await push.delete());
```

### License

MIT.
