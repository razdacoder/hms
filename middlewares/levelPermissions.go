package middlewares

import (
	"fmt"
	"hms-api/models"
	"hms-api/utils"
	"net/http"
)

func IsLevel5(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		ctx := request.Context()
		user, ok := ctx.Value(UserKey).(*utils.UserPayload)
		if !ok {
			utils.APIError(writer, http.StatusUnprocessableEntity, fmt.Errorf("no user found"))
			return
		}

		if !(*user.SecurityLevel == models.CEO) {
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}

		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}

func IsLevel4(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		ctx := request.Context()
		user, ok := ctx.Value(UserKey).(*utils.UserPayload)
		if !ok {
			utils.APIError(writer, http.StatusUnprocessableEntity, fmt.Errorf("no user found"))
			return
		}

		if !(*user.SecurityLevel == models.Manager_IT || *user.SecurityLevel == models.CEO) {
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}

		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}

func IsLevel3(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		ctx := request.Context()
		user, ok := ctx.Value(UserKey).(*utils.UserPayload)
		if !ok {
			utils.APIError(writer, http.StatusUnprocessableEntity, fmt.Errorf("no user found"))
			return
		}

		if !(*user.SecurityLevel == models.Manager_IT || *user.SecurityLevel == models.CEO || *user.SecurityLevel == models.Supervisor) {
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}

		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}

func IsLevel2(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		ctx := request.Context()
		user, ok := ctx.Value(UserKey).(*utils.UserPayload)
		if !ok {
			utils.APIError(writer, http.StatusUnprocessableEntity, fmt.Errorf("no user found"))
			return
		}

		if !(*user.SecurityLevel == models.Manager_IT || *user.SecurityLevel == models.CEO || *user.SecurityLevel == models.Supervisor || *user.SecurityLevel == models.Receptionist) {
			utils.APIError(writer, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			return
		}

		next.ServeHTTP(writer, request.WithContext(ctx))
	})
}
