require 'rails_helper'
require 'rake'

RSpec.describe 'update_list_position:update_positions', type: :task do
  before(:all) do
    Rails.application.load_tasks if Rake::Task.tasks.empty?
  end

  let(:task) { Rake::Task['update_list_position:update_positions'] }

  before do
    task.reenable
  end

  describe 'rake update_list_position:update_positions' do
    context 'when projects have lists' do
      let!(:project) { create(:project) }
      let!(:list3) { create(:list, project: project, created_at: 3.days.ago) }
      let!(:list1) { create(:list, project: project, created_at: 5.days.ago) }
      let!(:list2) { create(:list, project: project, created_at: 4.days.ago) }

      it 'orders lists by created_at timestamp (oldest first)' do
        # rubocop:disable Rails/SkipsModelValidations
        list1.update_column(:position, 0)
        list2.update_column(:position, 10)
        list3.update_column(:position, 20)
        # rubocop:enable Rails/SkipsModelValidations
        task.invoke

        expect(list1.reload.position).to eq(1) # Oldest
        expect(list2.reload.position).to eq(2) # Middle
        expect(list3.reload.position).to eq(3) # Newest
      end

      it 'outputs success message' do
        expect { task.invoke }.to output(/List positions updated successfully/).to_stdout
      end
    end

    context 'when there are multiple projects' do
      let!(:project1) { create(:project) }
      let!(:project2) { create(:project) }
      let!(:list1_p1) { create(:list, project: project1, created_at: 2.days.ago) }
      let!(:list2_p1) { create(:list, project: project1, created_at: 1.day.ago) }
      let!(:list1_p2) { create(:list, project: project2, created_at: 3.days.ago) }
      let!(:list2_p2) { create(:list, project: project2, created_at: 2.days.ago) }

      it 'updates positions for all projects independently' do
        task.invoke

        expect(list1_p1.reload.position).to eq(1)
        expect(list2_p1.reload.position).to eq(2)
        expect(list1_p2.reload.position).to eq(1)
        expect(list2_p2.reload.position).to eq(2)
      end
    end

    context 'when a project has no lists' do
      let!(:project_with_lists) { create(:project) }
      let!(:project_without_lists) { create(:project) }
      let!(:list) { create(:list, project: project_with_lists, created_at: 1.day.ago) }

      it 'processes successfully without errors' do
        expect { task.invoke }.not_to raise_error
      end

      it 'still processes other projects' do
        task.invoke
        expect(list.reload.position).to eq(1)
      end
    end

    context 'when lists already have positions' do
      let!(:project) { create(:project) }
      let!(:list1) { create(:list, project: project, created_at: 3.days.ago, position: 5) }
      let!(:list2) { create(:list, project: project, created_at: 2.days.ago, position: 10) }
      let!(:list3) { create(:list, project: project, created_at: 1.day.ago, position: 3) }

      it 'reorders positions based on created_at regardless of current position' do
        task.invoke

        expect(list1.reload.position).to eq(1) # Oldest
        expect(list2.reload.position).to eq(2) # Middle
        expect(list3.reload.position).to eq(3) # Newest
      end
    end

    context 'when an error occurs during processing' do
      let!(:project) { create(:project) }
      let!(:list) { create(:list, project: project, created_at: 1.day.ago) }

      before do
        allow_any_instance_of(List).to receive(:update).and_raise(StandardError.new('Database error'))
      end

      it 'outputs error message' do
        expect { task.invoke }.to output(/✗ Error processing Project ID: Database error/).to_stdout
      end

      it 'does not raise an error (handles gracefully)' do
        expect { task.invoke }.not_to raise_error
      end

      it 'rolls back transaction on error' do
        expect { task.invoke }.not_to(change { list.reload.position })
      end
    end
  end
end
