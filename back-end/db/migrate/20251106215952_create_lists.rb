class CreateLists < ActiveRecord::Migration[8.0]
  def up
    create_table :lists do |t|
      t.string :name, null: false

      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end

  def down
    drop_table :lists
  end
end
