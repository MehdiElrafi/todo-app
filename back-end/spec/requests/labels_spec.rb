require 'rails_helper'

RSpec.describe "Labels", type: :request do
  let(:project) { create(:project) }
  let(:label) { create(:label) }
  let(:user) { create(:user) }

  let(:valid_attributes) do
    { name: "Important", color: "#00FF00", project_id: project.id }
  end

  let(:invalid_attributes) do
    { name: "", color: "invalid-color", project_id: project.id }
  end

  before do
    login user
  end

  describe "GET /index" do
    it "returns a success response" do
      Label.create!(name: "Urgent", color: "#FF0000", project_id: project.id)
      get project_labels_path(project_id: project.id)
      expect(response).to be_successful
      expect(response.body).to include("Urgent")
    end
  end

  describe "GET /show" do
    it "returns a success response" do
      get project_label_path(project_id: project.id, id: label.id)
      expect(response).to be_successful
      expect(response.body).to include(label.name)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Label" do
        post project_labels_path(project_id: project.id), params: valid_attributes
        expect(response).to have_http_status(:created)
        expect(response.body).to include("Important")
      end
    end

    context "with invalid parameters" do
      it "does not create a new Label" do
        post project_labels_path(project_id: project.id), params: invalid_attributes
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
        put project_label_path(project_id: project.id, id: label.id), params: new_attributes
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
        put project_label_path(project_id: project.id, id: label.id), params: invalid_attributes
        label.reload
        expect(label.name).not_to eq("")
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested label" do
      delete project_label_path(project_id: project.id, id: label.id)
      expect(response).to have_http_status(:no_content)
    end
  end
end
