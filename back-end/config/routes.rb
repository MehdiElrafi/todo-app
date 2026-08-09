Rails.application.routes.draw do
  resource :session
  resources :projects do
    resources :labels
    resources :lists do
      resources :tasks do
        delete 'files/:file_id', to: 'tasks#destroy_file', on: :member
      end
    end
  end

  resources :passwords, param: :token
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
