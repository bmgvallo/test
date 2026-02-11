package com.vallo.mobile.api

import retrofit2.http.*

interface ApiService {

    @POST("auth/login")
    suspend fun login(@Body loginData: Map<String, String>): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body registerData: Map<String, String>): User

    @GET("profile/me/{userId}")
    suspend fun getProfile(@Header("Authorization") token: String, @Path("userId") userID: Long): User

    @PUT("profile/update")
    suspend fun updateProfile(@Header("Authorization") token: String, @Body user: User): User

    @POST("auth/logout")
    suspend fun logout(@Header("Authorization") token: String): Map<String, String>
}

data class AuthResponse(
    val token: String,
    val userID: Long,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String
)

data class User(
    val userID: Long,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phoneNumber: String,
    val createdAt: String? = null
)