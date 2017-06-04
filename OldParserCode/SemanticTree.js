/**
 * Created by Duncan on 4/3/2017.
 */
var parser = require("src/parser");
/*
SemanticTree :: (?) -> {
    children : SemanticTree[],
    selector : string,
}
*/
module.exports = function SemanticTree(postfix, parent){
    this.selector = postfix.pop();
    if(typeof this.selector === typeof postfix){
        var node = new module.exports(this.selector, parent);
        if (this.selector.length !== 0) throw "what are you trying to do?";
        for(var prop in node){
            if(node.hasOwnProperty(prop)){
                this[prop] = node[prop];
            }
        }
    } else {
        this.parent = parent;
        var settings = parser.getSettings(this.selector);
        this.type = settings.type;
        this.value = settings.value;
        this.selector = settings.selector;
        this.toString = settings.toString;
        this.children = [];
        if(!(settings.numChildren === undefined)){
            for(var i = 0; i < settings.numChildren; i++){
                this.children.splice(0, 0, new module.exports(postfix, this));
            }
        } else {
            var peek = postfix.pop();
            if(typeof peek === typeof postfix){
                while(peek.length > 0){
                    this.children.splice(0, 0, new module.exports(peek, this));
                }
            } else {
                postfix.push(peek);
                this.children.push(new module.exports(postfix, this));
            }
        }
    }
};