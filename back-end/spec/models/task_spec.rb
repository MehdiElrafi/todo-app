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

  describe 'file attachments' do
    let(:task) { create(:task) }

    it 'can attach a single file' do
      file = fixture_file_upload('test.txt', 'text/plain')
      task.files.attach(file)

      expect(task.files.count).to eq(1)
      expect(task.files.first.filename).to eq('test.txt')
    end

    it 'can attach multiple files' do
      file1 = fixture_file_upload('test.txt', 'text/plain')
      file2 = fixture_file_upload('test.pdf', 'application/pdf')
      task.files.attach([file1, file2])

      expect(task.files.count).to eq(2)
    end

    it 'persists attached files after save' do
      file = fixture_file_upload('test.txt', 'text/plain')
      task.files.attach(file)
      task.save

      reloaded_task = Task.find(task.id)
      expect(reloaded_task.files.count).to eq(1)
      expect(reloaded_task.files.first.filename).to eq('test.txt')
    end
  end
end
