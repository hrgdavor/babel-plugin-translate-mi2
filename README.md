# babel-plugin-translate-mi2 [![CircleCI](https://img.shields.io/circleci/project/hrgdavor/babel-plugin-translate-mi2.svg?maxAge=2592011)](https://circleci.com/gh/hrgdavor/babel-plugin-translate-mi2)

> Babel plugin for translations inside JSX text and attributes.

Combined with [babel-plugin-jsx-mi2](https://github.com/hrgdavor/babel-plugin-jsx-mi2)
and [babel-plugin-jsx-inject](https://github.com/hrgdavor/babel-plugin-jsx-inject)

Used in [mi2js](https://github.com/hrgdavor/mi2js) library.

### Translations inside JSX code in mi2js library

You want to write some templates in JSX

``` js
// state: {name:'Somebody', city: 'Mordor'}

proto.initTemplate = function(h,t,state){
  return <div>
    <div class="name"><b>[[name]]: </b>{state.name}</div>
    <div class="city"><b>[[city]]: </b>{state.city}</div>
  </div>
}

```

The JSX is tranformed to:

``` js
// state: {name:'Somebody', city: 'Mordor'}

proto.initTemplate = function(h,t,state){
  return <div>
    <div class="name"><b>{t('name')}: </b>{state.name}</div>
    <div class="city"><b>{t('city')}: </b>{state.city}</div>
  </div>
}
```

You could choose to write the code like this directly and then you do not need the plugin for the transformation.

