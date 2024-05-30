package routes

import (
	"fmt"
	"hms-api/internal/database"
	"hms-api/middlewares"
	"hms-api/types"
	"hms-api/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoomHandler struct {
	db database.Service
}

func NewRoomHandler(db database.Service) *RoomHandler {
	return &RoomHandler{
		db: db,
	}
}

func roomsRouter(handler *RoomHandler) chi.Router {
	router := chi.NewRouter()
	router.Get("/", handler.handleGetRooms)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel4).Post("/", handler.handleCreateRoom)
	router.Get("/book", handler.handleBookingRoom)
	router.Route("/{id}", func(router chi.Router) {
		router.Use(middlewares.IsLoggedIn)
		router.Get("/", handler.handleGetRoom)
		router.With(middlewares.IsLevel4).Patch("/", handler.handleUpdateRoom)
		router.With(middlewares.IsLevel4).Delete("/", handler.handleDeleteRoom)
	})

	return router
}

func (handler *RoomHandler) RegisterUserRoutes(router chi.Router) {
	router.Mount("/rooms", roomsRouter(handler))
}

func (handler *RoomHandler) handleGetRooms(w http.ResponseWriter, r *http.Request) {
	rooms, err := handler.db.GetRooms()

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, rooms)
}

func (handler *RoomHandler) handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	payload, err := utils.Decode[*types.CreateRoomPayload](r)

	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	err = handler.db.CreateRoom(payload)

	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusCreated, map[string]string{"message": "Room Created"})
}

func (handler *RoomHandler) handleGetRoom(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")

	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid uuid"))
		return
	}

	room, err := handler.db.GetRoom(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("room not found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, room)
}

func (handler *RoomHandler) handleUpdateRoom(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}
	payload, err := utils.Decode[*types.UpdateRoomPayload](r)

	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	err = handler.db.UpdateRoom(id, payload)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no room found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Room updated"})
}

func (handler *RoomHandler) handleDeleteRoom(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	err = handler.db.DeleteRoom(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no room found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Room deleted"})
}

func (handler *RoomHandler) handleBookingRoom(w http.ResponseWriter, r *http.Request) {
	room_type := r.URL.Query().Get("room_type")

	rooms, err := handler.db.GetBookingRooms(room_type)
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, rooms)
}
