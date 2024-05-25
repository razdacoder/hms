package routes

import (
	"hms-api/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func usersRouter() chi.Router {
	router := chi.NewRouter()
	router.Post("/", handleRegisterUser)
	return router
}

func RegisterUserRoutes(router chi.Router) {
	router.Mount("/users", usersRouter())
}

func handleRegisterUser(w http.ResponseWriter, r *http.Request) {
	utils.Encode(w, http.StatusOK, map[string]string{"message": "Hello"})
}
