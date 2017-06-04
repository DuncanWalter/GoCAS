package GolangComputerAlgebra

import (
	"sort"
)

// SyntaxTrees are a recursive, pointer based representation of algebraic expressions over
// arbitrary domains. They are intended to allow computers to tackle many algebraic problems
// equipped only with rewrite axioms and preferences for certain representations of data.
type SyntaxTree struct {
	// Selector stores the visual information contained in the root node of the SyntaxTree;
	// typically a variable name, the symbol of an operation, or a primitive value.
	selector string
	// Complexity of the root node is stored in terms of its position in the opChain of the problem context.
	complexity *int
	//
	abstraction *Abstraction
	//
	domain *Domain
	//
	children []*SyntaxTree
	childrenComplexityOrder []int
	annotated bool
	simplified bool
	opChain *OpChain
	isAbstract *bool
}

// Simplify causes a SyntaxTree to perform a series of reductions in order to reach
// a normal form of minimal complexity and maximal compliance with its domain's opChain. Simplify
// can be a computationally heavy call. Simplify returns a boolean which, when true, indicates
// the SyntaxTree was mutated in the process of simplification. Simplify also returns the
// simplified form of the tree.
func (root *SyntaxTree) Simplify () (bool, *SyntaxTree) {
	return root.simplify(&[]int{})
}
func (root *SyntaxTree) simplify (path *[]int) (bool, *SyntaxTree) {
	if root.simplified {
		return false, root
	}
	var flag = false; // TODO rename and consider reversing the meanings of true and false

	var didSimplify bool
	*path = append(*path, 1)
	for i, child := range root.children {
		(*path)[len(*path) - 1] = i
		didSimplify, root.children[i] = child.simplify(path)
		flag = flag || didSimplify
	}
	*path = (*path)[0:len(*path) - 1]

	// TODO local simplification steps

	return flag, root; // TODO fix: cannot just return root as root may (probably will) alter
}

// Annotate marks a SyntaxTree with information about its complexity and
// the the meaning of its symbols. This is purely for code simplicity and optimization;
// no annotation is strictly necessary to implement this computer algebra system. Annotate
// returns a boolean which, when true, indicates the SyntaxTree was marked in the process
// of annotation.
func (root *SyntaxTree) Annotate () bool {
	return root.annotate(&[]int{})
}
func (root *SyntaxTree) annotate (path *[]int) bool {
	if root.annotated {
		return false
	}
	var flag = false // TODO rename and consider reversing the meanings of true and false



	var indices = []int{};

	// complexity is deduced from parents, and therefore happens before recursion
	*path = append(*path, 1)
	for i, child := range root.children {
		indices = append(indices, i)
		(*path)[len(*path) - 1] = i
		flag = flag || child.annotate(path) // technically, this recursion will almost always be redundant
	}
	*path = (*path)[0:len(*path) - 1]

	if flag {
		// sorts the indices slice, NOT the children or the root node
		sort.Sort(ByComplexity{
			trees: root.children,
			indices: indices,
		})
		root.childrenComplexityOrder = indices
	}

	// abstractions are inferred from children, and therefore are dealt with after recursion
	if root.abstraction == nil {
		for _, child := range root.children {
			root.abstraction = (*(*child.abstraction).getDomain()).abstractionOf(root);
			if root.abstraction != nil {
				break;
			}
		}
		if root.abstraction == nil {
			panic("can't deduce the abstraction for root node"); // TODO figure out how to throw an error with useful content here...
		}
		flag = true;
	}
	if root.isAbstract == nil {
		root.isAbstract = &false
		for _, child := range root.children {
			root.isAbstract = &(*root.isAbstract && *child.isAbstract)
			if !*root.isAbstract {
				break
			}
		}
		flag = true;
	}


	if root.complexity == nil {
		// TODO needs to be reworked conceptually
		flag = true;
	}

	return flag;

}


// Clean removes annotations from a given path in a SyntaxTree. This is usually managed
// by other methods and not called manually.
func (root *SyntaxTree) Clean (path []int) {
	// TODO do the friggin clean
	var tree = root
	for _, branch := range path {
		// tree.abstraction need not be uprooted, but everything else should be cleared
		tree.simplified = nil
		tree.annotated = nil
		tree.childrenComplexityOrder = nil
		tree.complexity = nil
		tree.isAbstract = nil
		tree = tree.children[branch]
	}
	tree.simplified = nil
	tree.annotated = nil
	tree.childrenComplexityOrder = nil
	tree.complexity = nil
	tree.isAbstract = nil
}




type iterator struct {
	_next *SyntaxTree
	path []int
	history []*SyntaxTree
	structure []int
}

func (root *SyntaxTree) getIterator () *iterator {
	return &iterator{
		_next: root,
		path: []int{},
		history: []*SyntaxTree{},
		structure: []int{},
	}
}

func (i *iterator) hasNext () bool {
	return i._next != nil
}

func (i *iterator) next () *SyntaxTree {
	return i._next
}

func (i *iterator) step () {

	// the iterator has already completed its traversal, so nothing needs to be done
	if i._next == nil {
		return;
	}

	i.history = append(i.history, i._next)
	i.path    = append(i.path   , -1)

	// first, pops off any completely traversed nodes
	for len(i.history) != 0 && len(i.history[len(i.history)-1].children) != i.path[len(i.path) - 1] + 1 {
		i.history = i.history[0:len(i.history) - 1]
		i.path    = i.path   [0:len(i.path   ) - 1]
	}

	i.path[len(i.path) - 1] += 1
	var _last = i.history[len(i.history) - 1]
	i._next = _last.children[_last.childrenComplexityOrder[i.path[len(i.path) - 1]]]

}

// ByComplexity implements the sort package interface such that a slice of indices (referencing a slice
// of Syntax trees) can be sorted to reflect an ordering of SyntaxTrees by complexity in decreasing order.
type ByComplexity struct {
	trees []*SyntaxTree
	indices []int
}
func (a ByComplexity) Len() int           { return len(a.indices) }
func (a ByComplexity) Swap(i, j int)      { a.indices[i], a.indices[j] = a.indices[j], a.indices[i] }
func (a ByComplexity) Less(i, j int) bool { return Compare(a.trees[a.indices[j]], a.trees[a.indices[i]]) < 0 } // note the switched j and i!


// Compare performs a complexity comparison of two SyntaxTrees and returns an integer value
// which is positive if the first tree given is more complex, negative if the second is, and
// 0 if they have the same complexity (and are therefore equivalent).
func Compare (a *SyntaxTree, b *SyntaxTree) int {

	a.Annotate()
	b.Annotate()

	var _a = a.getIterator()
	var _b = b.getIterator()

	for _a.hasNext() && _b.hasNext() {

		var ac = *_a.next().complexity
		var bc = *_b.next().complexity

		if ac >= bc {
			_b.step()
		}
		if ac <= bc {
			_a.step()
		}
	}

	if !_a.hasNext() && !_b.hasNext(){

		_a = a.getIterator()
		_b = b.getIterator()

		for _a.hasNext() && _b.hasNext() {

			var ac = *_a.next().complexity
			var bc = *_b.next().complexity

			if ac >= bc {
				return -1
			}
			if ac <= bc {
				return +1
			}
		}

		return 0
	}

	if !_a.hasNext() {
		return -1
	}
	if !_b.hasNext() {
		return +1
	}

	return 0
}

func (root *SyntaxTree) IsEquivalentTo (target *SyntaxTree) (bool, *SyntaxTree) {
	var _, t1 = root.Simplify();
	var _, t2 = target.Simplify();
	if Compare(t1, t2) == 0 {

	}


}


//// NodeAt fetches the SyntaxTree located at the end of the given path,
//// where each number in the path represents an index in a SyntaxTree's children array.
//func (root *SyntaxTree) NodeAt (path []int) *SyntaxTree {
//	var tree = root
//	for _, branch := range path {
//		// TODO check for path safety
//		tree = tree.children[branch]
//	}
//	return tree
//}


