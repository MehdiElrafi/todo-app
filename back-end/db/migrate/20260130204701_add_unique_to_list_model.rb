class AddUniqueToListModel < ActiveRecord::Migration[8.0]
  def up
    change_column_null :lists, :position, false
    add_index :lists, %i[project_id position], unique: true
  end

  def down
    remove_index :lists, column: %i[project_id position]
    change_column_null :lists, :position, true
  end
end
