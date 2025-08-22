class ApplicationController < ActionController::API
  include ActionController::Helpers
  include ActionController::Cookies
  include Authentication
end
