require 'rails_helper'

RSpec.describe "Health Check", type: :request do
  describe "GET /up" do
    it "returns a successful response" do
      get "/up"
      expect(response).to have_http_status(:ok)
    end
  end
end
