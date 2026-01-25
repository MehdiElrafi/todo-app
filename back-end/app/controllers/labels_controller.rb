class LabelsController < ApplicationController
  before_action :set_label, only: %w[show update destroy]

  # GET /projects/:project_id/labels
  def index
    @labels = Label.where(project_id: params[:project_id])
    render json: @labels
  end

  # GET /projects/:project_id/labels/:id
  def show
    render json: @label
  end

  # POST /projects/:project_id/labels
  def create
    @label = Label.new(label_params)
    if @label.save
      render json: @label, status: :created
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  # PUT /projects/:project_id/labels/:id
  def update
    if @label.update(label_params)
      render json: @label, status: :ok
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  # DELETE /projects/:project_id/labels/:id
  def destroy
    @label.destroy
    head :no_content
  end

  private

  def set_label
    @label = Label.find(params[:id])
  end

  def label_params
    params.permit(:name, :color, :project_id)
  end
end
