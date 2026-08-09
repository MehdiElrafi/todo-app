FactoryBot.define do
  factory :user do
    first_name { "Jane" }
    last_name { "Doe" }
    sequence(:email_address) { |n| "user#{n}@example.com" }
    password_digest { BCrypt::Password.create("password123") }
  end
end
