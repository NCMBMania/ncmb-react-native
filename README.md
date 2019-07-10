# React Native SDK for NCMB（ニフクラ mobile backend）

## インストール

```
npm i ncmb-react-native -S
```

## 使い方

### 読み込み

```javascript
import NCMB from 'ncmb-react-native';
```

### 初期化

```javascript
import config from './config.json';
const ncmb = new NCMB(config.applicationKey, config.clientKey);
```

### データ保存

```js
const Hello = ncmb.DataStore('Hello');
const hello = new Hello();
try {
  await hello
    .set('message', 'Hello world')
    .save();
  console.log(hello.get('createDate'));
} catch (e) {
  console.log(e);
}
```

