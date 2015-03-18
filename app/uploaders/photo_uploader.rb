class PhotoUploader < ImageUploader
	
	process :resize_to_fit => [1024, 768]
  process :change_res => '72'

  version :thumb do
    process :resize_to_fill => [89,89]
  end

  def change_res(dpi)
    manipulate! do |img|
      img.density dpi
      img = yield(img) if block_given?
      img
    end
  end

  def store_dir
    if model.imageable_type == "Band"
      "uploads/bands/#{model.imageable.id.to_s.parameterize}/photos/"
    elsif model.imageable_type == "Song"
      "uploads/bands/#{model.imageable.album.band.id.to_s.parameterize}/albums/#{model.imageable.album.id.to_s.parameterize}/songs/#{model.imageable.id.to_s.parameterize}/slideshow/"
    end
  end

end