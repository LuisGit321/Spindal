namespace :song_clock do

  desc "Runs the scheduler for Song background tasks."
  task run: :environment do
    require 'eventmachine'
    EventMachine.run {
      EventMachine::PeriodicTimer.new(3.minutes) {
        Song.requires_encoding.each do |song|
          puts "Running encode on: #{song.inspect}"
          EncodingUpdateWorker.perform_async(song.id)
        end
      }
    }
  end
end
