class TasksController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_list, only: [:index]
  before_action :set_task, only: %i[show update destroy destroy_file]

  def index
    @tasks = @list.tasks
    render json: @tasks.map { |task| task_to_json(task) }, status: :ok
  end

  def show
    render json: task_to_json(@task), status: :ok
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      render json: task_to_json(@task), status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    attributes = task_params
    files = attributes.delete(:files)

    if @task.update(attributes)
      @task.files.attach(files) if files.present?
      render json: task_to_json(@task), status: :ok
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy_file
    file = @task.files.find(params[:file_id])
    file.purge
    render json: task_to_json(@task.reload), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'File not found' }, status: :not_found
  end

  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end

  def set_list
    @list = List.find(params[:list_id])
  end

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.permit(:title, :due_date, :list_id, :label_id, :description, files: [])
  end

  def task_to_json(task)
    {
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      list_id: task.list_id,
      label_id: task.label_id,
      label: task.label,
      description: task.description.present? ? task.description.body.to_trix_html : nil,
      files: task.files.map do |file|
        {
          id: file.id,
          filename: file.filename.to_s,
          content_type: file.content_type,
          byte_size: file.byte_size,
          url: rails_blob_path(file, only_path: true)
        }
      end
    }
  end
end
