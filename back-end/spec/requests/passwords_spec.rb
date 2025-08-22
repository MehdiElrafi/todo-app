require 'rails_helper'

RSpec.describe "Passwords API", type: :request do
  let!(:user) { create(:user) }

  describe "POST /passwords" do
    it "sends reset instructions for existing user" do
      post "/passwords", params: { email_address: user.email_address }
      expect(response).to have_http_status(:created)
    end

    it "returns error for unknown email" do
      post "/passwords", params: { email_address: "unknown@example.com" }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /passwords/:token" do
    it "resets password with valid token" do
      # request reset
      post "/passwords", params: { email_address: user.email_address }
      expect(ActionMailer::Base.deliveries.size).to eq(1)

      token = user.reload.password_reset_token
      password = BCrypt::Password.create("newpassword123")

      patch "/passwords/#{token}", params: { password: password, password_confirmation: password }
      expect(response).to have_http_status(:ok)
    end

    it "returns error with invalid token" do
      patch "/passwords/invalidtoken", params: { password: "newpassword123", password_confirmation: "newpassword123" }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
