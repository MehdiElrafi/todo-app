class Task < ApplicationRecord
  belongs_to :list

  has_many :user_tasks, dependent: :destroy
  has_many :users, through: :user_tasks

  validates :title, presence: true
end
