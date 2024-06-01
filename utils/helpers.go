package utils

import (
	"encoding/json"
	"fmt"
	"hms-api/models"
	"net/http"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

func Encode[T any](w http.ResponseWriter, status int, v T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("encode json: %w", err)
	}
	return nil
}

func Decode[T any](r *http.Request) (T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}
	return v, nil
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func VerifyPassword(hashedPassword string, plain []byte) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), plain)
	return err == nil
}

var Validate = validator.New()

type BookingData struct {
	Hour        int
	CheckedIn   int
	CheckedOut  int
	Reservation int
	Cancelled   int
}

func MakeBookingData(inBookings, outBookings, resBookings, cancelBookings []models.Booking) []map[string]interface{} {
	data := make([]BookingData, 24)

	for _, booking := range inBookings {
		hour := booking.CheckInDate.Hour()
		data[hour].CheckedIn++
	}
	for _, booking := range outBookings {
		hour := booking.CheckInDate.Hour()
		data[hour].CheckedOut++
	}
	for _, booking := range resBookings {
		hour := booking.CheckInDate.Hour()
		data[hour].Reservation++
	}
	for _, booking := range cancelBookings {
		hour := booking.CheckInDate.Hour()
		data[hour].Cancelled++
	}
	chartData := make([]map[string]interface{}, len(data))
	for i, datapoint := range data {
		hour := i % 24
		ampm := "AM"
		if hour >= 12 {
			ampm = "PM"
		}
		if hour == 0 {
			hour = 12
		} else if hour > 12 {
			hour -= 12
		}
		hourStr := fmt.Sprintf("%02d:00 %s", hour, ampm)
		chartData[i] = map[string]interface{}{
			"hour":        hourStr, // hour
			"check_in":    datapoint.CheckedIn,
			"check_out":   datapoint.CheckedOut,
			"reservation": datapoint.Reservation,
			"cancelled":   datapoint.Cancelled,
		}
	}
	return chartData
}
