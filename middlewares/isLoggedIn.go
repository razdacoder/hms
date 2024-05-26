package middlewares

import (
	"context"
	"fmt"
	"hms-api/utils"
	"net/http"
)

type ContextKey string

const UserKey ContextKey = "user"

func IsLoggedIn(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		tokenString := request.Header.Get("Authorization")
		if tokenString == "" {
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}
		tokenString = tokenString[len("Bearer "):]
		user, err := utils.VerifyToken(tokenString)
		if err != nil {
			fmt.Println(err)
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}
		ctx := context.WithValue(request.Context(), UserKey, user)
		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}
