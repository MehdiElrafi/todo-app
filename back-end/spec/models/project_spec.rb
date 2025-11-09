require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'associations' do
    it { expect(described_class.reflect_on_association(:lists).macro).to eq(:has_many) }
  end

  describe 'validations' do
    it "requires name" do
      project = Project.new(name: nil)

      expect(project).not_to be_valid
      expect(project.errors[:name]).to include("can't be blank")
    end
  end
end
