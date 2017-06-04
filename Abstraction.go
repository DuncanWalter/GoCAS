package GolangComputerAlgebra


type Abstraction interface {
	getDomain () *Domain
}









// TODO this comment belongs with the rewrites, not eh abstractions
// Abstractions are rewrite axioms expressed as alpha substitutions from first order
// lambda calculus. For example, an abstraction called 'commutativity' might be expressed as
// "<op>(_a, _b) -> <op>(_b, _a)" indicating that an operation 'op'