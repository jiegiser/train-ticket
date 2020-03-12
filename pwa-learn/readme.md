<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 17:45:40
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 17:56:13
 -->
## Notification API

在浏览器的控制台输入Notification.permission。可以查看浏览器的权限，如果是default，就是默认的没有授权也没有拒绝
进行用户授权：
```js
Notification.requestPermission().then(res => console.log(res))
// granted为允许
```
进行通知：
```js
// 第一个参数，通知的title，第二个是一个对象，消息的一些参数
new Notification('Hello', {body: 'this is from console'})
// 在service worker中通知：
self.registration.showNotification('Hello', {body: 'this is from console'})
```