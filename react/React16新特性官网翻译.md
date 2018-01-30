# React16 新特性官网翻译
New core architecture

React 16 is the first version of React built on top of a new core architecture, codenamed “Fiber.” You can read all about this project over on Facebook’s engineering blog. (Spoiler: we rewrote React!)

Fiber is responsible for most of the new features in React 16, like error boundaries and fragments. Over the next few releases, you can expect more new features as we begin to unlock the full potential of React.

Perhaps the most exciting area we’re working on is async rendering—a strategy for cooperatively scheduling rendering work by periodically yielding execution to the browser. The upshot is that, with async rendering, apps are more responsive because React avoids blocking the main thread.

This demo provides an early peek at the types of problems async rendering can solve:

> Ever wonder what "async rendering" means? Here's a demo of how to coordinate an async React tree with non-React work https://t.co/3snoahB3uV pic.twitter.com/egQ988gBjR
> — Andrew Clark (@acdlite) September 18, 2017

Tip: Pay attention to the spinning black square.

We think async rendering is a big deal, and represents the future of React. To make migration to v16.0 as smooth as possible, we’re not enabling any async features yet, but we’re excited to start rolling them out in the coming months. Stay tuned!

新的核心体系结构

React16是第一个在一个新的核心体系结构上开发的版本，核心成为“Fiber”。你可以在Facebook的开发者博客中了解这个项目中的信息。（提示：我们重构了React！）

在React16中，Fiber包含了大部分新的特征，比如错误边界和碎片。在接下来几个版本中，你可以期待更多新的特征来释放React更大的潜力。

也许最让人激动的是我们开发的异步渲染：一个策略为了合作