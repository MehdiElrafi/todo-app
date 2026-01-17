class AddProjectToLabel < ActiveRecord::Migration[8.0]
  def up
    add_reference :labels, :project, null: false, foreign_key: true
  end

  def down
    remove_reference :labels, :project, foreign_key: true
  end
end
