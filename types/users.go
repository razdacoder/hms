package types

type CreateUserPayload struct {
	Firstname     string `json:"first_name" validate:"required"`
	Lastname      string `json:"last_name" validate:"required"`
	Username      string `json:"username" validate:"required"`
	Password      string `json:"password" validate:"required,min=8"`
	SecurityLevel string `json:"security_level" validate:"max=1"`
}
