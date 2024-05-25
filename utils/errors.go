package utils

import (
	"fmt"
	"log/slog"
	"net/http"
)

func ServerError(w http.ResponseWriter, r *http.Request, err error) {
	Encode(w, http.StatusInternalServerError, fmt.Errorf("internal server error"))
	slog.Debug("New Error: %s from %s", err.Error(), r.RequestURI)
}

func BadRequestError(err error, w http.ResponseWriter, r *http.Request) {
	Encode(w, http.StatusBadRequest, err.Error())
}
