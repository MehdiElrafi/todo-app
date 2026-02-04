FactoryBot.define do
  factory :task do
    title { "Sample Task" }
    due_date { Time.zone.today + 7.days }
    list { List.first || create(:list) }
    description { "This is a rich text description." }
  end
end
