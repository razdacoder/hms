package routes

import (
	"hms-api/internal/database"
	"hms-api/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type UserHandler struct {
	db database.Service
}

func NewUserHandler(db database.Service) *UserHandler {
	return &UserHandler{
		db: db,
	}
}

func usersRouter(handler *UserHandler) chi.Router {
	router := chi.NewRouter()
	router.Post("/", handler.handleRegisterUser)
	return router
}

func (handler *UserHandler) RegisterUserRoutes(router chi.Router) {
	router.Mount("/users", usersRouter(handler))
}

func (handler *UserHandler) handleRegisterUser(w http.ResponseWriter, r *http.Request) {
	_ = handler.db.CreateUser()
	utils.Encode(w, http.StatusOK, map[string]string{"message": "Hello"})
}
