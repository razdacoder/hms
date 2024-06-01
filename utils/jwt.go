package utils

import (
	"fmt"
	"hms-api/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type UserPayload struct {
	ID            uuid.UUID             `json:"id"`
	Firstname     string                `json:"first_name"`
	Lastname      string                `json:"last_name"`
	Username      string                `json:"username"`
	SecurityLevel *models.SecurityLevel `json:"security_level"`
}

func NewUserPayload(user *models.User) *UserPayload {
	return &UserPayload{
		ID:            user.ID,
		Firstname:     user.Firstname,
		Lastname:      user.Lastname,
		Username:      user.Username,
		SecurityLevel: user.SecurityLevel,
	}
}

func CreateJWT(secret []byte, user *UserPayload) (string, error) {
	expiration := time.Second * time.Duration(86400)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user":       user,
		"expires_at": time.Now().Add(expiration).Unix(),
	})

	tokenStr, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}

func VerifyToken(tokenString string) (*UserPayload, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims := token.Claims.(jwt.MapClaims)
	userClaims, ok := claims["user"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("user claim not found")
	}
	level := (models.SecurityLevel)(userClaims["security_level"].(string))
	var user UserPayload
	user.ID, _ = uuid.Parse(userClaims["id"].(string))
	user.Username = userClaims["username"].(string)
	user.Firstname = userClaims["first_name"].(string)
	user.Lastname = userClaims["last_name"].(string)
	user.SecurityLevel = &level

	return &user, nil
}
