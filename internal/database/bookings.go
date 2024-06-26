package database

import (
	"hms-api/models"
	"hms-api/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *service) GetGuests() ([]models.Guest, error) {
	var guests []models.Guest
	result := s.db.Model(&models.Guest{}).Find(&guests)
	return guests, result.Error
}

func (s *service) GetBookings() ([]models.Booking, error) {
	var bookings []models.Booking
	result := s.db.Model(&models.Booking{}).Preload("Guest").Preload("Room").Find(&bookings)
	return bookings, result.Error
}

func (s *service) GetBooking(id uuid.UUID) (*models.Booking, error) {
	var booking models.Booking
	result := s.db.Model(&models.Booking{}).Where("id = ?", id).Preload("Guest").Preload("Room").First(&booking)
	return &booking, result.Error
}

func (s *service) CreateBooking(payload *types.CreateBookingPayload) error {
	tx := s.db.Begin()
	var guest *models.Guest
	guest = &models.Guest{}
	if err := tx.Model(guest).Where("email = ?", payload.Guest.Email).First(guest).Error; err != nil {
		if err == gorm.ErrRecordNotFound { // If no guest with the same email is found, create a new guest
			guest = &models.Guest{
				FullName:    payload.Guest.FullName,
				Email:       payload.Guest.Email,
				PhoneNumber: payload.Guest.PhoneNumber,
				Address:     payload.Guest.Address,
			}
			if err := tx.Create(guest).Error; err != nil {
				tx.Rollback()
				return err
			}
		} else { // If an error occurs while checking for an existing guest, roll back the transaction
			tx.Rollback()
			return err
		}
	}

	// Create the booking
	booking := &models.Booking{
		CheckInDate:   payload.CheckInDate,
		CheckOutDate:  payload.CheckOutDate,
		Duration:      payload.Duration,
		GuestsNumber:  payload.GuestsNumber,
		GuestRequest:  payload.GuestRequest,
		BookingExtras: payload.BookingExtras,
		RoomID:        payload.RoomID,
		GuestID:       guest.ID,
		Price:         payload.Price,
	}

	if payload.BookingStatus != "" {
		booking.BookingStatus = (*models.BookingStatus)(&payload.BookingStatus)
	}

	fo_stat := "Occupied"

	if err := tx.Create(booking).Error; err != nil {
		tx.Rollback()
		return err
	}
	if payload.BookingStatus != "" {
		if err := tx.Model(&models.Room{}).Where("id", booking.RoomID).Updates(map[string]interface{}{"fo_status": (*models.FOStatus)(&fo_stat)}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteBooking(id uuid.UUID) error {
	result := s.db.Delete(&models.Booking{}, id)
	return result.Error
}

func (s *service) UpdateBooking(id uuid.UUID, payload *types.UpdateBookingPayload) error {
	_updates := types.ParseBookingUpdates(payload)
	result := s.db.Model(&models.Booking{}).Where("id = ?", id).Updates(_updates)
	return result.Error
}

func (s *service) CheckInBooking(id uuid.UUID) error {
	booking, err := s.GetBooking(id)
	if err != nil {
		return err
	}

	room, err := s.GetRoom(booking.RoomID)
	if err != nil {
		return err
	}

	foStat := "Occupied"
	booking_stat := "CheckedIn"
	room.FOStatus = (*models.FOStatus)(&foStat)
	booking.BookingStatus = (*models.BookingStatus)(&booking_stat)

	if err := s.db.Save(&booking).Error; err != nil {
		return err
	}
	result := s.db.Save(&room)

	return result.Error
}

func (s *service) CheckOut(id uuid.UUID) error {
	booking, err := s.GetBooking(id)
	if err != nil {
		return err
	}
	room, err := s.GetRoom(booking.RoomID)
	if err != nil {
		return err
	}
	foStat := "Vacant"
	roomStat := "Clean up"
	booking_stat := "CheckedOut"
	room.FOStatus = (*models.FOStatus)(&foStat)
	room.RoomStatus = (*models.RoomStatus)(&roomStat)
	booking.BookingStatus = (*models.BookingStatus)(&booking_stat)

	if err := s.db.Save(&booking).Error; err != nil {
		return err
	}
	result := s.db.Save(&room)
	return result.Error
}

func (s *service) GetActiveBookings() ([]models.Booking, error) {
	var bookings []models.Booking
	result := s.db.Model(&models.Booking{}).Where("booking_status = ?", "CheckedIn").Preload("Room").Find(&bookings)
	return bookings, result.Error
}
