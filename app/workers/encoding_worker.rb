class EncodingWorker
  include Sidekiq::Worker

  def perform(song_id)
    song = Song.find(song_id)

    response = Zencoder::Job.create(
      input: song.file.url,
      outputs: [{
        format: "mp3",
        url: target_s3_url(song, "mp3_lq.mp3"),
        audio_bitrate: 128
      },
      {
        format: "oga",
        url: target_s3_url(song, "ogg_lq.oga"),
        audio_bitrate: 128
      },
      {
        format: "oga",
        url: target_s3_url(song, "ogg_hq.oga"),
        audio_bitrate: 320
      },
      {
        format: "mp3",
        url: target_s3_url(song, "mp3_hq.mp3"),
        audio_bitrate: 320
      }]
    )

    notify_airbrake(song, response) and return unless response.code == "201"

    song.encoding_details = {
      job_id: response.body['id'],
      state: "pending"
    }
    song.save!
  end

  protected

  def target_s3_url(song, filename)
    File.join(song.file.s3_base_url, filename)
  end

  def notify_airbrake(song, zencoder_response)
    # TODO: An error occurred. :/
    raise "An error occurred for Song ##{song.id}! #{zencoder_response.inspect}"
  end

end
