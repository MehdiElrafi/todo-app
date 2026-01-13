require 'rails_helper'

RSpec.describe Label, type: :model do
  describe 'associations' do
    it { expect(described_class.reflect_on_association(:tasks).macro).to eq(:has_many) }
    it { expect(described_class.reflect_on_association(:project).macro).to eq(:belongs_to) }
  end

  describe 'validations' do
    it "validates presence of name" do
      label = Label.new(name: nil)

      expect(label.valid?).to be_falsey
      expect(label.errors[:name]).to include("can't be blank")
    end

    it "invalid format of color" do
      label = Label.new(name: "Test", color: "invalid-color")

      expect(label.valid?).to be_falsey
      expect(label.errors[:color]).to include("must be a valid hex color code")
    end

    it "valid format of color" do
      label = Label.new(name: "Test", color: "#FFAABB")

      expect(label.valid?).to be_truthy
    end
  end
end
