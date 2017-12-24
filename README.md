# babel-plugin-translate-mi2 [![CircleCI](https://img.shields.io/circleci/project/hrgdavor/babel-plugin-translate-mi2.svg?maxAge=2592011)](https://circleci.com/gh/hrgdavor/babel-plugin-translate-mi2)

> Babel plugin for translation for [mi2js](https://github.com/hrgdavor/mi2js) library.

Combined with [babel-plugin-translate-mi2](https://github.com/hrgdavor/babel-plugin-translate-mi2)

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

The JSX is tranformed to function calls and then the code looks like this

``` js

proto.initTemplate = function(h,t,state){
  return h('div', null,
    h('div', {'class':'name'}, h('b', null, t('name')+': '), ()=>person.name),
    h('div', {'class':'city'}, h('b', null, t('city')+': '), ()=>person.city),
  )
}

```

the function `t` return translations for the translation code provided

the function `h` is implemented in such way that these calls to `h` result in `def` being: 

```js
{
  "tag": "div",
  "attr": null,
  "children": [
    {
      "tag": "div",
      "attr": { "class": "name" },
      "children": [
        { "tag": "b", "attr": null,  "children": [ "Name: " ] },
        ()=>person.name
      ]
    },
    {
      "tag": "div",
      "attr": { "class": "city" },
      "children": [
        { "tag": "b", "attr": null,  "children": [ "City: " ] },
        ()=>person.city
      ]
    }
  ]
}
```

the library will use returned structure and call `mi2js.insertHtml` function to generate(eventually) HTML based on data structured like that
so the final result in HTML is:

```html
<div>
  <div class="name"><b>Name: </b>Somebody</div>
  <div class="city"><b>City: </b>Mordor</div>
</div>
```

quick explanation: the JS expressions are wrapped in arrow function so they can be reevaluated later when state changes
(for more details check the explanation in the library).