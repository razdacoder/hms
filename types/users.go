package types

type CreateUserPayload struct {
	Firstname     string `json:"first_name" validate:"required"`
	Lastname      string `json:"last_name" validate:"required"`
	Username      string `json:"username" validate:"required"`
	Password      string `json:"password" validate:"required,min=8"`
	SecurityLevel string `json:"security_level" validate:"max=1"`
}

type LoginUserPayload struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type UpdateUserPayload struct {
	Firstname     string `json:"first_name" validate:""`
	Lastname      string `json:"last_name" validate:""`
	Username      string `json:"username" validate:""`
	SecurityLevel string `json:"security_level" validate:"max=1"`
}

type PasswordChangePayload struct {
	NewPassword     string `json:"new_password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8"`
}
