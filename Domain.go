package GolangComputerAlgebra

// Domains represent the idea of mathematical domains (like real numbers or booleans) which
// simple operations may be defined over.
type Domain interface {
	abstractionOf (*SyntaxTree) *Abstraction
}

