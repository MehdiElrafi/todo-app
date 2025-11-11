FactoryBot.define do
  factory :task do
    list { List.first || create(:list) }
    due_date { Time.zone.today + 7.days }
    title { "Sample Task" }
  end
end
