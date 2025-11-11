class CreateTasks < ActiveRecord::Migration[8.0]
  def up
    create_table :tasks do |t|
      t.string :title, null: false
      t.date :due_date

      t.references :list, null: false, foreign_key: true

      t.timestamps
    end
  end

  def down
    drop_table :tasks
  end
end
