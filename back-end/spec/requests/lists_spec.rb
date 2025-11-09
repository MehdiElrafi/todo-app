require 'rails_helper'

RSpec.describe "Lists API", type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let(:list) { create(:list, project:) }

  before do
    login user
  end
  describe "GET /index" do
    it "returns a successful response" do
      get project_lists_path(project)
      expect(response).to have_http_status(:ok)
    end

    it "render all lists" do
      create(:list, name: "Groceries", project:)
      create(:list, name: "Chores", project:)

      get project_lists_path(project)
      expect(response.body).to include("Groceries")
      expect(response.body).to include("Chores")
    end
  end

  describe "GET /show" do
    it "returns a successful response" do
      get project_list_path(project, list)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /create" do
    it "creates a new list" do
      list_params = { name: "New List", project_id: project.id }

      post project_lists_path(project), params: list_params
      expect(response).to have_http_status(:created)
      expect(response.body).to include("New List")
    end
  end

  describe "PUT /update" do
    it "updates an existing list" do
      update_params = { name: "Updated List Name" }

      put project_list_path(project, list), params: update_params
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Updated List Name")
    end
  end

  describe "DELETE /destroy" do
    it "deletes a list" do
      delete project_list_path(project, list)
      expect(response).to have_http_status(:no_content)
    end
  end
end
