# rlist-view


## install

```shell
npm i @gitpad/rlist-view
```

## props

* height: height of your view, can be any valid height in css
* refresh: A function that return a promise to tell me you have loaded new data(I will hide your refresh component when promise resolved)
* loadMore: A function that return a promise to tell me you have loaded new data(I will hide your loadMore component when promise resolved)
* refreshComponent: Customed refresh component, discover more in my example code
* loadMoreComponent: Customed loadMore component, discover more in my example code
* threshold to start loadMore, it's (10px) by default
* useWindowScroll: use the y position of window scrollbar to calculate load more behavior
* disableInfiniteScroll: close load more feature, when you have loaded all data, you should set this prop to true
* disableRefresh: close refresh data feature

## [Who used rlist-view](docs/who-used.md) ?


[![股多多](docs/images/gdd/logo.jpg)](https://itunes.apple.com/cn/app/%E8%82%A1%E5%A4%9A%E5%A4%9A/id1219179966?mt=8)
