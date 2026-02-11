package com.vallo.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.vallo.mobile.api.ApiClient
import com.vallo.mobile.databinding.ActivityProfileBinding
import com.vallo.mobile.utils.TokenManager
import kotlinx.coroutines.launch

class ProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityProfileBinding
    private lateinit var tokenManager: TokenManager
    private var isEditing = false
    private var currentUserId: Long = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager.getInstance(this)

        // Check if user is logged in
        if (!tokenManager.isLoggedIn()) {
            navigateToLogin()
            return
        }

        currentUserId = tokenManager.getUserID()

        setupClickListeners()
        loadUserProfile()
    }

    private fun setupClickListeners() {
        binding.btnBack.setOnClickListener {
            finish()
        }

        binding.btnEdit.setOnClickListener {
            toggleEditMode()
        }

        binding.btnSave.setOnClickListener {
            saveProfile()
        }

        binding.btnCancel.setOnClickListener {
            toggleEditMode()
            loadUserProfile() // Reset to original data
        }
    }

    private fun toggleEditMode() {
        isEditing = !isEditing

        if (isEditing) {
            // Switch to edit mode
            binding.btnEdit.visibility = android.view.View.GONE
            binding.btnSave.visibility = android.view.View.VISIBLE
            binding.btnCancel.visibility = android.view.View.VISIBLE

            // Enable input fields
            binding.etFirstName.isEnabled = true
            binding.etLastName.isEnabled = true
            binding.etPhone.isEnabled = true

            // Hide TextViews, show EditTexts
            binding.tvFirstNameValue.visibility = android.view.View.GONE
            binding.tvLastNameValue.visibility = android.view.View.GONE
            binding.tvPhoneValue.visibility = android.view.View.GONE

            binding.etFirstName.visibility = android.view.View.VISIBLE
            binding.etLastName.visibility = android.view.View.VISIBLE
            binding.etPhone.visibility = android.view.View.VISIBLE

        } else {
            // Switch to view mode
            binding.btnEdit.visibility = android.view.View.VISIBLE
            binding.btnSave.visibility = android.view.View.GONE
            binding.btnCancel.visibility = android.view.View.GONE

            // Disable input fields
            binding.etFirstName.isEnabled = false
            binding.etLastName.isEnabled = false
            binding.etPhone.isEnabled = false

            // Show TextViews, hide EditTexts
            binding.tvFirstNameValue.visibility = android.view.View.VISIBLE
            binding.tvLastNameValue.visibility = android.view.View.VISIBLE
            binding.tvPhoneValue.visibility = android.view.View.VISIBLE

            binding.etFirstName.visibility = android.view.View.GONE
            binding.etLastName.visibility = android.view.View.GONE
            binding.etPhone.visibility = android.view.View.GONE
        }
    }

    private fun loadUserProfile() {
        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch

                val user = ApiClient.apiService.getProfile("Bearer $token", currentUserId)

                // Display user data
                binding.tvUsername.text = "@${user.username}"
                binding.tvEmailValue.text = user.email
                binding.tvFirstNameValue.text = user.firstName
                binding.tvLastNameValue.text = user.lastName
                binding.tvPhoneValue.text = user.phoneNumber
                binding.tvMemberSince.text = "Member since: ${formatDate(user.createdAt)}"

                // Set edit text values
                binding.etFirstName.setText(user.firstName)
                binding.etLastName.setText(user.lastName)
                binding.etPhone.setText(user.phoneNumber)

                // Set avatar with first letter
                binding.tvAvatar.text = user.firstName.first().toString()

            } catch (e: Exception) {
                Toast.makeText(this@ProfileActivity, "Failed to load profile", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun saveProfile() {
        val firstName = binding.etFirstName.text.toString().trim()
        val lastName = binding.etLastName.text.toString().trim()
        val phoneNumber = binding.etPhone.text.toString().trim()

        if (firstName.isEmpty() || lastName.isEmpty() || phoneNumber.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnSave.isEnabled = false

        lifecycleScope.launch {
            try {
                val token = tokenManager.getToken() ?: return@launch

                val updatedUser = com.vallo.mobile.api.User(
                    userID = currentUserId,
                    username = "", // Not updating username
                    email = "", // Not updating email
                    firstName = firstName,
                    lastName = lastName,
                    phoneNumber = phoneNumber
                )

                val response = ApiClient.apiService.updateProfile("Bearer $token", updatedUser)

                // Update displayed data
                binding.tvFirstNameValue.text = response.firstName
                binding.tvLastNameValue.text = response.lastName
                binding.tvPhoneValue.text = response.phoneNumber

                Toast.makeText(this@ProfileActivity, "Profile updated successfully!", Toast.LENGTH_SHORT).show()
                toggleEditMode()

            } catch (e: Exception) {
                binding.btnSave.isEnabled = true
                Toast.makeText(this@ProfileActivity, "Update failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun formatDate(dateString: String?): String {
        return try {
            if (dateString.isNullOrEmpty()) return "Unknown"
            // Simple formatting - you might want to use proper date parsing
            dateString.substring(0, 10)
        } catch (e: Exception) {
            "Unknown"
        }
    }

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}