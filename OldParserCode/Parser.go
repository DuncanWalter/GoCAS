package Parser

import (
	"regexp"
	"GoTryStuff/Utils"
	"fmt"
)

// Representation wrapper for strings
type Input string;



// TODO overhaul this to utilize an enrichment step. This step should make a string easily parsable into LateX or trees


var tokenizer, templates = (func () (*regexp.Regexp, *[]*regexp.Regexp) {

	var rawTokenTemplates = []string{   // In order of precedence, the types of syntax tokens we accept are:
		"(\\([^()]+\\))",               // parenthesis-enclosed chunk
		"([_A-Za-z][\\w]*)",            // variable names
		"([\\d]+)",                     // digit strings (numerals)
		"(<[\\w]+>)",                   // angle-bracketed named operators
		"([*+-/^.%$#@!&|?`~=<>])",      // single special-character operators
	};

	var selector = rawTokenTemplates[0];
	for i := 1; i < len(rawTokenTemplates); i++ {
		selector += "|";
		selector += rawTokenTemplates[i];
	};
	var tokenizer, _ = regexp.Compile(selector);

	var interpreter = make([]*regexp.Regexp, len(rawTokenTemplates));
	for i, rawTokenTemplate := range rawTokenTemplates {
		interpreter[i], _ = regexp.Compile(rawTokenTemplate);
	}

	return tokenizer, &interpreter;
})();

var operatorMap = map[string]int{
	"-":1,
	"+":2,
	"/":3,
	"*":4,
}

func (in *Input) Tokenize () []string {
	return tokenizer.FindAllString(string(*in), -1);
}

func (in *Input) Interpret () *[]*string {
	var tokens = in.Tokenize();
	var ret = []*string{};
	var ops = Utils.NewStack();
	//var variables = map[string]int{};
	for _, token := range tokens {
		for j, template := range *templates {
			if template.MatchString(token) {
				switch j {
				//case 0:
				//	append(ret, *Input(token).Interpret());
				//	break;
				case 1, 2:
					ret = append(ret, &token);
					break;
				case 3, 4:
					//var op, ok = (ops.Peek()).(*string);
					//if !ok {panic("lame");}
					//for operatorMap[token] < operatorMap[op] {
					//	ops.Pop();
					//	ret = append(ret, &op);
					//}
					break;
				default:
					fmt.Print("failed during interpret step");
					break;
				}
				break;
			}
		}
	}
	for ops.Peek() != nil {
		var op, ok = (*ops.Pop()).(string);
		if !ok {panic("lame")}
		ret = append(ret, &op);
	}
	return &ret;
}


