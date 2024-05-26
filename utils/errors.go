package utils

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
)

func ServerError(w http.ResponseWriter, r *http.Request, err error) {
	APIError(w, http.StatusInternalServerError, fmt.Errorf("internal server error"))
	slog.Debug("New Error: %s from %s", err.Error(), r.RequestURI)
}

func InvalidJson(w http.ResponseWriter) {
	APIError(w, http.StatusBadRequest, fmt.Errorf("invalid json"))
}

func APIError(w http.ResponseWriter, status int, err error) {
	Encode(w, status, map[string]string{"error": err.Error()})
}

func InvalidRequestData(w http.ResponseWriter, errors map[string]string) {
	Encode(w, http.StatusUnprocessableEntity, map[string]interface{}{"error": errors})
}

func ErrorMap(err error) map[string]string {
	errors := make(map[string]string)
	for _, err := range err.(validator.ValidationErrors) {
		field := strings.ToLower(err.Field())
		tag := err.Tag()
		switch tag {
		case "required":
			errors[field] = fmt.Sprintf("The %s field is required", field)
		case "email":
			errors[field] = fmt.Sprintf("Invalid email address in the %s field", field)
		case "min":
			errors[field] = fmt.Sprintf("The %s field must be at least %s characters", field, err.Param())
		case "max":
			errors[field] = fmt.Sprintf("The %s field must be no more than %s characters", field, err.Param())
		default:
			errors[field] = fmt.Sprintf("Invalid input in the %s field", field)
		}
	}
	return errors
}
