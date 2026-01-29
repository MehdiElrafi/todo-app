namespace :update_list_position do
  desc "Update list positions based on their created_at timestamps"
  task update_positions: :environment do
    ActiveRecord::Base.transaction do
      Project.includes(:lists).find_each do |project|
        puts "Updating positions for Project ID: #{project.id}"  
        project.lists.order(:created_at).each_with_index do |list, index|
          puts "Setting List ID: #{list.id} to position #{index + 1}"
          list.update(position: index + 1)
        end
      end
      puts "List positions updated successfully."
    rescue StandardError => e
      puts "✗ Error processing Project ID: #{e.message}"
    end
  end
end
