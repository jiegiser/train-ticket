/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 15:16:05
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 16:51:09
 */
// 不能访问dom、不能访问windows、localstorge等对象

const CACHE_NAME = 'cache-v1'

// 监听事件--声明周期、
// 一个新的server worker脚本被安装之后触发-内容变化就会被监听
self.addEventListener('install', event => {
  console.log(event)
  // event.waitUntil会推迟activate的执行
  // skipWaiting是强制停止旧的service worker，执行新的文件
  // event.waitUntil(self.skipWaiting())

  // 设置缓存空间-打开一个缓存空间
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    // 写入缓存
    // []为资源的路径
    cache.addAll([
      '/',
      './index.css'
    ])
  }))
})
// 表示当前的事件正在被启用
self.addEventListener('activate', event => {
  console.log(event)
  // 页面首次加载的时候所有页面都被service worker控制
  // event.waitUntil(self.clients.claim())

  // 得到缓存的所有的名字--进行判断，如果缓存名跟现在缓存的不相等，删除之前缓存的重新缓存
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        return caches.delete(CACHE_NAME)
      }
    }))
  }))
})
// 捕获资源请求的事件
self.addEventListener('fetch', event => {
  console.log(event)
  // 使用缓存
  // 捕获html、css等的所有请求，在cache中查询，如果查到结果进行返回，否则发生网络请求获取
  event.respondWith(caches.open(CACHE_NAME).then(cache => {
    return cache.match(event.request).then(response => {
      if(response) {
        return response
      }
      return fetch(event.request).then(response => {
        // 写入缓存
        cache.put(event.request, response.clone())
        return response
      })
    })
  }))
})