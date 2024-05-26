package database

import (
	"hms-api/models"
	"hms-api/types"
)

func (s *service) CreateUser(payload *types.CreateUserPayload) error {

	newUser := &models.User{
		Firstname: payload.Firstname,
		Lastname:  payload.Lastname,
		Username:  payload.Username,
		Password:  payload.Password,
	}

	if payload.SecurityLevel != "" {
		newUser.SecurityLevel = (*models.SecurityLevel)(&payload.SecurityLevel)
	}

	results := s.db.Create(newUser)

	return results.Error
}

func (store *service) UserExists(username string) (bool, error) {
	var count int64
	result := store.db.Model(&models.User{}).Where("username = ?", username).Count(&count)
	return count > 0, result.Error
}

func (s *service) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := s.db.Model(&models.User{}).Where("username = ?", username).First(&user)
	return &user, result.Error
}
