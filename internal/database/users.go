package database

import (
	"hms-api/models"
	"hms-api/types"

	"github.com/google/uuid"
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

func (s *service) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	result := s.db.Model(&models.User{}).Where("id = ?", id).First(&user)
	return &user, result.Error
}

func (s *service) UpdateUser(id uuid.UUID, payload *types.UpdateUserPayload) error {
	_updates := make(map[string]interface{})

	if payload.Firstname != "" {
		_updates["firstname"] = payload.Firstname
	}

	if payload.Lastname != "" {
		_updates["lastname"] = payload.Lastname
	}

	if payload.Username != "" {
		_updates["username"] = payload.Username
	}

	if payload.SecurityLevel != "" {
		_updates["security_level"] = payload.SecurityLevel
	}

	result := s.db.Model(&models.User{}).Where("id = ?", id).Updates(_updates)

	return result.Error
}

func (s *service) DeleteUser(id uuid.UUID) error {
	result := s.db.Delete(&models.User{}, id)
	return result.Error
}

func (s *service) ChangePassword(id uuid.UUID, password string) error {
	result := s.db.Model(&models.User{}).Where("id = ?", id).Update("password", password)
	return result.Error
}
