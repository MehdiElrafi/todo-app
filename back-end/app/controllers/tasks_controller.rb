class TasksController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_list, only: [:index]
  before_action :set_task, only: %i[show update destroy]

  def index
    @tasks = @list.tasks
    render json: @tasks, include: :label, status: :ok
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
    if @task.update(task_params)
      render json: task_to_json(@task), status: :ok
    else
      render json: @task.errors, status: :unprocessable_entity
    end
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
      description: task.description.present? ? task.description.body.to_trix_html : nil
    }
  end
end
