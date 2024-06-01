package database

import (
	"context"
	"database/sql"
	"fmt"
	"hms-api/models"
	"hms-api/types"
	"hms-api/utils"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Service represents a service that interacts with a database.
type Service interface {
	// System
	Health() map[string]string
	Close() error
	GetStats(time.Time) (map[string]interface{}, error)

	// User
	CreateUser(*types.CreateUserPayload) error
	GetUserByUsername(string) (*models.User, error)
	UserExists(string) (bool, error)
	GetUserByID(uuid.UUID) (*models.User, error)
	UpdateUser(uuid.UUID, *types.UpdateUserPayload) error
	DeleteUser(uuid.UUID) error
	ChangePassword(uuid.UUID, string) error

	// Rooms
	GetRooms() ([]models.Room, error)
	CreateRoom(*types.CreateRoomPayload) error
	GetRoom(uuid.UUID) (*models.Room, error)
	UpdateRoom(uuid.UUID, *types.UpdateRoomPayload) error
	DeleteRoom(uuid.UUID) error
	GetBookingRooms(string) ([]models.Room, error)

	// Bookings
	GetBookings() ([]models.Booking, error)
	GetBooking(id uuid.UUID) (*models.Booking, error)
	DeleteBooking(id uuid.UUID) error
	CreateBooking(*types.CreateBookingPayload) error
	UpdateBooking(uuid.UUID, *types.UpdateBookingPayload) error
	CheckInBooking(uuid.UUID) error
	GetActiveBookings() ([]models.Booking, error)
	CheckOut(uuid.UUID) error

	// Guests
	GetGuests() ([]models.Guest, error)
}

type service struct {
	db *gorm.DB
}

var (
	database   = os.Getenv("DB_DATABASE")
	password   = os.Getenv("DB_PASSWORD")
	username   = os.Getenv("DB_USERNAME")
	port       = os.Getenv("DB_PORT")
	host       = os.Getenv("DB_HOST")
	dbInstance *service
)

func New() Service {
	// Reuse Connection
	if dbInstance != nil {
		return dbInstance
	}
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, password, host, port, database)
	db, _ := sql.Open("pgx", connStr)

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}
	dbInstance = &service{
		db: gormDB,
	}
	log.Println("DB Connected Successfully")
	return dbInstance
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	sqlDB, err := s.db.DB()
	if err != nil {
		log.Fatalf(fmt.Sprintf("failed to get db: %v", err))
	}
	err = sqlDB.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf(fmt.Sprintf("db down: %v", err)) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := sqlDB.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
	}

	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
	}

	return stats
}

func (s *service) GetStats(day time.Time) (map[string]interface{}, error) {
	stats := make(map[string]interface{})
	var bookingsCount int64
	var availableRooms int64
	var inBookings []models.Booking
	var outBookings []models.Booking
	var resBookings []models.Booking
	var cancelBookings []models.Booking
	var cleanRooms int64
	var outServiceRooms int64
	var dirtyRooms int64

	if day.IsZero() {
		day = time.Now()
	}
	fmt.Println(day)
	result := s.db.Model(&models.Booking{}).Where("DATE(created_at) = ?", day.Format("2006-01-02")).Count(&bookingsCount)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Room{}).Where("room_status = ?", "Clean").Where("fo_status = ?", "Vacant").Where("return_status = ?", "Ready").Count(&availableRooms)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Booking{}).Where("DATE(created_at) = ?", day.Format("2006-01-02")).Where("booking_status = ?", "CheckedIn").Find(&inBookings)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Booking{}).Where("DATE(created_at) = ?", day.Format("2006-01-02")).Where("booking_status = ?", "CheckedOut").Find(&outBookings)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Booking{}).Where("DATE(created_at) = ?", day.Format("2006-01-02")).Where("booking_status = ?", "Reservation").Find(&resBookings)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Booking{}).Where("DATE(created_at) = ?", day.Format("2006-01-02")).Where("booking_status = ?", "Cancelled").Find(&cancelBookings)
	if result.Error != nil {
		return nil, result.Error
	}

	chartData := utils.MakeBookingData(inBookings, outBookings, resBookings, cancelBookings)

	result = s.db.Model(&models.Room{}).Where("room_status = ?", "Clean").Count(&cleanRooms)
	if result.Error != nil {
		return nil, result.Error
	}

	result = s.db.Model(&models.Room{}).Where("room_status = ?", "Out of service").Count(&outServiceRooms)
	if result.Error != nil {
		return nil, result.Error
	}
	result = s.db.Model(&models.Room{}).Where("room_status = ?", "Dirty").Count(&dirtyRooms)
	if result.Error != nil {
		return nil, result.Error
	}

	stats["new_bookings"] = bookingsCount
	stats["available_rooms"] = availableRooms
	stats["check_ins"] = len(inBookings)
	stats["check_outs"] = len(outBookings)
	stats["reservations"] = len(resBookings)
	stats["cancelled"] = len(cancelBookings)
	stats["data"] = chartData
	stats["pieData"] = []map[string]interface{}{
		{
			"name":  "Clean Rooms",
			"value": cleanRooms,
		},
		{
			"name":  "Out of Service Rooms",
			"value": outServiceRooms,
		},
		{
			"name":  "Dirty Rooms",
			"value": dirtyRooms,
		},
	}

	return stats, nil

}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() error {
	log.Printf("Disconnected from database: %s", database)
	db, err := s.db.DB()
	if err != nil {
		return err
	}
	return db.Close()
}
