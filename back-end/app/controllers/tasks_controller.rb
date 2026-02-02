class TasksController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_list, only: [:index]
  before_action :set_task, only: %i[show update destroy]

  def index
    @tasks = @list.tasks
    render json: @tasks, include: :label
  end

  def show
    render json: @task, include: :label, status: :ok
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      render json: @task, include: :label, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task, include: :label, status: :ok
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
    params.permit(:title, :due_date, :list_id, :label_id, :description)
  end
end
