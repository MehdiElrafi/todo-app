require 'rails_helper'

RSpec.describe "Projects API", type: :request do
  let!(:user) { create(:user) }
  let(:project) { create(:project) }

  before do
    login user
  end
  describe "GET /index" do
    it "returns a successful response" do
      get projects_path
      expect(response).to have_http_status(:ok)
    end

    it "render all projects" do
      create(:project, name: "Project Alpha")
      create(:project, name: "Project Beta")

      get projects_path
      expect(response.body).to include("Project Alpha")
      expect(response.body).to include("Project Beta")
    end
  end

  describe "GET /show" do
    it "returns a successful response" do
      get project_path(project)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /create" do
    it "creates a new project" do
      project_params = { name: "New Project" }

      post projects_path, params: project_params
      expect(response).to have_http_status(:created)
      expect(response.body).to include("New Project")
    end
  end

  describe "PUT /update" do
    it "updates an existing project" do
      update_params = { name: "Updated Project Name" }

      put project_path(project), params: update_params
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Updated Project Name")
    end
  end

  describe "DELETE /destroy" do
    it "deletes a project" do
      delete project_path(project)
      expect(response).to have_http_status(:no_content)
    end
  end
end
