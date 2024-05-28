package types

import (
	"hms-api/models"

	"github.com/lib/pq"
)

type CreateRoomPayload struct {
	RoomType    string   `json:"room_type" validate:"required"`
	RoomNumber  string   `json:"room_number" validate:"required"`
	Price       float64  `json:"price" validate:"required"`
	BedType     string   `json:"bed_type" validate:"required"`
	MaxCapacity int      `json:"max_capacity" validate:"required"`
	Amenities   []string `json:"amenities" validate:"required"`
	Images      []string `json:"images" validate:"required"`
}

type UpdateRoomPayload struct {
	RoomType          string   `json:"room_type"`
	RoomNumber        string   `json:"room_number"`
	Price             float64  `json:"price" `
	RoomStatus        string   `json:"room_status"`
	ReturnStatus      string   `json:"return_status"`
	ReservationStatus string   `json:"res_status"`
	FOStatus          string   `json:"fo_status"`
	BedType           string   `json:"bed_type"`
	MaxCapacity       int      `json:"max_capacity"`
	Amenities         []string `json:"amenities"`
	Images            []string `json:"images"`
}

func ParseUpdates(payload *UpdateRoomPayload) map[string]interface{} {
	_updates := make(map[string]interface{})

	if payload.RoomType != "" {
		_updates["room_type"] = (*models.RoomType)(&payload.RoomType)
	}

	if payload.RoomNumber != "" {
		_updates["room_number"] = payload.RoomNumber
	}

	if payload.RoomStatus != "" {
		_updates["room_status"] = (*models.RoomStatus)(&payload.RoomStatus)
	}

	if payload.ReturnStatus != "" {
		_updates["return_status"] = payload.ReturnStatus
	}

	if payload.ReservationStatus != "" {
		_updates["reservation_status"] = (*models.ReservationStatus)(&payload.ReservationStatus)
	}

	if payload.BedType != "" {
		_updates["bed_type"] = (*models.BedType)(&payload.BedType)
	}

	if payload.FOStatus != "" {
		_updates["fo_status"] = (*models.FOStatus)(&payload.FOStatus)
	}

	if payload.Price != 0 {
		_updates["price"] = payload.Price
	}

	if payload.MaxCapacity != 0 {
		_updates["max_capacity"] = payload.MaxCapacity
	}

	// if payload.Images != nil {
	// 	_updates["images"] = payload.Images
	// }

	// if payload.Amenities != nil {
	// 	_updates["amenities"] = payload.Amenities
	// }
	if len(payload.Amenities) > 0 {
		_updates["amenities"] = pq.Array(payload.Amenities)
	}

	if len(payload.Images) > 0 {
		_updates["images"] = pq.Array(payload.Images)
	}

	return _updates
}
