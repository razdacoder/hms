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

type BookingHandler struct {
	db database.Service
}

func NewBookingHandler(db database.Service) *BookingHandler {
	return &BookingHandler{
		db: db,
	}
}

func guestRouter(handler *BookingHandler) chi.Router {
	router := chi.NewRouter()
	router.Get("/", handler.handleGetGuests)

	return router
}

func bookingsRouter(handler *BookingHandler) chi.Router {
	router := chi.NewRouter()
	router.Get("/", handler.handleGetBookings)
	router.With(middlewares.IsLoggedIn, middlewares.IsLevel2).Post("/", handler.handleCreateBooking)
	router.Route("/{id}", func(router chi.Router) {
		router.Use(middlewares.IsLoggedIn)
		router.Get("/", handler.handleGetBooking)
		router.With(middlewares.IsLevel4).Delete("/", handler.handleDeleteBooking)
		router.With(middlewares.IsLevel2).Patch("/", handler.handleUpdateBooking)
	})

	return router
}

func (handler *BookingHandler) RegisterUserRoutes(router chi.Router) {
	router.Mount("/bookings", bookingsRouter(handler))
	router.Mount("/guests", guestRouter(handler))
}

func (handler *BookingHandler) handleGetBookings(w http.ResponseWriter, r *http.Request) {
	bookings, err := handler.db.GetBookings()
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}
	utils.Encode(w, http.StatusOK, bookings)
}

func (handler *BookingHandler) handleGetBooking(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")

	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid uuid"))
		return
	}

	booking, err := handler.db.GetBooking(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("booking not found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, booking)
}

func (handler *BookingHandler) handleCreateBooking(w http.ResponseWriter, r *http.Request) {
	payload, err := utils.Decode[*types.CreateBookingPayload](r)
	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	err = handler.db.CreateBooking(payload)
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusCreated, map[string]string{"message": "Booking Created"})
}

func (handler *BookingHandler) handleUpdateBooking(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}
	payload, err := utils.Decode[*types.UpdateBookingPayload](r)

	if err != nil {
		utils.InvalidJson(w)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		utils.InvalidRequestData(w, utils.ErrorMap(err))
		return
	}

	err = handler.db.UpdateBooking(id, payload)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no booking found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Booking updated"})
}

func (handler *BookingHandler) handleDeleteBooking(w http.ResponseWriter, r *http.Request) {
	param_id := chi.URLParam(r, "id")
	id, err := uuid.Parse(param_id)

	if err != nil {
		utils.APIError(w, http.StatusBadRequest, fmt.Errorf("invalid id"))
		return
	}

	err = handler.db.DeleteBooking(id)

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.APIError(w, http.StatusNotFound, fmt.Errorf("no booking found"))
			return
		}
		utils.ServerError(w, r, err)
		return
	}

	utils.Encode(w, http.StatusOK, map[string]string{"message": "Booking deleted"})
}

func (handler *BookingHandler) handleGetGuests(w http.ResponseWriter, r *http.Request) {
	guests, err := handler.db.GetGuests()
	if err != nil {
		utils.ServerError(w, r, err)
		return
	}
	utils.Encode(w, http.StatusOK, guests)
}
