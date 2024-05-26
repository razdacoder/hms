package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type RoomStatus string

const (
	Clean        RoomStatus = "Clean"
	Inspected    RoomStatus = "Inspected"
	OutOfService RoomStatus = "Out of service"
	OutOfOrder   RoomStatus = "Out of order"
	Dirty        RoomStatus = "Dirty"
	CleanUp      RoomStatus = "Clean up"
)

func (e *RoomStatus) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = RoomStatus(val)

	return nil
}

func (e RoomStatus) Value() (interface{}, error) {
	return string(e), nil
}

type RoomType string

const (
	StandardRoom RoomType = "Standard"
	SuiteRoom    RoomType = "Suite"
	DeluxeRoom   RoomType = "Deluxe"
)

func (e *RoomType) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = RoomType(val)

	return nil
}

func (e RoomType) Value() (interface{}, error) {
	return string(e), nil
}

type ReservationStatus string

const (
	NotReserved ReservationStatus = "Not Reserved"
	Departed    ReservationStatus = "Departed"
	InHouse     ReservationStatus = "In House"
)

func (e *ReservationStatus) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = ReservationStatus(val)

	return nil
}

func (e ReservationStatus) Value() (interface{}, error) {
	return string(e), nil
}

type FOStatus string

const (
	Vacant   FOStatus = "Vacant"
	Occupied FOStatus = "Occupied"
)

func (e *FOStatus) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = FOStatus(val)

	return nil
}

func (e FOStatus) Value() (interface{}, error) {
	return string(e), nil
}

type BedType string

const (
	Single BedType = "Twin Size "
	Double BedType = "Double Size"
	King   BedType = "King Size"
)

func (e *BedType) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = BedType(val)

	return nil
}

func (e BedType) Value() (interface{}, error) {
	return string(e), nil
}

type Room struct {
	ID                uuid.UUID          `gorm:"primary_key;type:uuid;default:uuid_generate_v4()" json:"id"`
	RoomType          *RoomType          `gorm:"type:room_type;default:Standard;not null" json:"room_type"`
	RoomNumber        string             `gorm:"type:text;not null" json:"room_number"`
	Price             float64            `gorm:"type:decimal(10, 2)" json:"price"`
	RoomStatus        *RoomStatus        `gorm:"type:room_status;default:Clean;not null" json:"room_status"`
	ReturnStatus      string             `gorm:"type:text" json:"return_status"`
	ReservationStatus *ReservationStatus `gorm:"type:res_status;default:Not Reserved;not null" json:"res_status"`
	FOStatus          *FOStatus          `gorm:"type:fo_status;default:Vacant;not null" json:"fo_status"`
	BedType           *BedType           `gorm:"type:bed_type;default:Twin Size;not null" json:"bed_type"`
	MaxCapacity       int                `gorm:"type:int;not null" json:"max_capacity"`
	Amenities         pq.StringArray     `gorm:"type:text[];not null" json:"amenities"`
	Images            pq.StringArray     `gorm:"type:text[];not null" json:"images"`
	CreatedAt         time.Time          `gorm:"auto_now_add" json:"created_at"`
	UpdatedAt         time.Time          `gorm:"auto_now" json:"updated_at"`
}
