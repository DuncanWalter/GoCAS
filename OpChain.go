package GolangComputerAlgebra



// OpChains are lists of operations used to represent a total ordering over the operations.
// OpChains have a few special indices and have certain mod-properties.
type OpChain struct {
	//chain []*Operation
	domain *Domain
	selector string // make this a RegExp?
}

func (oc *OpChain) ComplexityOf (node *SyntaxTree, origin int) int {

	//if()





	return nil
}




//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Queue is a classic queue data structure implemented in Golang arrays.
type Queue struct {
	size int
	line []*OpChain
}

// NewQueue returns a reference to an empty, usable Queue
func NewQueue() *Queue {
	return &Queue{
		size: 0,
		line: []*OpChain{},
	}
}

//
func (q *Queue) Enqueue (element *OpChain) {
	q.line[q.size] = element
	q.size++
}

//
func (q *Queue) Dequeue () *OpChain {
	if q.size == 0 {
		// TODO make a useful error message
	}
	q.size--
	return q.line[q.size+1]
}

//
func (q *Queue) IsEmpty () bool {
	return q.size <= 0
}