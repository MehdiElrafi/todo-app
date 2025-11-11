class LabelsController < ApplicationController
  before_action :set_label, only: %w[show update destroy]

  # GET /labels
  def index
    @labels = Label.all
    render json: @labels
  end

  # GET /labels/:id
  def show
    render json: @label
  end

  # POST /labels
  def create
    @label = Label.new(label_params)
    if @label.save
      render json: @label, status: :created
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  # PUT /labels/:id
  def update
    if @label.update(label_params)
      render json: @label, status: :ok
    else
      render json: @label.errors, status: :unprocessable_entity
    end
  end

  # DELETE /labels/:id
  def destroy
    @label.destroy
    head :no_content
  end

  private

  def set_label
    @label = Label.find(params[:id])
  end

  def label_params
    params.permit(:name, :color)
  end
end
