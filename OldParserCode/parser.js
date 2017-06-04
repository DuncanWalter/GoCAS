/**
 * Created by Duncan on 4/3/2017.
 */

var rawTemplates = [    // In order of precedence, the types of syntax tokens we accept are:
    "(@\\{[\\d]+})(.*)\\1", // parenthesis-enclosed chunk
    "[A-Za-z][\\w]*",   // variable names
    "[\\d]+\\.?[\\d]*", // digit strings (numerals)
    "<[\\w\\-]+>",      // angle-bracketed named operators
    "[*+\\-/=&|\\^]"    // single special-character operators
];
var test = /(@\{[\d]+}).*\1/;
var scope = /\(([^()]*)\)/;
var templates = rawTemplates.map(function(raw){
    return new RegExp("^"+raw+"$");
});
var tokenizer = new RegExp(rawTemplates.reduce(function(acc, raw){
    return acc + "|" + raw;
}), 'g');
var operations = {
    "+":{op:function(a, b){return a + b}, ord: 1.1},
    "-":{op:function(a, b){return b - a}, ord: 1.0},
    "*":{op:function(a, b){return a * b}, ord: 1.3},
    "/":{op:function(a, b){return b / a}, ord: 1.2},
    "=":{op:function(a, b) {return a === b}, ord: 0.9}
};
function hasPrecedent(a, b){
    if(operations[a] && operations[b]){
        return operations[a].ord > operations[b].ord;
    } else {
        return !operations[a];
    }
}
exports.toPostfix = function(input){
    if(!input || input === '')return[];
    // console.log("converting " + input + " to postfix");
    // first, we have to disambiguate all parenthesis
    var _input = input;
    var id = 1;
    while (scope.test(_input)){
        _input = _input.replace(scope, "@{"+id+"}" + "$1" + "@{"+id+"}");
        id++;
    }
    // console.log(_input);
    var stack = [];
    var postfix = [];
    _input.match(tokenizer).forEach(function(token){
        for(var i = 0; i < templates.length; i++){
            if(templates[i].test(token)){
                switch(i){
                    case 0:
                        postfix.push(exports.toPostfix(token.match(templates[i])[2]));
                        break;
                    case 1:
                        postfix.push(token);
                        break;
                    case 2:
                        postfix.push(token);
                        break;
                    case 3:
                    case 4:
                        while(stack.length > 0){
                            var o = stack.pop();
                            if (hasPrecedent(token, o)) {
                                stack.push(o);
                                break;
                            } else {
                                postfix.push(o);
                            }
                        }
                        stack.push(token);
                        break;
                }
                break;
            }
        }
    });
    while(stack.length > 0){
        postfix.push(stack.pop());
    }
    // console.log(postfix);
    return postfix;
};
exports.valueOf = function(input){
    if (typeof input === typeof "") console.log("evaluating " + input);
    var postfix = (typeof input === typeof "") ? exports.toPostfix(input) : input;
    // console.log("showing postfix step: " + postfix);
    var stack = [];
    postfix.forEach(function(token){
        switch(true){
            case typeof token === typeof 0:
                stack.push(token);
                break;
            case typeof token === typeof stack:
                stack.push(exports.valueOf(token));
                break;
            case typeof token === typeof '':
                stack.push(operations[token].op(stack.pop(), stack.pop()));
                break;
            default:
                throw "you done messed up cowboy";
                break;
        }
    });
    return (stack.length === 1) ? stack[0] : stack;
};
exports.getSettings = function(selector){
    for(var i = 0; i < templates.length; i++) {
        if (templates[i].test(selector)) {
            switch (i) {
                case 0:
                    throw "there are no setting descriptions for postfix chunks";
                case 1:
                    return {
                        selector: selector,
                        type: undefined,
                        numChildren: 0,
                        value: undefined,
                        toString: function(){
                            return selector;
                        }
                    };
                case 2:
                    return {
                        selector: undefined,
                        type: "REAL_NUMBER",
                        numChildren: 0,
                        value: parseFloat(selector),
                        toString: function(){
                            return this.value;
                        }
                    };
                case 3:
                    return {
                        selector: selector,
                        type: undefined,
                        numChildren: undefined,
                        value: undefined,
                        toString: function(){
                            return selector + "(" + this.children.reduce(function(acc, child){
                                return acc + ", " + child.toString();
                            }) + ")";
                        }
                    };
                case 4:
                    return {
                        selector: selector,
                        type: undefined,
                        numChildren: 2,
                        value: undefined,
                        toString: function(){
                            return "("+this.children[0].toString()+" "+this.selector+" "+this.children[1].toString()+")";
                        }
                    };
                default:
                    throw "you done messed up";
            }
        }
    }
};
