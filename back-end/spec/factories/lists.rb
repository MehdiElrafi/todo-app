FactoryBot.define do
  factory :list do
    project { Project.first || create(:project) }
    name { "Sample List" }
  end
end
