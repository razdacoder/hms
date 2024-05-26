package routes

import (
	"fmt"
	"hms-api/internal/database"
	"hms-api/types"
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

	payload, err := utils.Decode[*types.CreateUserPayload](r)
	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	hashPassword, err := utils.HashPassword(payload.Password)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	userExists, err := handler.db.UserExists(payload.Username)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	if userExists {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("user already exists"))
		return
	}

	payload.Password = hashPassword

	err = handler.db.CreateUser(payload)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}
	utils.Encode(w, http.StatusCreated, map[string]string{"message": "User Created"})
}
