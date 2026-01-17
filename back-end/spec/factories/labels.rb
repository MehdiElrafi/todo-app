FactoryBot.define do
  factory :label do
    name { "Urgent" }
    color { "#FF0000" }
    association :project
  end
end
