package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Guest struct {
	ID          uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()" json:"id"`
	FullName    string    `gorm:"type:text;not null" json:"full_name"`
	Email       string    `gorm:"type:text;unique;not null" json:"email"`
	PhoneNumber string    `gorm:"type:text;unique;not null" json:"phone_number"`
	Address     string    `gorm:"type:text;not null" json:"address"`
}

type Booking struct {
	ID            uuid.UUID      `gorm:"primary_key;type:uuid;default:uuid_generate_v4()" json:"id"`
	CheckInDate   time.Time      `gorm:"type:time;not null" json:"check_in_date"`
	CheckOutDate  time.Time      `gorm:"type:time;not null" json:"check_out_date"`
	Duration      int            `gorm:"type:int;not null" json:"duration"`
	GuestsNumber  int            `gorm:"type:int;not null" json:"guests_number"`
	GuestRequest  string         `gorm:"type:text" json:"guest_request"`
	BookingExtras pq.StringArray `gorm:"type:text[];not null" json:"extras"`
	RoomID        uuid.UUID      `gorm:"index" json:"-"`
	Room          Room           `json:"room,omitempty"`
	GuestID       uuid.UUID      `gorm:"index" json:"-"`
	Guest         Guest          `json:"guest,omitempty"`
	Price         float64        `gorm:"type:decimal(10, 2);not null" json:"price"`
	CreatedAt     time.Time      `gorm:"auto_now_add" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"auto_now" json:"updated_at"`
}
