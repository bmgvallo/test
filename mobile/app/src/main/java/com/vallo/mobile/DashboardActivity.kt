package com.vallo.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.vallo.mobile.api.ApiClient
import com.vallo.mobile.databinding.ActivityDashboardBinding
import com.vallo.mobile.utils.TokenManager
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager.getInstance(this)

        // Check if user is logged in
        if (!tokenManager.isLoggedIn()) {
            navigateToLogin()
            return
        }

        setupClickListeners()
        loadUserProfile()
    }

    private fun setupClickListeners() {
        binding.btnLogout.setOnClickListener {
            performLogout()
        }

        binding.btnViewProfile.setOnClickListener {
            startActivity(Intent(this, ProfileActivity::class.java))
        }
    }

    private fun loadUserProfile() {
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch
                val userId = tokenManager.getUserID()

                val user = ApiClient.apiService.getProfile("Bearer $token", userId)

                binding.tvWelcome.text = "Welcome back, ${user.firstName}!"
                binding.tvUsername.text = "@${user.username}"
                binding.tvEmail.text = user.email
                binding.tvPhone.text = user.phoneNumber

            } catch (e: Exception) {
                Toast.makeText(this@DashboardActivity, "Failed to load profile", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun performLogout() {
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken()
                if (token != null) {
                    ApiClient.apiService.logout("Bearer $token")
                }
            } catch (e: Exception) {
                // Ignore logout errors
            } finally {
                tokenManager.clear()
                navigateToLogin()
            }
        }
    }

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}