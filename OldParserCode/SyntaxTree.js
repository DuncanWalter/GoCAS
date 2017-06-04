/**
 * Created by Duncan on 5/16/2017.
 */


function mixin(obj){
    for(var prop in obj){
        // check for inherited properties
        if(obj.hasOwnProperty(prop)){
            // check for namespace collisions
            if(!this.hasOwnProperty(prop)){
                // accept the object's property as an override
                this[prop] = obj[prop];
            }
        }
    }
}






/*
A sorting comparator constructor for a total ordering of SyntaxTrees based on complexity
(OpChain)->(SyntaxTree, SyntaxTree)->int
*/
function Comparator(opChain){

    return function(a, b){
        if(!(a instanceof SyntaxTree && b instanceof SyntaxTree)){
            throw "SyntaxTree comparator called on non-SyntaxTree object"
        }






    }
}






function SyntaxTree(children){
    mixin.call(this, {
        // children: children,
        // childrenComplexityOrder: null,
        // complexity: undefined,
        // localDomain: null,
    });
}
mixin.call(SyntaxTree.prototype, {


    // () -> bool
    annotate: function(path){
        if(this.annotated){ return true; }
        var that = this;
        var flag = false;
        var _path = path || [];
        if(this.complextiy === undefined){
            // TODO how should this handle multiple domains and splitting opChains?
            flag = true;
        }
        this.children.forEach(function(child, index){
            _path.push(index);
            if(child.annotate(_path)){
                flag = true;
            };
            _path.pop();
        });
        if(this.abstraction === null){
            this.abstraction = children.reduce(function(accum, child){
                return accum || child.domain.abstractionOf(that);
            }, null);
            if(this.abstraction === null){ throw "No matching abstraction found in children's domains for: " + JSON.stringify(that); }
            this.domain = this.abstraction.domain;
            flag = true;
        }
        return flag;
    },

    // () -> bool
    simplify: function(){
        this.children.forEach(function(child){
            child.simplify();
        });





        // this.domain.normalize(this);
        // this.domain.order(this);
        // this.domain.

    }
});


