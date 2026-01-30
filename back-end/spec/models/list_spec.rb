require 'rails_helper'

RSpec.describe List, type: :model do
  let(:project) { create(:project) }

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

  describe '#set_position on create' do
    it 'automatically sets position when creating a new list' do
      list1 = project.lists.create!(name: 'First List')
      list2 = project.lists.create!(name: 'Second List')
      list3 = project.lists.create!(name: 'Third List')

      expect(list1.position).to eq(1)
      expect(list2.position).to eq(2)
      expect(list3.position).to eq(3)
    end
  end

  describe '#set_position on update' do
    it 'does not change position when updating other attributes' do
      list = project.lists.create!(name: 'Original Name')
      original_position = list.position

      list.update!(name: 'Updated Name')

      expect(list.position).to eq(original_position)
    end
  end

  describe '#reorder_positions on destroy' do
    it 'reorders remaining lists after deleting a list' do
      list1 = project.lists.create!(name: 'First List')
      list2 = project.lists.create!(name: 'Second List')
      list3 = project.lists.create!(name: 'Third List')

      list2.destroy

      expect(list1.reload.position).to eq(1)
      expect(list3.reload.position).to eq(2)
    end
  end
end
