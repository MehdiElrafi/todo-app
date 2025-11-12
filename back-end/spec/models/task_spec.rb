require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'associations' do
    it { expect(described_class.reflect_on_association(:list).macro).to eq(:belongs_to) }
    it { expect(described_class.reflect_on_association(:user_tasks).macro).to eq(:has_many) }
    it { expect(described_class.reflect_on_association(:users).macro).to eq(:has_many) }
    it { expect(described_class.reflect_on_association(:label).macro).to eq(:belongs_to) }
  end

  describe 'validations' do
    it "validates presence of title" do
      task = Task.new(title: nil)

      expect(task.valid?).to be_falsey
      expect(task.errors[:title]).to include("can't be blank")
    end
  end
end
