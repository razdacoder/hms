package main

import (
	"fmt"
	"hms-api/internal/database"
	"hms-api/internal/server"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

func main() {
	scheduler := cron.New()
	scheduler.AddFunc("@every 1m", func() {
		bookings, err := database.New().GetActiveBookings()

		if err != nil {
			log.Println(err)
			return
		}

		// Iterate over the bookings
		for _, booking := range bookings {
			// Check if the check-out time has been reached
			if time.Now().After(booking.CheckOutDate) {
				err := database.New().CheckOut(booking.ID)
				if err != nil {
					log.Println(err)
					return
				}
				log.Println("Booking checked out successfully")
			}
		}
		log.Println("Cron finished")
	})

	// Start the scheduler
	scheduler.Start()
	server := server.NewServer()

	log.Println("Listening on port ", server.Addr)

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

}
