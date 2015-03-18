# encoding: utf-8
require 'carrierwave/processing/mime_types'

class SongUploader < CarrierWave::Uploader::Base
  include CarrierWave::MimeTypes

  storage :fog
  process :set_content_type
  after :store, :encode_song

  def store_dir
    "uploads/bands/#{model.band.id.to_s.parameterize}/albums/#{model.album.id.to_s.parameterize}/songs/#{model.id.to_s.parameterize}"
  end

  def extension_white_list
    %w(mp3 flac aac)
  end

  def filename
    "original.#{File.extname(super)}" if original_filename.present?
  end

  def s3_base_url
    "s3://#{fog_directory}/#{store_dir}"
  end

  protected

  def encode_song(song)
    EncodingWorker.perform_in(30.seconds, model.id)
  end
end
