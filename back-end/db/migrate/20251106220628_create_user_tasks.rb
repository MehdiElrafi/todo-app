class CreateUserTasks < ActiveRecord::Migration[8.0]
  def up
    create_table :user_tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end

  def down
    drop_table :user_tasks
  end
end
