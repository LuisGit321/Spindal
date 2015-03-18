class EncodingUpdateWorker
  include Sidekiq::Worker

  def perform(song_id)
    song = Song.find(song_id)
    response = Zencoder::Job.details(song.encoding_details["job_id"])

    job = response.body["job"]
    omfs = job["output_media_files"]

    song.encoding_details["state"] = job['state']
    song.initialize_song_encodings_from_zencoder(omfs)
    song.save!
  end
end
