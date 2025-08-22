require 'rails_helper'

RSpec.describe "Sessions API", type: :request do
  let!(:user) { create(:user) }

  describe "POST /session" do
    it "logs in with valid credentials" do
      post "/session", params: { email_address: user.email_address, password: "password123" }

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["email_address"]).to eq(user.email_address)
    end

    it "fails with invalid credentials" do
      post "/session", params: { email_address: user.email_address, password: "wrong" }

      expect(response).to have_http_status(:unauthorized)
      json = JSON.parse(response.body)      
      expect(json).to have_key("error")
    end
  end

  describe "GET /session" do
    it "returns current user when logged in" do
      post "/session", params: { email_address: user.email_address, password: "password123" }
      get "/session"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["email_address"]).to eq(user.email_address)
    end
  end

  describe "DELETE /session" do
    it "logs out successfully" do
      post "/session", params: { email_address: user.email_address, password: "password123" }
      delete "/session"

      expect(response).to have_http_status(:no_content)
    end
  end
end
