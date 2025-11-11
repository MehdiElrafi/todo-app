class CreateProjects < ActiveRecord::Migration[8.0]
  def up
    create_table :projects do |t|
      t.string :name, null: false

      t.timestamps
    end
  end

  def down
    drop_table :projects
  end
end
