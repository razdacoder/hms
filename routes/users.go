package routes

import (
	"fmt"
	"hms-api/internal/database"
	"hms-api/middlewares"
	"hms-api/types"
	"hms-api/utils"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
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
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel4).Post("/", handler.handleRegisterUser)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel4).Get("/", handler.handlerGetUsers)
	router.Post("/login", handler.handleLoginUser)
	router.With(middlewares.IsLoggedIn).Get("/me", handler.handleGetCurrentUser)
	router.With(middlewares.IsLoggedIn).Get("/{id}", handler.handleGetUser)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel3).Patch("/{id}", handler.handleUpdateUser)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel4).Delete("/{id}", handler.handleDeleteUser)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel4).Post("/{id}/change-password", handler.handleChangePasswordUser)
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

func (handler *UserHandler) handleLoginUser(w http.ResponseWriter, r *http.Request) {
	payload, err := utils.Decode[*types.LoginUserPayload](r)
	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	user, err := handler.db.GetUserByUsername(payload.Username)

	if err != nil {
		utils.APIError(w, http.StatusUnauthorized, fmt.Errorf("invalid username or password"))
		return
	}

	if !utils.VerifyPassword(user.Password, []byte(payload.Password)) {
		utils.APIError(w, http.StatusUnauthorized, fmt.Errorf("invalid username or password"))
		return
	}

	token, err := utils.CreateJWT([]byte(os.Getenv("JWT_SECRET")), utils.NewUserPayload(user))

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]interface{}{"token": token, "user": user})
}

func (handler *UserHandler) handleGetCurrentUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userObj, ok := ctx.Value(middlewares.UserKey).(*utils.UserPayload)

	if !ok {
		utils.APIError(w, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
		return
	}

	user, err := handler.db.GetUserByUsername(userObj.Username)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, user)
}

func (handler *UserHandler) handleGetUser(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)
	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	user, err := handler.db.GetUserByID(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("user not found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}
	utils.Encode(w, http.StatusOK, user)
}

func (handler *UserHandler) handleUpdateUser(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)
	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	payload, err := utils.Decode[*types.UpdateUserPayload](r)

	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	err = handler.db.UpdateUser(id, payload)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no user found"))
			return
		}

		utils.ServerError(w, r, err)
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "User account updated"})
}

func (handler *UserHandler) handleDeleteUser(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)
	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	err = handler.db.DeleteUser(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no user found"))
			return
		}

		utils.ServerError(w, r, err)
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "User Deleted"})
}

func (handler *UserHandler) handleChangePasswordUser(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)
	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	payload, err := utils.Decode[*types.PasswordChangePayload](r)

	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	if payload.NewPassword != payload.ConfirmPassword {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("passwords do not match"))
		return
	}

	hashPassword, err := utils.HashPassword(payload.NewPassword)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	err = handler.db.ChangePassword(id, hashPassword)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no user found"))
			return
		}

		utils.ServerError(w, r, err)
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Password Updated"})
}

func (handler *UserHandler) handlerGetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := handler.db.GetUsers()
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}
	utils.Encode(w, http.StatusOK, users)
}
