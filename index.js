/**
options:

reg [regex]- regular expression for brackets
func [string]- name of translation function(default: 't')
staticTranslation [boolean] - if translations will be evaluated immediately (instead of wrapped in arrow func)

*/

module.exports = function (babel) {
  var t = babel.types
  var bracketsReg = /\[\[([0-9a-zA-Z-_\.]+)\]\]/g;
 
  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      JSXAttribute: function(path, file){
        var text = path.node.value;
        if(t.isStringLiteral(text)){
          var arr = splitTextAttr(text.value, file.opts);
          
          if(arr.length){
            // handle multiple translations inside single attribute
            var expr = binaryExpressionMulti('+',arr);

            if(file.opts.staticTranslation) expr = wrapInRef(expr);

            path.node.value=t.jSXExpressionContainer(expr)
          }
        }
      },
      JSXText: function(path, file){
        var text = path.node.value;
        var arr = splitTextJsx(text, file.opts);

        if(arr.length){
          path.replaceWithMultiple(arr)
        }
      }
    }
  }
  
  /** wrap in $ref call to signal that this does not need to be wrapped in arrow function
   this way translation is fixed at initialization 
   */
  function wrapInRef(expr){
    return  t.callExpression(t.identifier('$ref'), [expr] );
  }

  function translationExpr(code, opts, exprFunc, staticTranslation){
    var func = t.callExpression(
      t.identifier(opts.func || 't'), 
      [t.stringLiteral(code)] 
    );
    if(staticTranslation) func = wrapInRef(func);
    if(exprFunc) func = exprFunc(func);
    return func
  }
  
  /** call splitText bu result creates multiple JSXText and JSXExpressionContainer
  */
  function splitTextJsx(text, opts){
    return splitText(text, opts, t.jSXText, t.JSXExpressionContainer, opts.staticTranslation);
  }

  /** call splitText and create array of StringLiteral or CallExpression that will
  later be combined into string concatenation expression
  */
  function splitTextAttr(text, opts){
    return splitText(text, opts, t.stringLiteral);
  }

  /** generate new nodes by replacing translation expressions to JSXExpression that call translate function
   [[code]] -> {t("code")}
  */
  function splitText(text, opts, textFunc, exprFunc, staticTranslation){
    var reg = new RegExp(opts.reg || bracketsReg);
    var ex;
    var offset = 0;
    var arr = [];
    while( (ex = reg.exec(text)) ){
      if(ex.index > offset){
        arr.push(textFunc(text.substring(offset, ex.index)));
      }
      arr.push(translationExpr(ex[1], opts, exprFunc, staticTranslation));
      offset = ex.index+ex[0].length
    }
    if(arr.length && offset<text.length){
      arr.push(textFunc(text.substring(offset, text.length)));
    }

    return arr;
  }

  /** chain of binary expressions with same operator
   common example when adding(+) multiple variables and strings
  */
  function binaryExpressionMulti(op,arr){
    var expr = arr[0];
    if(arr.length > 1){
      expr = t.binaryExpression(op,arr[0], arr[1]);
      for(var i=2; i<arr.length; i++){
        expr = t.binaryExpression(op,expr, arr[i])
      }
    }
  return expr;
  }
}
