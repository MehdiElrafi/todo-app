class ListsController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_list, only: %i[show update destroy]

  def index
    @lists = @project.lists
    render json: @lists
  end

  def show
    render json: @list, status: :ok
  end

  def create
    @list = List.new(list_params)
    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def update
    if @list.update(list_params)
      render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list.destroy
    head :no_content
  end

  private

  def list_params
    params.permit(:name, :position, :project_id)
  end

  def set_list
    @list = List.find(params[:id])
  end

  def set_project
    @project = Project.find(params[:project_id])
  end
end
