class AddPositionToList < ActiveRecord::Migration[8.0]
  def up
    add_column :lists, :position, :integer
  end

  def down
    remove_column :lists, :position
  end
end
