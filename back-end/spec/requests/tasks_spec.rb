require 'rails_helper'

RSpec.describe "Tasks API", type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project) }
  let!(:list) { create(:list, project:) }
  let(:task) { create(:task, list:) }

  before do
    login user
  end

  let(:valid_params) do
    {
      title: "New Task",
      due_date: Time.zone.today + 3.days,
      list_id: list.id
    }
  end

  let(:invalid_params) do
    {
      title: "",
      due_date: Time.zone.today + 3.days,
      list_id: list.id
    }
  end
  describe "GET /index" do
    it "returns a successful response" do
      get project_list_tasks_path(project, list)
      expect(response).to have_http_status(:ok)
    end

    it "render all tasks" do
      create(:task, title: "Buy milk", list:)
      create(:task, title: "Clean room", list:)

      get project_list_tasks_path(project, list)
      expect(response.body).to include("Buy milk")
      expect(response.body).to include("Clean room")
    end
  end

  describe "GET /show" do
    it "returns a successful response" do
      get project_list_task_path(project, list, task)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /create" do
    it "creates a new task" do
      post project_list_tasks_path(project, list), params: valid_params
      expect(response).to have_http_status(:created)
      expect(response.body).to include("New Task")
    end

    it "returns error for invalid parameters" do
      post project_list_tasks_path(project, list), params: invalid_params
      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.body).to include("can't be blank")
    end
  end

  describe "PUT /update" do
    it "updates the task" do
      update_params = {
        title: "Updated Task Title"
      }

      put project_list_task_path(project, list, task), params: update_params
      expect(response).to have_http_status(:ok)
      expect(response.body).to include("Updated Task Title")
    end

    it "returns error for invalid update parameters" do
      put project_list_task_path(project, list, task), params: invalid_params
      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.body).to include("can't be blank")
    end
  end

  describe "DELETE /destroy" do
    it "deletes the task" do
      delete project_list_task_path(project, list, task)
      expect(response).to have_http_status(:no_content)
    end
  end
end
