# v1の使い方

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

## ロールの作成

```js
let role = await ncmb.Role.equalTo('roleName', 'Admin').fetch();
if (!role) {
  role = new ncmb.Role();
  await role
    .set('roleName', 'Admin')
    .addUser(user)
    .save();
}
```
