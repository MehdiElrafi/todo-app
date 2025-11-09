class List < ApplicationRecord
  belongs_to :project
  has_many :tasks, dependent: :destroy

  validates :name, presence: true
end
