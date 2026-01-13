class Label < ApplicationRecord
  has_many :tasks, dependent: :nullify
  belongs_to :project

  validates :name, presence: true
  validate :color_format

  private

  def color_format
    return if color.blank?
    return if color.match?(/\A#(?:[0-9a-fA-F]{3}){1,2}\z/)

    errors.add(:color, 'must be a valid hex color code')
  end
end
