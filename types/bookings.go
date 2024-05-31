package types

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type CreateBookingPayload struct {
	CheckInDate   time.Time          `json:"check_in_date" validate:"required"`
	CheckOutDate  time.Time          `json:"check_out_date" validate:"required"`
	Duration      int                `json:"duration" validate:"required,min=1"`
	GuestsNumber  int                `json:"guests_number" validate:"required,min=1"`
	GuestRequest  string             `json:"guest_request"`
	BookingExtras []string           `json:"extras" validate:"required"`
	RoomID        uuid.UUID          `json:"room_id" validate:"required"`
	Guest         CreateGuestPayload `json:"guest" validate:"required"`
	Price         float64            `json:"price" validate:"required"`
	BookingStatus string             `json:"booking_status"`
}

type CreateGuestPayload struct {
	FullName    string `json:"full_name" validate:"required"`
	Email       string `json:"email" validate:"required"`
	PhoneNumber string `json:"phone_number" validate:"required"`
	Address     string `json:"address" validate:"required"`
}

type UpdateBookingPayload struct {
	CheckInDate   time.Time `json:"check_in_date"`
	CheckOutDate  time.Time `json:"check_out_date"`
	Duration      int       `json:"duration"`
	BookingExtras []string  `json:"extras"`
	RoomID        uuid.UUID `json:"room_id"`
	Price         float64   `json:"price"`
	BookingStatus string    `json:"booking_status"`
}

func ParseBookingUpdates(payload *UpdateBookingPayload) map[string]interface{} {
	_updates := make(map[string]interface{})

	if !payload.CheckInDate.IsZero() {
		_updates["check_in_date"] = payload.CheckInDate
	}

	if !payload.CheckOutDate.IsZero() {
		_updates["check_out_date"] = payload.CheckInDate
	}

	if len(payload.BookingExtras) > 0 {
		_updates["booking_extras"] = pq.Array(payload.BookingExtras)
	}

	if payload.Duration != 0 {
		_updates["duration"] = payload.Duration
	}

	if payload.Price != 0 {
		_updates["price"] = payload.Price
	}

	if payload.RoomID != uuid.Nil {
		_updates["room_id"] = payload.RoomID
	}

	if payload.BookingStatus != "" {
		_updates["booking_status"] = payload.BookingStatus
	}

	return _updates
}
