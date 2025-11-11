require 'rails_helper'

RSpec.describe "Labels", type: :request do
  let(:label) { create(:label) }
  let(:user) { create(:user) }

  let(:valid_attributes) do
    { name: "Important", color: "#00FF00" }
  end

  let(:invalid_attributes) do
    { name: "", color: "invalid-color" }
  end

  before do
    login user
  end

  describe "GET /index" do
    it "returns a success response" do
      Label.create!(name: "Urgent", color: "#FF0000")
      get labels_path
      expect(response).to be_successful
      expect(response.body).to include("Urgent")
    end
  end

  describe "GET /show" do
    it "returns a success response" do
      get label_path(label)
      expect(response).to be_successful
      expect(response.body).to include(label.name)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Label" do
        post labels_path, params: valid_attributes
        expect(response).to have_http_status(:created)
        expect(response.body).to include("Important")
      end
    end

    context "with invalid parameters" do
      it "does not create a new Label" do
        post labels_path, params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT /update" do
    context "with valid parameters" do
      let(:new_attributes) do
        { name: "Not Urgent", color: "#0000FF" }
      end

      it "updates the requested label" do
        put label_path(label), params: new_attributes
        label.reload
        expect(label.name).to eq("Not Urgent")
        expect(label.color).to eq("#0000FF")
        expect(response).to be_successful
        expect(response).to have_http_status(:ok)
        expect(response.body).to include("Not Urgent")
      end
    end

    context "with invalid parameters" do
      it "does not update the label" do
        put label_path(label), params: invalid_attributes
        label.reload
        expect(label.name).not_to eq("")
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested label" do
      delete label_path(label)
      expect(response).to have_http_status(:no_content)
    end
  end
end
