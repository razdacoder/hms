package users

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type SecurityLevel string

const (
	Staff        SecurityLevel = "1"
	Receptionist SecurityLevel = "2"
	Supervisor   SecurityLevel = "3"
	Manager_IT   SecurityLevel = "4"
	CEO          SecurityLevel = "5"
)

func (e *SecurityLevel) Scan(value interface{}) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid str")
	}
	*e = SecurityLevel(val)

	return nil
}

func (e SecurityLevel) Value() (interface{}, error) {
	return string(e), nil
}

type User struct {
	ID            uuid.UUID      `gorm:"primary_key;type:uuid;default:uuid_generate_v4()" json:"id"`
	Firstname     string         `gorm:"type:text;not null" json:"first_name"`
	Lastname      string         `gorm:"type:text;not null" json:"last_name"`
	Username      string         `gorm:"type:text;unique;not null" json:"username"`
	SecurityLevel *SecurityLevel `gorm:"type:security_level;default:1;not null" json:"security_level"`
	Password      string         `gorm:"type:text;not null" json:"-"`
	CreatedAt     time.Time      `gorm:"auto_now_add" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"auto_now" json:"updated_at"`
}
