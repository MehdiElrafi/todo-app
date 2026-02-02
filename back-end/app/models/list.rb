class List < ApplicationRecord
  belongs_to :project
  has_many :tasks, dependent: :destroy

  validates :name, :position, presence: true
  validates :position, uniqueness: { scope: :project_id }
  validates :position, numericality: { only_integer: true, greater_than: 0 }
  attr_accessor :skip_set_position

  before_validation :set_position, unless: :skip_set_position
  after_destroy :reorder_positions

  private

  def set_position
    return if project.nil?
    return if position.present?

    max_position = project.lists.maximum(:position) || 0
    self.position = max_position + 1
  end

  def reorder_positions
    project.lists.order(:position).each_with_index do |list, index|
      list.skip_set_position = true
      list.position = index + 1
      list.save!
    end
  end
end
