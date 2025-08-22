class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    render json: { error: "Try again later." }, status: :unauthorized
  }

  def show
    if Current.session
      render json: Current.session.user, status: :ok
    else
      render json: { error: "No active session" }, status: :unauthorized
    end
  end

  def new
  end

  def create
    if (user = User.authenticate_by(params.permit(:email_address, :password)))
      start_new_session_for user
      render json: user, status: :created
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    terminate_session
    render status: :no_content
  end
end
