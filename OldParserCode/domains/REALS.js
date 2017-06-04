/**
 * Created by Eli on 04-Apr-17.
 */

/*
*
* REALS are floating point numbers (just numbers in Javascript)
*
* Operators on REALS:
*
* + : REALS X REALS -> REALS
* - : REALS X REALS -> REALS
* * : REALS X REALS -> REALS
* / : REALS X REALS -> REALS
* % : REALS X REALS -> REALS
* = : REALS X REALS -> BOOL
* < : REALS X REALS -> BOOL
* > : REALS X REALS -> BOOL
* <= : REALS X REALS -> BOOL
* >= : REALS X REALS -> BOOL
*
* */

var REALS = new Domain({name: "REALS", operators: [

    // addition, + : REALS X REALS -> REALS
    new Operator({
        name: "+",
        parameterTypes: ["REALS", "REALS"],
        returnType: "REALS"
    }),

    // subtraction, - : REALS X REALS -> REALS
    new Operator({
        name: "-",
        parameterTypes: ["REALS", "REALS"],
        returnType: "REALS"
    }),

    // multiplication, * : REALS X REALS -> REALS
    new Operator({
        name: "*",
        parameterTypes: ["REALS", "REALS"],
        returnType: "REALS"
    }),

    // division, / : REALS X REALS -> REALS
    new Operator({
        name: "/",
        parameterTypes: ["REALS", "REALS"],
        returnType: "REALS"
    }),

    // modulus, % : REALS X REALS -> REALS
    new Operator({
        name: "%",
        parameterTypes: ["REALS", "REALS"],
        returnType: "REALS"
    }),

    // equality, = : REALS X REALS -> BOOL
    new Operator({
        name: "=",
        parameterTypes: ["REALS", "REALS"],
        returnType: "BOOL"
    }),

    // less than, < : REALS X REALS -> BOOL
    new Operator({
        name: "<",
        parameterTypes: ["REALS", "REALS"],
        returnType: "BOOL"
    }),

    // greater than, > : REALS X REALS -> BOOL
    new Operator({
        name: ">",
        parameterTypes: ["REALS", "REALS"],
        returnType: "BOOL"
    }),

    // less than or equal, <= : REALS X REALS -> BOOL
    new Operator({
        name: "<=",
        parameterTypes: ["REALS", "REALS"],
        returnType: "BOOL"
    }),

    // greater than or equal, >= : REALS X REALS -> BOOL
    new Operator({
        name: ">=",
        parameterTypes: ["REALS", "REALS"],
        returnType: "BOOL"
    })

]});
