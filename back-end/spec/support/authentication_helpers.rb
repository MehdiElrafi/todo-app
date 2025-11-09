module AuthenticationHelpers
  def login(user)
    post "/session", params: { email_address: user.email_address, password: "password123" }
    follow_redirect! if response.redirect?
  end
end
