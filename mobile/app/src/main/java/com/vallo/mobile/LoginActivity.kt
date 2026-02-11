package com.vallo.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.vallo.mobile.api.ApiClient
import com.vallo.mobile.databinding.ActivityLoginBinding
import com.vallo.mobile.utils.TokenManager  // ←── ADD THIS IMPORT
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var tokenManager: TokenManager  // ←── ADD THIS LINE

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager.getInstance(this)  // ←── ADD THIS LINE

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnLogin.setOnClickListener {
            performLogin()
        }

        binding.tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun performLogin() {
        val username = binding.etUsername.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnLogin.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.apiService.login(
                    mapOf(
                        "username" to username,
                        "password" to password
                    )
                )

                // Save token and user data - ADD THIS BLOCK
                tokenManager.saveAuthData(
                    response.token,
                    response.userID,
                    response.username
                )

                Toast.makeText(this@LoginActivity, "Login successful!", Toast.LENGTH_SHORT).show()

                // Navigate to Dashboard
                startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
                finish()

            } catch (e: Exception) {
                binding.btnLogin.isEnabled = true
                Toast.makeText(this@LoginActivity, "Login failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}