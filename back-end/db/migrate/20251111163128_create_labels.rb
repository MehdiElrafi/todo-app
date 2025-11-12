class CreateLabels < ActiveRecord::Migration[8.0]
  def up
    create_table :labels do |t|
      t.string :name, null: false
      t.string :color

      t.timestamps
    end
  end

  def down
    drop_table :labels
  end
end
