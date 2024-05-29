package database

import (
	"hms-api/models"
	"hms-api/types"

	"github.com/google/uuid"
)

func (s *service) GetRooms() ([]models.Room, error) {
	var rooms []models.Room
	result := s.db.Model(&models.Room{}).Find(&rooms)
	return rooms, result.Error
}

func (s *service) CreateRoom(payload *types.CreateRoomPayload) error {
	newRoom := &models.Room{
		RoomType:    (*models.RoomType)(&payload.RoomType),
		RoomNumber:  payload.RoomNumber,
		Price:       payload.Price,
		BedType:     (*models.BedType)(&payload.BedType),
		MaxCapacity: payload.MaxCapacity,
		Amenities:   payload.Amenities,
		Images:      payload.Images,
	}
	result := s.db.Model(&models.Room{}).Create(newRoom)
	return result.Error
}

func (s *service) GetRoom(id uuid.UUID) (*models.Room, error) {
	var room models.Room
	result := s.db.Model(&models.Room{}).Where("id = ?", id).First(&room)
	return &room, result.Error
}

func (s *service) UpdateRoom(id uuid.UUID, payload *types.UpdateRoomPayload) error {
	_updates := types.ParseRoomUpdates(payload)
	result := s.db.Model(&models.Room{}).Where("id = ?", id).Updates(_updates)
	return result.Error
}

func (s *service) DeleteRoom(id uuid.UUID) error {
	result := s.db.Delete(&models.Room{}, id)
	return result.Error
}
