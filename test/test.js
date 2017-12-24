

<<<<<<< HEAD
describe('babel-plugin-translate-mi2', () => {
=======
describe('babel-plugin-jsx-mi2', () => {
  it('should contain text', () => {
    const vnode = render(h => <div>test</div>)
    expect(vnode.tag).toEqual('div')
    expect(vnode.children[0]).toEqual('test')
  })

  it('should spread attribs', () => {
    const sth = {name:'Joe'};
    const vnode = render(h => <div {...sth}>test</div>)
    
    expect(vnode.tag).toEqual('div')
    expect(vnode.children[0]).toEqual('test')
    expect(vnode.attr.name).toEqual('Joe')
  })
>>>>>>> ff0f54ae1b37d30143549a8a011b8da3572814b1

  // translation implementation
  var TRANS = {name:'Name', city:'City'};
  function t(code){ return TRANS[code] ||code;}

  it('should translate', () => {
    const vnode = render(h => <div city="[[city]]" city_name="[[city]] [[name]]">[[name]]: test</div>)
    
    expect(vnode.tag).toEqual('div')
    expect(vnode.children[0]).toEqual('Name')
    expect(vnode.children[1]).toEqual(': test')
    expect(vnode.attr.city).toEqual('City')
    expect(vnode.attr.city_name).toEqual('City Name')
  })

  function render(callback){
    return callback(createElement);
  }

  function createElement(tag, attr, ...children){
    return {tag, attr, children};
  }

})

