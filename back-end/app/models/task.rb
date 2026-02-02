class Task < ApplicationRecord
  belongs_to :list
  belongs_to :label, optional: true

  has_many :user_tasks, dependent: :destroy
  has_many :users, through: :user_tasks

  validates :title, presence: true
  has_rich_text :description
end
