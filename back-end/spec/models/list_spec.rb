require 'rails_helper'

RSpec.describe List, type: :model do
  describe 'associations' do
    it { expect(described_class.reflect_on_association(:project).macro).to eq(:belongs_to) }
    it { expect(described_class.reflect_on_association(:tasks).macro).to eq(:has_many) }
  end

  describe 'validations' do
    it "validates presence of name" do
      list = List.new(name: nil)

      expect(list.valid?).to be_falsey
      expect(list.errors[:name]).to include("can't be blank")
    end
  end
end
