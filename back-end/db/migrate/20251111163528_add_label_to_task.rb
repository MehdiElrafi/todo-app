class AddLabelToTask < ActiveRecord::Migration[8.0]
  def up
    add_reference :tasks, :label, foreign_key: true, null: true
  end

  def down
    remove_reference :tasks, :label, foreign_key: true
  end
end
